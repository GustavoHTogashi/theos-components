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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TheosAgButtonsComponent } from 'src/features/ag-grid-components/theos-ag-buttons/theos-ag-buttons.component';
import { TheosAgButtons } from 'src/features/ag-grid-components/theos-ag-buttons/theos-ag-buttons.interface';
import { AG_GRID_LOCALE } from 'src/features/ag-grid-components/theos-ag-resources/theos-ag-locale.res';
import { EclesialNotificationService } from 'src/services/eclesial-notification.service';
import { WindowStatus } from '../theos-window/theos-window.component';
import {
	ECLESIAL_DEFAULT_MESSAGES,
	ECLESIAL_VALIDATORS_MESSAGES,
	THEOS_COMPONENTS_PREFIXES
} from '../_resources/theos-strings.res';
import { THRequired } from '../_validators/theos-required.validator';
import { TIPO_CONTATO } from './theos-contact.constants';
import { TheosContact } from './theos-contact.interface';
import { TheosContactService } from './theos-contact.service';

@Component({
  selector: 'theos-contact',
  templateUrl: './theos-contact.component.html',
  styleUrls: ['./theos-contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheosContactComponent implements OnInit, OnDestroy {
  @Input() id = 'THContact';
  @Input() control: FormControl;
  @Input() label = `Label`;
  @Input() placeholder = '';
  @Input() style = {};
  @Input() config: TheosContact = {
    bypassConfirmValidation: false,
  };

  @ViewChild('dialogContact') dialogContact;
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

  windowStatus = WindowStatus;
  windowStatusCurrent: WindowStatus = WindowStatus.create;

  tipoContato = TIPO_CONTATO;

  private _fg: FormGroup;
  get formGroup() {
    return this._fg;
  }
  private _fgEmpty = {};
  private _fgFirstValueState;

  gridOptions: GridOptions;
  private readonly _FRAMEWORK_COMPONENTS = {
    ThAgButtons: TheosAgButtonsComponent,
  };
  selectedIndex = -1;

  readonly PREFIX = THEOS_COMPONENTS_PREFIXES.contact;

  private readonly _COMPONENT_DESTROY$ = new Subject<void>();
  private readonly _BOOL_VALUE_FORMATTER = (node) => {
    return node.data.ehPrincipal === true ? 'Sim' : 'Não';
  };
  private readonly _TIPO_CONTATO_VALUE_FORMATTER = (node) => {
    return this.tipoContato.find(
      (tipo) => tipo.value === node.data.contatoTipoId
    )?.label;
  };

  _MASK_VALUE_FORMATTER = (node) => {
    const { mask: MASK } = this.tipoContato.find(
      (tipo) => tipo.value === node.data.contatoTipoId
    );
    if (MASK !== '') return this._contact.mask(node.data.contato.descricao);
    return node.data.contato.descricao;
  };

  public get NO_CONTACT_TEXT() {
    return this._contact?.NO_CONTACT_TEXT || '';
  }

  inputValue: string = this.NO_CONTACT_TEXT;
  tooltipInputValue: string = this.NO_CONTACT_TEXT;
  mask: string = '';

  constructor(
    private _cdr: ChangeDetectorRef,
    private _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _notification: EclesialNotificationService,
    private _contact: TheosContactService
  ) {
    this._createGridOptions();
    this._createForm();
  }

  ngOnInit() {
    this._createFormRules();
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
      contatoTipoId: [
        null,
        THRequired(ECLESIAL_VALIDATORS_MESSAGES.required('Tipo de contato')),
      ],
      temporaryId: null,
      contato: this._formBuilder.group({
        id: null,
        descricao: [
          null,
          THRequired(ECLESIAL_VALIDATORS_MESSAGES.required('Contato')),
        ],
      }),
    });
    this._fgEmpty = this._fg.value;
    this._fgFirstValueState = this._fg.value;
  }

  private _createFormRules() {
    this.c('contatoTipoId')
      .valueChanges.pipe(takeUntil(this._COMPONENT_DESTROY$))
      .subscribe((changedValue) => {
        this.cContact('descricao').setValue('');
        const MASK =
          this.tipoContato.find((tipo) => tipo.value === changedValue)?.mask ||
          '';
        this.mask = MASK;
        this._cdr.markForCheck();
      });
  }

  readonly c = (...name: Array<string>) => this._fg.get(name) as FormControl;

  readonly cContact = (...name: Array<string>) =>
    this._fg.get(`contato.${name}`) as FormControl;

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
          field: 'principal',
          minWidth: 120,
          valueFormatter: this._BOOL_VALUE_FORMATTER,
        },
        {
          headerName: 'Tipo de contato',
          headerTooltip: 'Tipo de contato',
          field: 'contatoTipoId',
          minWidth: 200,
          valueFormatter: this._TIPO_CONTATO_VALUE_FORMATTER,
        },
        {
          field: 'contato.id',
          hide: true,
        },
        {
          field: 'temporaryId',
          hide: true,
        },
        {
          headerName: 'Contato',
          headerTooltip: 'Contato',
          field: 'contato.descricao',
          minWidth: 120,
          valueFormatter: this._MASK_VALUE_FORMATTER,
        },
      ] as ColDef[],
      frameworkComponents: this._FRAMEWORK_COMPONENTS,
      context: { componentParent: this },
      localeText: AG_GRID_LOCALE.localeText,
      rowSelection: 'single',
      suppressCellSelection: true,
      rowData: [],
      onGridReady: () => {
        const CONTATOS = this.control.value || [];
        this.gridOptions?.api?.applyTransaction({ add: [...CONTATOS] });
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
    const TYPE = DATA[index].contatoTipoId;
    const DATA_TYPE = DATA.filter((data) => data.contatoTipoId === TYPE);
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
    const DIALOG_REF = this._dialog.open(this.dialogContact, {
      maxWidth: '1180px',
      backdropClass: 'th-mat-dialog__darker',
      panelClass: ['th-mat-dialog__no-padding', 'container'],
    });
  }

  private _confirmHasDefault() {
    const DATA = this._getRowData();
    const VALUE = this._fg.value;
    const DEFAULT_INDEX = DATA.findIndex(
      (data) => data.ehPrincipal && data.contatoTipoId === VALUE.contatoTipoId
    );
    const DEFAULT_VALUE = DATA[DEFAULT_INDEX];
    this._updateRow(DEFAULT_INDEX, { ...DEFAULT_VALUE, ehPrincipal: false });
    this._save(false);
    this.handleClose(this.confirmHasDefaultInstance);
  }

  private _save(forceValidation: boolean = true) {
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
          return data.contatoTipoId === VALUE.contatoTipoId;
        }) || [];
      if (DATA.length === 0) {
        VALUE.ehPrincipal = true;
      } else {
        const DATA_TYPE =
          DATA.filter((data) => {
            return (
              data.ehPrincipal &&
              (data.contato.id !== VALUE.contato.id ||
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
          'Para confirmar, você precisa informar ao menos um contato principal.'
        );
        return;
      }
      if (
        !DATA.some((d) =>
          this._contact.defaultLabelValueIds.includes(d.contatoTipoId)
        )
      ) {
        this._notification.notifyWarning(
          'Para confirmar, é preciso informar ao menos um contato do tipo email, telefone ou celular.'
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
    this.mask = '';
    this._cdr.markForCheck();
  }

  private _updateText() {
    const { label: CONTACT_STRING } = this._contact.contactLabel(
      this.control.value
    );
    this.inputValue = CONTACT_STRING;
    this.tooltipInputValue = CONTACT_STRING;
  }

  alertConfig = () => ({
    width: '360px',
    backdropClass: 'th-mat-dialog__darker',
    panelClass: ['th-mat-dialog__no-padding'],
  });

  generateTemporaryId = () => Math.floor(Math.random() * 10000000);
}
