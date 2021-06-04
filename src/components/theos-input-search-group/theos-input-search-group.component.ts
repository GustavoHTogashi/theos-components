import { CurrencyPipe, DatePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	OnDestroy,
	OnInit,
	ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { noop, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { HttpRequestService } from 'src/services/http-request/http-request.service';
import { TheosLoaderService } from '../theos-loader/theos-loader.service';
import {
	SearchConfig,
	TheosSearchDialogComponent,
	TheosSearchDialogSelectOption
} from '../theos-search-dialog/theos-search-dialog.component';
import { Condition } from '../_models/search-dialog-field-options.model';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';

@Component({
  selector: 'theos-input-search-group',
  templateUrl: './theos-input-search-group.component.html',
  styleUrls: ['./theos-input-search-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheosInputSearchGroupComponent implements OnInit, OnDestroy {
  @Input() id = 'THInputSearchGroup';
  @Input() dialogTitle = 'Busca';
  @Input() group: FormGroup;

  @Input() label: InputSearchGroupMsgConfig = {
    code: 'Código',
    description: 'Descrição',
  };
  @Input() placeholder: InputSearchGroupMsgConfig = {
    code: '',
    description: '',
  };

  @Input() endpoint = 'http://';
  @Input() filters: TheosSearchDialogSelectOption[] = [];
  @Input() extraFilters: any;
  @Input() columns: ColDef[] = null;
  @Input() telaSistema: number;
  @Input() apiType: 'accounting' | 'core';

  @Input() showOrganismOption = false;
  @Input() enableMultiFilterSearch = false;

  @Input() extraProps: any;
  @Input() customDescriptionSearchDialogField: string;
  @Input() customCodeSearchDialogField: string;
  @Input() codigoMenuWeb: string | number;
  @Input() shouldValidate = true;

  @ViewChild('thInputSearchCode', { static: true }) inputSearchCode: ElementRef;
  @ViewChild('thInputSearchDescription', { static: true })
  inputSearchDescription: ElementRef;

  prefix = THEOS_COMPONENTS_PREFIXES.inputSearchGroup;

  private _lastSearchValue = { codigo: null, descricao: null };

  private _dialogIsOpen = false;

  private _inputChanged = false;

  private readonly _COMPONENT_DESTROY$ = new Subject<void>();

  private readonly _IS_MAC = window.navigator.platform === 'MacIntel';

  readonly ID = 'id';
  readonly CODE = 'codigo';
  readonly DESCRIPTION = 'descricao';

  private readonly _DATE_VALUE_FORMATTER = (params: any) =>
    params.value && params.value.substring(4, 5) === '-'
      ? new DatePipe('pt-BR').transform(params.value, 'dd/MM/yyyy')
      : params.value;

  private readonly _CURRENCY_VALUE_FORMATTER = (params: any) =>
    new CurrencyPipe('pt-BR').transform(params.value, 'BRL', 'symbol', '1.2-2');

  private readonly _BOOL_VALUE_FORMATTER = (params: any) =>
    params.value ? 'Sim' : 'Não';

  private readonly _SITUATION_VALUE_FORMATTER = (params: any) =>
    params.value === 1 ? 'Ativo' : 'Inativo';

  constructor(
    private _cdr: ChangeDetectorRef,
    private _dialog: MatDialog,
    private _http: HttpRequestService,
    private _loader: TheosLoaderService
  ) {}

  C = (name: string) => this.group?.get(name) as FormControl;

  ngOnInit(): void {
    this._createFG();
    this._createColumns();

    this._lastSearchValue[this.CODE] = this.C(this.CODE).value;
    this._lastSearchValue[this.DESCRIPTION] = this.C(this.DESCRIPTION).value;
  }

  ngOnDestroy(): void {
    this._COMPONENT_DESTROY$.next();
    this._COMPONENT_DESTROY$.complete();
  }

  handleKeyup(e: KeyboardEvent, input: HTMLInputElement, type: string) {
    if (e.key === 'F2' && !this._IS_MAC)
      return this.handleSearch(true, input, type);
    if (e.key === 'F3' && this._IS_MAC)
      return this.handleSearch(true, input, type);

    if (
      e.key === 'Tab' ||
      e.key === 'Enter' ||
      e.key === 'Shift' ||
      e.key === 'Esc'
    ) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }

    if (this.C(type).value === this._lastSearchValue[type]) return;

    Object.keys(this.group.controls).forEach((key) => {
      if (key !== type) this.C(key).setValue(null, { emitEvent: false });
    });
    this._lastSearchValue[type] = this.C(type).value;
    this._inputChanged = true;

    if (!input.value) this._clearFG();
  }

  handleRemove() {
    this._clearFG();
  }

  handleSearch(
    autoSearch: boolean = false,
    input: HTMLInputElement = null,
    type: string = '',
    isEmptyValue = false
  ) {
    if (this._dialogIsOpen) return;

    this._createSearchDialog(autoSearch, input, type, isEmptyValue);
  }

  handleFocus(input: HTMLInputElement, type: string) {
    if (type === this.CODE) {
      input.placeholder = this.placeholder?.code ?? '';
      return;
    }

    if (type === this.DESCRIPTION) {
      input.placeholder = this.placeholder?.description ?? '';
      return;
    }
  }

  isSearching = false;
  handleFocusOut(input: HTMLInputElement, type: string) {
    if (this.isSearching) return;

    input.placeholder = '';

    if (this._dialogIsOpen) return;

    if (this._isEmptyFG()) return;

    if (this.group?.value?.id || !this._inputChanged) return;

    type === this.CODE
      ? this._http.injectEndpoint(`${this.endpoint}/getByCodigo`)
      : this._http.injectEndpoint(`${this.endpoint}/getByDescricao`);

    const BODY = this._createRequestBody(this.group.value);

    this._loader.open();
    this.isSearching = true;
    this._http.post(BODY).subscribe(
      (response) => {
        this.isSearching = false;
        this._resolveResponse(response, input, type);
      },
      () => {
        this.isSearching = false;
        this._clearFG();
        input.focus();
      }
    );
  }

  private _createColumns() {
    if (this.columns) return;
    this.columns = this.filters.reduce((result, filter) => {
      const COL_DEF = {
        headerName: filter.label,
        field: filter.field,
      } as ColDef;

      switch (filter.condition) {
        case Condition.text:
          break;
        case Condition.numeric:
          break;
        case Condition.money:
          COL_DEF.valueFormatter = this._CURRENCY_VALUE_FORMATTER;
          break;
        case Condition.date:
          COL_DEF.valueFormatter = this._DATE_VALUE_FORMATTER;
          break;
        case Condition.bool:
          COL_DEF.valueFormatter = this._BOOL_VALUE_FORMATTER;
          break;
        case Condition.situation:
          COL_DEF.valueFormatter = this._SITUATION_VALUE_FORMATTER;
          break;
        default:
          break;
      }

      result.push(COL_DEF);
      return result;
    }, []);
  }

  private _createFG() {
    if (this.group) {
      this.group.statusChanges
        .pipe(takeUntil(this._COMPONENT_DESTROY$), distinctUntilChanged())
        .subscribe(() => this._cdr.detectChanges());

      this.group.valueChanges
        .pipe(takeUntil(this._COMPONENT_DESTROY$), distinctUntilChanged())
        .subscribe((value) => {
          if (!value) {
            this.group.setValue({ id: null, codigo: null, descricao: null });
          }

          this._cdr.detectChanges();
        });

      return;
    }

    this.group = new FormGroup({});
    [this.ID, this.CODE, this.DESCRIPTION].forEach((key) =>
      this.group.addControl(key, new FormControl(null))
    );
  }

  private _createSearchDialog(
    autoSearch: boolean,
    input: HTMLInputElement,
    type: string,
    isEmptyValue
  ) {
    // this.filters.forEach((filter) => {
    //   filter.default = false;
    // });

    const DEFAULT_FILTER = this.filters.find(
      (filter) =>
        filter.field ===
        (type === this.CODE
          ? this.customCodeSearchDialogField || type
          : this.customDescriptionSearchDialogField || type)
    );

    if (!DEFAULT_FILTER) {
      throw new Error(`Não foi possível encontrar um filtro padrão, 
		verifique se no parâmetro FILTERS existe os fields CÓDIGO | DESCRIÇÃO, caso seja diferente destes, 
		usar o(s) parâmetro(s) CUSTOMCODESEARCHDIALOGFIELD | CUSTOMDESCRIPTIONSEARCHDIALOGFIELD`);
    }

    // DEFAULT_FILTER.default = true;

    let searchVal = null;
    if (autoSearch)
      searchVal = isEmptyValue ? null : this.C(type)?.value ?? null;

    const SEARCH_CONFIG: SearchConfig = {
      id: this.id,
      title: this.dialogTitle,
      endpoint: this.endpoint,
      columns: this.columns,
      autoSearch: autoSearch,
      telaSistema: this.telaSistema,
      extraFilters: { ...this.extraFilters },
      filters: {
        fields: this.filters,
        searchValue: autoSearch
          ? this.C(type).value
            ? this.C(type).value
            : null
          : null,
      },
      apiType: this.apiType ? this.apiType : 'accounting',
      showOrganismOption: this.showOrganismOption,
      codigoMenuWeb: this.codigoMenuWeb,
      enableMultiFilterSearch: this.enableMultiFilterSearch,
    };

    const DIALOG_REF = this._dialog.open(TheosSearchDialogComponent, {
      maxWidth: '1140px',
      hasBackdrop: true,
      backdropClass: 'th-mat-dialog__darker',
      panelClass: 'th-mat-dialog__no-padding',
      data: SEARCH_CONFIG,
      autoFocus: false,
    });
    this._dialogIsOpen = true;
    this._createDialogListeners(DIALOG_REF, input);
  }

  private _createDialogListeners(
    dialogRef: MatDialogRef<TheosSearchDialogComponent>,
    input: HTMLInputElement
  ) {
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this._COMPONENT_DESTROY$))
      .subscribe(($event: any) => {
        this._dialogIsOpen = false;
        if (!$event || !$event.selected) {
          !this.C(this.ID).value ? this._clearFG() : noop();
          input ? input.focus() : noop();
          this._cdr.detectChanges();
          return;
        }

        // TODO aqui implementar logica para multiseleção
        if (Array.isArray($event.selected)) return;

        const { selected: SELECTED } = $event;
        if (this.customCodeSearchDialogField) {
          SELECTED[this.CODE] = SELECTED[this.customCodeSearchDialogField];
        }

        if (this.customDescriptionSearchDialogField) {
          SELECTED[this.DESCRIPTION] =
            SELECTED[this.customDescriptionSearchDialogField];
        }
        this.group.patchValue(SELECTED);

        this.C(this.ID).markAsDirty();
        input ? input.focus() : noop();
        this._cdr.detectChanges();
      });
  }

  private _clearFG(ignored: string[] = []) {
    Object.keys(this.group.controls).forEach((key) => {
      if (ignored.includes(key)) return;
      this.C(key).setValue(null);
    });
  }

  private _isEmptyFG(fg: FormGroup = this.group) {
    return Object.keys(fg.controls).every(
      (key) => fg.controls[key].value === '' || fg.controls[key].value === null
    );
  }

  private _createRequestBody(data: any): InputSearchRequestBodyConfig {
    return {
      ...data,
      ...this.extraProps,
      telaSistema: this.telaSistema,
    };
  }

  private _resolveResponse(
    response: any,
    input: HTMLInputElement = null,
    type: string
  ) {
    if (this._arrayIsEmpty(response)) {
      this.handleSearch(true, input, type, true);
      return;
    }

    if (this._arrayIsSingle(response)) {
      const [RESULT] = response;
      this.group.patchValue(RESULT);
      this._cdr.detectChanges();
      input ? input.focus() : noop();
      return;
    }

    this.handleSearch(true, input, type);
  }

  private _arrayIsEmpty(array: any[]) {
    return Array.isArray(array) && array.length === 0;
  }

  private _arrayIsSingle(array: any[]) {
    return Array.isArray(array) && array.length === 1;
  }

  get codeHasValue() {
    return this.C(this.CODE).value ? true : null;
  }

  get descriptionHasValue() {
    return this.C(this.DESCRIPTION).value ? true : null;
  }

  get invalid() {
    return this.shouldValidate && this.C(this.ID)?.invalid && this.group?.dirty;
  }

  get valid() {
    return this.shouldValidate && this.C(this.ID)?.valid && this.group?.dirty;
  }

  get hasValidator() {
    return this.C(this.ID)?.validator?.length > 0;
  }

  get disabled() {
    return this.group?.disabled;
  }
}

interface InputSearchRequestBodyConfig {
  descricao: string;
  organismoId?: number;
  telaSistema?: number;
}

export interface InputSearchGroupMsgConfig {
  code: string;
  description: string;
}
