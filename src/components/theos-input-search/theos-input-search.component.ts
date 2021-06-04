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
	TheosSearchDialogComponent, TheosSearchDialogSelectOption
} from '../theos-search-dialog/theos-search-dialog.component';
import { Condition } from '../_models/search-dialog-field-options.model';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';


@Component({
  selector: 'theos-input-search',
  templateUrl: './theos-input-search.component.html',
  styleUrls: ['./theos-input-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheosInputSearchComponent implements OnInit, OnDestroy {
  @Input() id = 'THInputSearch';
  @Input() dialogTitle = 'Busca';
  @Input() group: FormGroup;

  @Input() label = 'Label';
  @Input() placeholder = '';

  @Input() endpoint = 'http://';
  @Input() filters: TheosSearchDialogSelectOption[] = [];
  @Input() extraFilters: any;
  @Input() columns: ColDef[];
  @Input() telaSistema: number;
  @Input() apiType: 'accounting' | 'core';
  @Input() autoSearch: boolean = false;

  @Input() extraProps: any;
  @Input() customDescriptionSearchDialogField: string;
  @Input() customDescriptionProperty: string;
  @Input() enableMultiFilterSearch = false;
  @ViewChild('thInputSearch', { static: true }) inputSearch: ElementRef;

  prefix = THEOS_COMPONENTS_PREFIXES.inputSearch;

  private _lastSearchValue: any;

  private _dialogIsOpen = false;

  private _inputChanged = false;

  private readonly _COMPONENT_DESTROY$ = new Subject<void>();

  private readonly _IS_MAC = window.navigator.platform === 'MacIntel';

  private readonly _ID = 'id';
  private readonly _CODE = 'codigo';
  private readonly _DESCRIPTION = 'descricao';

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

    this._lastSearchValue = this.C(
      this.customDescriptionProperty || this._DESCRIPTION
    ).value;
  }

  ngOnDestroy(): void {
    this._COMPONENT_DESTROY$.next();
    this._COMPONENT_DESTROY$.complete();
  }

  handleKeyup(e: KeyboardEvent) {
    if (e.key === 'F2' && !this._IS_MAC) return this.handleSearch();
    if (e.key === 'F3' && this._IS_MAC) return this.handleSearch();

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

    if (
      this.C(this.customDescriptionProperty || this._DESCRIPTION).value ===
      this._lastSearchValue
    )
      return;
    else {
      this.C(this._ID).setValue(null);
    }

    this._lastSearchValue = this.C(
      this.customDescriptionProperty || this._DESCRIPTION
    ).value;

    this._inputChanged = true;

    if (!this.C(this.customDescriptionProperty || this._DESCRIPTION).value)
      this._clearFG();
    this._cdr.markForCheck();
  }

  handleRemove() {
    this._clearFG();
  }

  handleSearch(autoSearch = false, isEmptyValue = false) {
    if (this._dialogIsOpen) return;

    this._createSearchDialog(this.autoSearch || autoSearch, isEmptyValue);
  }

  handleFocus() {
    this.inputSearch.nativeElement.placeholder = this.placeholder ?? '';
  }

  isSearching = false;

  handleFocusOut() {
    if (this.isSearching) return;

    this.inputSearch.nativeElement.placeholder = '';

    if (this._dialogIsOpen) return;

    if (this._isEmptyFG()) return;

    if (this.group?.value?.id || !this._inputChanged) return;

    this._http.injectEndpoint(`${this.endpoint}/getByDescricao`);

    const BODY = this._createRequestBody(this.group.value);

    this._loader.open();
    this.isSearching = true;
    this._http.post(BODY).subscribe(
      (response) => {
        this.isSearching = false;
        const DATA =
          this.apiType === 'accounting'
            ? response ?? []
            : response?.result?.data ?? [];
        this._resolveResponse(DATA);
      },
      () => {
        this.isSearching = false;
        this._clearFG();
        this.inputSearch.nativeElement.focus();
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
          COL_DEF.width = 160;
          COL_DEF.maxWidth = 480;
          COL_DEF.minWidth = 80;
          break;
        case Condition.numeric:
          COL_DEF.width = 120;
          COL_DEF.maxWidth = 360;
          COL_DEF.minWidth = 60;
          break;
        case Condition.money:
          COL_DEF.width = 80;
          COL_DEF.maxWidth = 160;
          COL_DEF.minWidth = 60;
          COL_DEF.valueFormatter = this._CURRENCY_VALUE_FORMATTER;
          break;
        case Condition.date:
          COL_DEF.width = 80;
          COL_DEF.maxWidth = 160;
          COL_DEF.minWidth = 60;
          COL_DEF.valueFormatter = this._DATE_VALUE_FORMATTER;
          break;
        case Condition.bool:
          COL_DEF.width = 60;
          COL_DEF.maxWidth = 240;
          COL_DEF.minWidth = 60;
          COL_DEF.valueFormatter = this._BOOL_VALUE_FORMATTER;
          break;
        case Condition.situation:
          COL_DEF.width = 160;
          COL_DEF.maxWidth = 480;
          COL_DEF.minWidth = 80;
          COL_DEF.valueFormatter = this._SITUATION_VALUE_FORMATTER;
          break;
        default:
          COL_DEF.width = 160;
          COL_DEF.maxWidth = 480;
          COL_DEF.minWidth = 80;
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
            this.group.setValue({ id: null, descricao: null });
          }

          this._cdr.detectChanges();
        });
      return;
    }

    this.group = new FormGroup({});
    [
      this._ID,
      this.customDescriptionProperty || this._DESCRIPTION,
    ].forEach((key) => this.group.addControl(key, new FormControl('')));
  }

  private _createSearchDialog(autoSearch: boolean, isEmptyValue) {
    // this.filters.forEach((filter) => {
    //   filter.default = false;
    // });

    const DEFAULT_FILTER = this.filters.find(
      (filter) =>
        filter.field ===
        (this.customDescriptionSearchDialogField || this._DESCRIPTION)
    );

    if (!DEFAULT_FILTER) {
      throw new Error(`Não foi possível encontrar um filtro padrão, 
		verifique se no parâmetro FILTERS existe o field DESCRIÇÃO, caso seja diferente deste, 
		usar o parâmetro CUSTOMDESCRIPTIONSEARCHDIALOGFIELD`);
    }

    // DEFAULT_FILTER.default = true;

    const SEARCH_CONFIG: SearchConfig = {
      autoSearch: autoSearch,
      id: this.id,
      title: this.dialogTitle,
      endpoint: this.endpoint,
      filters: {
        fields: this.filters,
        searchValue: autoSearch
          ? this.C(this.customDescriptionProperty || this._DESCRIPTION)
              ?.value ?? ''
          : '',
      },
      extraFilters: { ...this.extraFilters },
      columns: this.columns,
      telaSistema: this.telaSistema,
      apiType: this.apiType ? this.apiType : 'accounting',
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
    this._createDialogListeners(DIALOG_REF);
  }

  private _createDialogListeners(
    dialogRef: MatDialogRef<TheosSearchDialogComponent>
  ) {
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this._COMPONENT_DESTROY$))
      .subscribe(($event: any) => {
        this._dialogIsOpen = false;

        if (!$event || !$event.selected) {
          !this.C(this._ID).value ? this._clearFG() : noop();
          this.inputSearch.nativeElement
            ? this.inputSearch.nativeElement.focus()
            : noop();
          this._cdr.detectChanges();
          return;
        }

        if (Array.isArray($event.selected)) return;

        const { selected: SELECTED } = $event;

        if (this.customDescriptionSearchDialogField) {
          SELECTED[this._DESCRIPTION] =
            SELECTED[this.customDescriptionSearchDialogField];
        }
        this.group.patchValue(SELECTED);
        this.inputSearch ? this.inputSearch.nativeElement.focus() : noop();
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
      value:
        this.apiType === 'accounting'
          ? undefined
          : this.C(this.customDescriptionProperty || this._DESCRIPTION)?.value,
    };
  }

  private _resolveResponse(response: any) {
    if (this._arrayIsEmpty(response)) {
      this.handleSearch(true, true);
      return;
    }

    if (this._arrayIsSingle(response)) {
      const [RESULT] = response;
      this.group.patchValue(RESULT);
      this._cdr.detectChanges();
      this.inputSearch.nativeElement
        ? this.inputSearch.nativeElement.focus()
        : noop();
      return;
    }

    this.handleSearch(true);
  }

  private _arrayIsEmpty(array: any[]) {
    return Array.isArray(array) && array.length === 0;
  }

  private _arrayIsSingle(array: any[]) {
    return Array.isArray(array) && array.length === 1;
  }

  get hasValue() {
    return this.C(this.customDescriptionProperty || this._DESCRIPTION).value
      ? true
      : null;
  }

  get invalid() {
    return this.C(this._ID)?.invalid && this.group?.dirty;
  }

  get valid() {
    return this.C(this._ID)?.valid && this.group?.dirty;
  }

  get hasValidator() {
    return this.C(this._ID)?.validator?.length > 0;
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
