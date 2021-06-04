import { HttpClient } from '@angular/common/http';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostListener,
	Input,
	OnDestroy,
	OnInit,
	ViewChild
} from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ColDef, GridOptions, RowNode } from 'ag-grid-community';
import { Subject, throwError } from 'rxjs';
import { catchError, finalize, take, takeUntil } from 'rxjs/operators';
import { TheosAgButtonsComponent } from 'src/features/ag-grid-components/theos-ag-buttons/theos-ag-buttons.component';
import { TheosAgButtons } from 'src/features/ag-grid-components/theos-ag-buttons/theos-ag-buttons.interface';
import { AG_GRID_LOCALE } from 'src/features/ag-grid-components/theos-ag-resources/theos-ag-locale.res';
import { EclesialNotificationService } from 'src/services/eclesial-notification.service';
import { TheosLoaderService } from '../theos-loader/theos-loader.service';
import { WindowStatus } from '../theos-window/theos-window.component';
import {
	ECLESIAL_DEFAULT_MESSAGES,
	ECLESIAL_VALIDATORS_MESSAGES,
	THEOS_COMPONENTS_PREFIXES
} from '../_resources/theos-strings.res';
import { THRequired } from '../_validators/theos-required.validator';
import { TIPO_ENDERECO } from './theos-address.constants';
import { TheosAddress } from './theos-address.interface';


@Component({
  selector: 'theos-address',
  templateUrl: './theos-address.component.html',
  styleUrls: ['./theos-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheosAddressComponent implements OnInit, OnDestroy {
  @Input() id = 'THAddress';
  @Input() control: FormControl;
  @Input() label = `Label`;
  @Input() placeholder = '';
  @Input() style = {};
  @Input() config: TheosAddress = {
    bypassConfirmValidation: false,
  };

  @ViewChild('dialogAddress') dialogAddress;
  @ViewChild('confirmDelete') confirmDelete;
  confirmDeleteInstance: MatDialogRef<any>;
  @ViewChild('confirmHasDefault') confirmHasDefault;
  confirmHasDefaultInstance: MatDialogRef<any>;
  @ViewChild('confirmDeleteHasDefault') confirmDeleteHasDefault;
  confirmDeleteHasDefaultInstance: MatDialogRef<any>;

  @ViewChild('thInputFake') thInputFake: ElementRef;

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.handleButtonClick('_open');
    }
  }

  private readonly _HOUSE_ID = 2;
  defaultLabelValueIds = [this._HOUSE_ID];

  windowStatus = WindowStatus;
  windowStatusCurrent: WindowStatus = WindowStatus.create;

  tipoEndereco = TIPO_ENDERECO;

  private _fg: FormGroup;
  get fg() {
    return this._fg;
  }
  private _fgEmpty = {};
  private _fgFirstValueState;

  gridOptions: GridOptions;
  private readonly _FRAMEWORK_COMPONENTS = {
    ThAgButtons: TheosAgButtonsComponent,
  };
  selectedIndex = -1;

  readonly PREFIX = THEOS_COMPONENTS_PREFIXES.address;

  private readonly _COMPONENT_DESTROY$ = new Subject<void>();
  private readonly _BOOL_VALUE_FORMATTER = (node) => {
    return node.data.ehPrincipal === true ? 'Sim' : 'Não';
  };
  private readonly _TIPO_ENDERECO_VALUE_FORMATTER = (node) => {
    return this.tipoEndereco.find(
      (tipo) => tipo.value === node.data.enderecoTipoId
    )?.label;
  };

  private readonly _NO_ADDRESS_TEXT = 'Nenhum endereço selecionado';
  public get NO_ADDRESS_TEXT() {
    return this._NO_ADDRESS_TEXT;
  }

  inputValue: string = this._NO_ADDRESS_TEXT;
  tooltipInputValue: string = this._NO_ADDRESS_TEXT;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _notification: EclesialNotificationService,
    private _http: HttpClient,
    private _loader: TheosLoaderService
  ) {
    this._createGridOptions();
    this._createForm();
  }

  ngOnInit() {
    this._updateText();

    if (this.control) {
      this.control.statusChanges
        .pipe(takeUntil(this._COMPONENT_DESTROY$))
        .subscribe(() => {
          this._updateText();
          this._cdr.markForCheck();
        });
      return;
    }
    this.control = new FormControl('');
  }

  ngOnDestroy(): void {
    this._COMPONENT_DESTROY$.next();
    this._COMPONENT_DESTROY$.complete();
  }

  private _createForm() {
    this._fg = this._formBuilder.group({
      ehPrincipal: false,
      enderecoTipoId: [
        null,
        THRequired(ECLESIAL_VALIDATORS_MESSAGES.required('Tipo de endereço')),
      ],
      temporaryId: null,
      endereco: this._formBuilder.group({
        id: null,
        cep: null,
        logradouro: [
          null,
          THRequired(ECLESIAL_VALIDATORS_MESSAGES.required('Logradouro')),
        ],
        complemento: null,
        bairro: null,
        cidade: null,
        caixaPostal: null,
        numero: null,
        estado: null,
      }),
    });
    this._fgEmpty = this._fg.value;
    this._fgFirstValueState = this._fg.value;
  }

  readonly c = (...name: Array<string>) => this._fg.get(name) as FormControl;

  readonly cAddress = (...name: Array<string>) =>
    this._fg.get(`endereco.${name}`) as FormControl;

  private _createGridOptions() {
    this.gridOptions = {
      defaultColDef: { resizable: true, sortable: true, suppressMovable: true },
      columnDefs: [
        {
          headerName: '',
          width: 80,
          suppressSizeToFit: true,
          cellRendererFramework: this._FRAMEWORK_COMPONENTS.ThAgButtons,
          cellRendererParams: {
            buttons: [
              {
                id: `${this.PREFIX}__${this.id}__grid__editar`,
                icon: 'edit',
                methodName: 'handleEdit',
                style: { color: '#4299E1' },
                disabled: false,
              },
              {
                id: `${this.PREFIX}__${this.id}__grid__deletar`,
                icon: 'trash-2',
                methodName: 'handleDelete',
                style: { color: '#E53E3E' },
                disabled: false,
              },
            ] as TheosAgButtons[],
          },
        },
        {
          headerName: 'Principal',
          headerTooltip: 'Principal',
          field: 'ehPrincipal',
          minWidth: 120,
          valueFormatter: this._BOOL_VALUE_FORMATTER,
        },
        {
          headerName: 'Tipo de endereço',
          headerTooltip: 'Tipo de endereço',
          field: 'enderecoTipoId',
          minWidth: 200,
          valueFormatter: this._TIPO_ENDERECO_VALUE_FORMATTER,
        },
        {
          field: 'endereco.id',
          hide: true,
        },
        {
          field: 'temporaryId',
          hide: true,
        },
        {
          headerName: 'CEP',
          headerTooltip: 'CEP',
          field: 'endereco.cep',
          minWidth: 120,
        },
        {
          headerName: 'Logradouro',
          headerTooltip: 'Logradouro',
          field: 'endereco.logradouro',
          minWidth: 120,
        },
        {
          headerName: 'Complemento',
          headerTooltip: 'Complemento',
          field: 'endereco.complemento',
          minWidth: 120,
        },
        {
          headerName: 'Caixa postal',
          headerTooltip: 'Caixa postal',
          field: 'endereco.caixaPostal',
          minWidth: 120,
        },
        {
          headerName: 'Bairro',
          headerTooltip: 'Bairro',
          field: 'endereco.bairro',
          minWidth: 120,
        },
        {
          headerName: 'Cidade',
          headerTooltip: 'Cidade',
          field: 'endereco.cidade',
          minWidth: 120,
        },
        {
          headerName: 'Estado',
          headerTooltip: 'Estado',
          field: 'endereco.estado',
          minWidth: 120,
        },
      ] as ColDef[],
      frameworkComponents: this._FRAMEWORK_COMPONENTS,
      context: { componentParent: this },
      localeText: AG_GRID_LOCALE.localeText,
      rowSelection: 'single',
      suppressCellSelection: true,
      rowMultiSelectWithClick: false,
      rowData: [],
      onGridReady: () => {
        const ENDERECOS = this.control.value || [];
        this.gridOptions?.api?.applyTransaction({ add: [...ENDERECOS] });
        this.gridOptions?.api?.sizeColumnsToFit();
        this._cdr.markForCheck();
      },
    } as GridOptions;
  }

  handleEdit(index: number) {
    this.selectedIndex = index;
    this.gridOptions.api?.selectIndex(this.selectedIndex, false, false);
    const [SELECTED_ROW] = this.gridOptions.api?.getSelectedRows();
    this._fg.patchValue(SELECTED_ROW);
    this._fgFirstValueState = this._fg.value;
    this.windowStatusCurrent = WindowStatus.update;
  }

  handleDelete(index: number) {
    const DATA = this._getRowData();
    const TYPE = DATA[index].enderecoTipoId;
    const DATA_TYPE = DATA.filter((data) => data.enderecoTipoId === TYPE);
    if (DATA_TYPE.length > 1 && DATA[index].ehPrincipal) {
      this.confirmDeleteHasDefaultInstance = this._dialog.open(
        this.confirmDeleteHasDefault,
        this.alertConfig()
      );
      return;
    }
    this.selectedIndex = index;
    this.confirmDeleteInstance = this._dialog.open(
      this.confirmDelete,
      this.alertConfig()
    );
  }

  private _confirmDelete() {
    this.gridOptions.api?.selectIndex(this.selectedIndex, false, false);
    const SELECTED_ROW = this.gridOptions.api?.getSelectedRows();
    this.gridOptions.api?.applyTransaction({ remove: SELECTED_ROW });
    this.handleClose(this.confirmDeleteInstance);
    this._clear();
  }

  handleClick(action) {
    this.handleButtonClick(action);
  }

  handleButtonClick(action, params?) {
    this[action].call(this, params);
  }

  private _open() {
    const DIALOG_REF = this._dialog.open(this.dialogAddress, {
      maxWidth: '1180px',
      backdropClass: 'th-mat-dialog__darker',
      panelClass: ['th-mat-dialog__no-padding'],
    });
  }

  private _confirmHasDefault() {
    const DATA = this._getRowData();
    const VALUE = this._fg.value;
    const DEFAULT_INDEX = DATA.findIndex(
      (data) => data.ehPrincipal && data.enderecoTipoId === VALUE.enderecoTipoId
    );
    const DEFAULT_VALUE = DATA[DEFAULT_INDEX];
    this._updateRow(DEFAULT_INDEX, { ...DEFAULT_VALUE, ehPrincipal: false });
    this._save(false);
    this.handleClose(this.confirmHasDefaultInstance);
  }

  private _save(forceValidation: boolean = true) {
    this._markAllAsDirty(this._fg);
    if (this._fg.invalid) {
      this._notification.notifyWarning(
        ECLESIAL_DEFAULT_MESSAGES.requiredFieldsNotFilled
      );
      return;
    }
    if (!this.c('temporaryId').value)
      this.c('temporaryId').setValue(this.generateTemporaryId());
    const VALUE = this._fg.value;
    if (forceValidation) {
      const DATA =
        this._getRowData().filter((data) => {
          return data.enderecoTipoId === VALUE.enderecoTipoId;
        }) || [];
      if (DATA.length === 0) {
        VALUE.ehPrincipal = true;
      } else {
        const DATA_TYPE =
          DATA.filter((data) => {
            return (
              data.ehPrincipal &&
              (data.endereco.id !== VALUE.endereco.id ||
                data.temporaryId !== VALUE.temporaryId)
            );
          }) || [];
        if (DATA_TYPE.length > 0 && VALUE.ehPrincipal) {
          this.confirmHasDefaultInstance = this._dialog.open(
            this.confirmHasDefault,
            this.alertConfig()
          );
          return;
        } else if (DATA_TYPE.length === 0) VALUE.ehPrincipal = true;
      }
    }
    if (this.windowStatusCurrent === WindowStatus.create)
      this.gridOptions?.api?.applyTransaction({
        add: [VALUE],
      });
    else {
      this._updateRow(this.selectedIndex, VALUE);
    }
    this._clear();
  }

  private _updateRow(index, data) {
    var node: RowNode;
    this.gridOptions.api.forEachNode((rowNode) => {
      if (rowNode.rowIndex === index) {
        node = rowNode;
        return;
      }
    });
    node.updateData(data);
    this.gridOptions.api.refreshCells({ force: true });
  }

  private _cancel() {
    this._clear();
  }

  private _confirm() {
    const DATA = this._getRowData();
    if (!this.config.bypassConfirmValidation) {
      if (!DATA.some((d) => d.ehPrincipal)) {
        this._notification.notifyWarning(
          'Para confirmar, você precisa informar ao menos um endereço principal.'
        );
        return;
      }
    }
    this.control.setValue(DATA);
    this._updateText();
    this.handleClose();
  }

  handleClose(dialog?: MatDialogRef<any>) {
    if (dialog) {
      dialog.close();
      return;
    }
    this._dialog.closeAll();
  }

  private _searchCEP() {
    const CEP = this._fg.get('endereco.cep').value.replace('-', '');
    const EXP_CEP = /^[0-9]{8}$/;
    if (!EXP_CEP.test(CEP)) {
      this._notification.notifyWarning(
        'Digite um CEP válido para realizar a busca.'
      );
      return;
    }

    const URL_CEP = `//viacep.com.br/ws/${CEP}/json`;

    this._loader.open();
    this._http
      .get(URL_CEP)
      .pipe(
        takeUntil(this._COMPONENT_DESTROY$),
        take(1),
        catchError((error) => {
          return throwError(error);
        }),
        finalize(() => {
          this._loader.close();
        })
      )
      .subscribe((response: any) => {
        if (response.erro) {
          this._notification.notifyWarning('CEP não encontrado.');
          return;
        }
        this._fg.patchValue({
          endereco: {
            ...response,
            cidade: response.localidade,
            estado: response.uf,
          },
        });
      });
  }

  get hasValue() {
    return this.control?.value || this.control?.value === 0 ? true : null;
  }

  get invalid() {
    return this.control?.invalid && this.control?.dirty;
  }

  get valid() {
    return this.control?.valid && this.control?.dirty;
  }

  get isRequired() {
    if (this.control.validator) {
      const VALIDATOR = this.control.validator({} as AbstractControl);
      if (VALIDATOR && (VALIDATOR.ThRequired || VALIDATOR.required))
        return true;
    }

    return false;
  }

  private _markAllAsDirty = (g: FormGroup) => {
    Object.keys(g.controls).forEach((key) => {
      const CONTROL = g.controls[key];
      if (CONTROL instanceof FormGroup) {
        this._markAllAsDirty(CONTROL as FormGroup);
        return;
      }

      CONTROL.markAsDirty();
      CONTROL.updateValueAndValidity();
      return;
    });
  };

  private _getRowData() {
    var rowData = [];
    this.gridOptions.api.forEachNode((node) => {
      rowData.push(node.data);
    });
    return rowData;
  }

  private _clear() {
    this.gridOptions.api.redrawRows();
    this.windowStatusCurrent = WindowStatus.create;
    this._fg.reset(this._fgEmpty);
    this._fgFirstValueState = this._fg.value;
    this.gridOptions.api?.deselectAll();
    this.selectedIndex = -1;
    this._cdr.markForCheck();
  }

  private _updateText() {
    const { value: VALUE } = this.control;
    if (VALUE) {
      const PRINCIPAL_SELECIONADO = VALUE.find(
        (data) =>
          this.defaultLabelValueIds.includes(data.enderecoTipoId) &&
          data.ehPrincipal
      );
      const PRINCIPAL_NAO_SELECIONADO = VALUE.find((data) => data.ehPrincipal);
      const PRINCIPAL = PRINCIPAL_SELECIONADO ?? PRINCIPAL_NAO_SELECIONADO;
      if (PRINCIPAL) {
        const {
          endereco: {
            logradouro: LOGRADOURO,
            bairro: BAIRRO,
            cidade: CIDADE,
            estado: ESTADO,
          },
          enderecoTipoId: TIPO_ENDERECO,
        } = PRINCIPAL;
        const STRING = [
          LOGRADOURO,
          BAIRRO,
          [CIDADE, ESTADO].filter((a) => a).join(' - '),
        ]
          .filter((a) => a)
          .join(', ');
        this.inputValue =
          STRING ||
          this._TIPO_ENDERECO_VALUE_FORMATTER({
            data: { enderecoTipoId: TIPO_ENDERECO },
          });
        this.tooltipInputValue = STRING;
        return;
      }
    }
    this.inputValue = this._NO_ADDRESS_TEXT;
    this.tooltipInputValue = this._NO_ADDRESS_TEXT;
  }

  alertConfig = () => ({
    width: '360px',
    backdropClass: 'th-mat-dialog__darker',
    panelClass: ['th-mat-dialog__no-padding'],
  });

  generateTemporaryId = () => Math.floor(Math.random() * 10000000);
}
