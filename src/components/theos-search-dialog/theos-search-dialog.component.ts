import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	OnDestroy,
	OnInit,
	TemplateRef,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	MatDialog,
	MatDialogRef,
	MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { ColDef, GridOptions } from 'ag-grid-community';
import * as moment from 'moment';
import { noop, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AG_GRID_LOCALE } from 'src/features/ag-grid-components/theos-ag-resources/theos-ag-locale.res';
import { DATE_VALUE_FORMATTER } from 'src/features/ag-grid-components/theos-ag-value-formatters/theos-ag-date.formatter';
import { EclesialNotificationService } from 'src/services/eclesial-notification.service';
import { ErrorHandlerService } from 'src/services/error-handler.service';
import { HttpRequestService } from 'src/services/http-request/http-request.service';
import { TheosDateComponent } from '../theos-date/theos-date.component';
import { TheosInputComponent } from '../theos-input/theos-input.component';
import { TheosLoaderService } from '../theos-loader/theos-loader.service';
import { TheosNumberComponent } from '../theos-number/theos-number.component';
import { TheosSelectOption } from '../theos-select/theos-select.interface';
import { Condition, ConditionItem, ConditionSearchList } from '../_models/search-dialog-field-options.model';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';


@Component({
  selector: 'theos-search-dialog',
  templateUrl: './theos-search-dialog.component.html',
  styleUrls: ['./theos-search-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheosSearchDialogComponent
  implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SearchConfig,
    private _dialogRef: MatDialogRef<TheosSearchDialogComponent>,
    private _fb: FormBuilder,
    private _http: HttpRequestService,
    private _loader: TheosLoaderService,
    private _viewContainerRef: ViewContainerRef,
    private _cdr: ChangeDetectorRef,
    private _dialog: MatDialog,
    private _errorHandler: ErrorHandlerService,
    private _notification: EclesialNotificationService
  ) {}
  fg: FormGroup;
  gridOptions: GridOptions;
  fieldOptions: TheosSearchDialogSelectOption[] = [];
  newResponse$ = new Subject<any>();
  totalSearchData = 0;

  disableSelected = true;

  selectedRows = null;

  prefix = THEOS_COMPONENTS_PREFIXES.searchDialog;
  private _searchEndpoint = '';

  private readonly _COMPONENT_DESTROY$ = new Subject<void>();
  private readonly _CONDITION_LIST = new ConditionSearchList();

  @ViewChild('searchValue') searchValue: TheosInputComponent;
  @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet: CdkPortalOutlet;

  @ViewChild('textInterval', { static: true })
  textIntervalTemplate: TemplateRef<any>;
  @ViewChild('text', { static: true }) textTemplate: TemplateRef<
    TheosInputComponent
  >;
  @ViewChild('numeric', { static: true }) numericTemplate: TemplateRef<
    TheosNumberComponent
  >;
  @ViewChild('numericInterval', { static: true })
  numericIntervalTemplate: TemplateRef<any>;
  @ViewChild('money', { static: true }) moneyTemplate: TemplateRef<
    TheosInputComponent
  >;
  @ViewChild('moneyInterval', { static: true })
  moneyIntervalTemplate: TemplateRef<any>;
  @ViewChild('date', { static: true }) dateTemplate: TemplateRef<
    TheosDateComponent
  >;
  @ViewChild('dateInterval', { static: true })
  dateIntervalTemplate: TemplateRef<any>;
  @ViewChild('textDate', { static: true }) textDateTemplate: TemplateRef<
    TheosInputComponent
  >;

  @ViewChild('hidden', { static: true }) hiddenTemplate: TemplateRef<any>;

  private _currentField: TheosSearchDialogSelectOption = null;
  currentFilters: Array<IFilterParametersCore>;

  private _getFilterParams = {
    ['accounting']: (
      field: string,
      isSearchValueHidden: boolean,
      formValue: any
    ) =>
      ({
        propriedade: field,
        tipo: isSearchValueHidden ? 0 : formValue.fieldOption,
        termo: isSearchValueHidden
          ? formValue.fieldOption
          : formValue.searchValue,
        termoFinal: formValue.searchValueEnd,
      } as IFilterParameters),
    ['core']: (field: string, isSearchValueHidden: boolean, formValue: any) =>
	{
		const { condition: CONDITION } = this.data.filters.fields.find(
		(field) => field.value === formValue.field
	  );
		return [
			{
			  property: field,
			  condition: isSearchValueHidden ? 0 : formValue.fieldOption,
			  conditionStart: isSearchValueHidden
				? formValue.fieldOption
				: [null, ''].indexOf(formValue.searchValue) === -1 ? formValue.searchValue : CONDITION === Condition.numeric ? 0 : '',
			  conditionEnd: formValue.searchValueEnd,
			},
		  ] as Array<IFilterParametersCore>;
	}
  };

  private _getReq = {
    ['accounting']: (
      pageNumber: number,
      pageSize: number | string,
      filterParams: any
    ) =>
      ({
        pageNumber: pageNumber,
        pageSize: pageSize,
        telaSistema: this.data.telaSistema,
        filterParameters: [filterParams],
        ...this.data.extraFilters,
      } as ISearchDialogRequestBody),
    ['core']: (
      pageNumber: number,
      pageSize: number | string,
      FILTER_PARAMS: any
    ) =>
      ({
        page: pageNumber,
        pageSize: pageSize,
        filter: this.data.enableMultiFilterSearch
          ? this.currentFilters
          : FILTER_PARAMS,
        ...this.data.extraFilters,
        ...(this.data.enableMultiFilterSearch
          ? this.data['currentExtraFilters']
          : this._currentField?.extraFilters),
      } as ISearchDialogRequestBodyCore),
  };

  private _changeInput = {
    [Condition.text]: () => this._injectPortal(this.textTemplate),
    [Condition.numeric]: () => this._injectPortal(this.numericTemplate),
    [Condition.money]: () => this._injectPortal(this.moneyTemplate),
    [Condition.date]: () => this._injectPortal(this.dateTemplate),
    [Condition.bool]: () => this._injectPortal(this.hiddenTemplate),
    [Condition.textDate]: () => this._injectPortal(this.textDateTemplate),
  };

  private _changeInputInteval = {
    [Condition.textDate]: () => this._injectPortal(this.textIntervalTemplate),
    [Condition.numeric]: () => this._injectPortal(this.numericIntervalTemplate),
    [Condition.money]: () => this._injectPortal(this.moneyIntervalTemplate),
    [Condition.date]: () => this._injectPortal(this.dateIntervalTemplate),
  };

  // * IMPRESSÃO DE BUSCAS

  dialogComponent: any;
  limiteImpressao = 1;
//   dataPersonalizada: IObjetosFonteDeDadosProperties[] = [];
  configDialogRelatorioPersonalizado = {};
  configuracaoDaTela: Array<any> = [];
  C = (name: string) => this.fg.get(name) as FormControl;
  ngOnInit(): void {
    this._searchEndpoint = `${this.data.endpoint}/search`;
    this._http.injectEndpoint(this._searchEndpoint);
    this.data.id = this.data?.id ?? 'THSearchDialog';
    this.data.apiType = this.data?.apiType
      ? this.data?.apiType
      : 'accounting' ?? 'accounting';
    this._createFormgroup();
    this._createAdditionalConditions();
    this._gridInit();
    this._setDefaults();
    this._cdr.markForCheck();
  }
  ngAfterViewInit(): void {
    if (this.data.lastFilterState)
      this.fg.patchValue(this.data.lastFilterState);
    if (this.data.enableMultiFilterSearch)
      this.currentFilters = this.C('currentFilters').value || [];
    this.data.autoSearch
      ? this.handleSearch(1, this.currentFilters?.length > 0)
      : noop();
    this.focusSearchValue();
  }
  ngOnDestroy(): void {
    this._COMPONENT_DESTROY$.next();
    this._COMPONENT_DESTROY$.complete();
  }

  handleSearch(pageNumber = 1, skipMultiFilterSearch = false) {

    if (this.data.enableMultiFilterSearch && !skipMultiFilterSearch) {
      this.handleMultiFilterSearch(pageNumber);
      return;
    }

    const BODY = this._createRequestBody(pageNumber);
    this.data.lastFilterState = this.fg.getRawValue();

    if (this.validateBetween()) return;

    this._loader.open();
    this._http.injectEndpoint(this._searchEndpoint);
    this._http
      .post(BODY)
      .pipe(takeUntil(this._COMPONENT_DESTROY$))
      .subscribe(
        (response) => {
          const IS_API_ACCOUNTING = this.data.apiType === 'accounting';
          const DATA = IS_API_ACCOUNTING
            ? response?.data
            : response?.result?.data ?? [];
          this.gridOptions.api.setRowData(DATA);

          const TOTAL_DATA = IS_API_ACCOUNTING
            ? response?.totalRows
            : response?.result?.rowCount ?? 0;
          this.newResponse$.next({ totalData: TOTAL_DATA, page: pageNumber });
          this.totalSearchData = TOTAL_DATA;
          if (!this.data.codigoMenuWeb || this.pegarPreferenciaPadrao()) {
            this.gridOptions.columnApi.autoSizeAllColumns();
          } else this.gridOptions.columnApi.autoSizeAllColumns();
          !IS_API_ACCOUNTING ? this.focusSearchValue() : null;
        },
        (err) => {
          this._errorHandler.handle(err);
        }
      );
  }

  validateBetween() {
    const FIELD_ID = this.data.lastFilterState.field;
    const FIELD_OPTION = this.data.lastFilterState.fieldOption;
    const OPTION_BETWEEN = 7;

    if (FIELD_OPTION === OPTION_BETWEEN) {

      const FIELD_CONDITION = this.data.filters.fields.find(field => field.value === FIELD_ID).condition;

      if (FIELD_CONDITION === Condition.numeric) {
        if (this.data.lastFilterState.searchValue > this.data.lastFilterState.searchValueEnd) {
          
          const searchValueControl = this.fg.controls['searchValue'];
          const searchValueEndControl = this.fg.controls['searchValueEnd'];

          [searchValueControl, searchValueEndControl].forEach(control => {
            control.setErrors({ 'incorrect': true })
          })

          this._notification.notifyWarning('Termo inicial não pode ser maior que termo final')
          return true;
        }
      }

      if (FIELD_CONDITION === Condition.date) {
        const FORMAT = 'YYYY-MM-DD'

        if (moment(this.data.lastFilterState.searchValue, FORMAT).isAfter(moment(this.data.lastFilterState.searchValueEnd, FORMAT))) {

          const searchValueControl = this.fg.controls['searchValue'];
          const searchValueEndControl = this.fg.controls['searchValueEnd'];

          [searchValueControl, searchValueEndControl].forEach(control => {
            control.setErrors({ 'incorrect': true })
          })

          this._notification.notifyWarning('Data inicial não pode ser maior que data final')
          return true;
        }
      }

      if (FIELD_CONDITION === Condition.money) {
        if (this.data.lastFilterState.searchValue > this.data.lastFilterState.searchValueEnd) {
          
          const searchValueControl = this.fg.controls['searchValue'];
          const searchValueEndControl = this.fg.controls['searchValueEnd'];

          [searchValueControl, searchValueEndControl].forEach(control => {
            control.setErrors({ 'incorrect': true })
          })

          this._notification.notifyWarning('Valor inicial não pode ser maior que valor final')
          return true;
        }
      }
    }

    return false;
  }

  handleSelected() {
    const ROW_OR_ROWS =
      this.selectedRows?.length === 1
        ? this.selectedRows[0]
        : this.selectedRows ?? null;

    this._dialogRef.close({
      selected: ROW_OR_ROWS,
    });
  }
  handleClose() {
    this._dialogRef.close();
  }
  handlePrint() {
    this._imprimirPersonalizado();
  }
  focusSearchValue() {
    this.searchValue?.inputRef.nativeElement.focus();
  }
  private _createFormgroup() {
    this.fg = this._fb.group({
      field: null,
      fieldOption: null,
      searchValue: null,
      searchValueEnd: null,
      showOrganism: false,
      multiFilterSearch: false,
      currentFilters: [],
    });

    this._createFormgroupListeners();
  }

  private _createFormgroupListeners() {
    this.C('field')
      .valueChanges.pipe(takeUntil(this._COMPONENT_DESTROY$))
      .subscribe((change) => {
        const FIELD_OPTIONS = this._createFilterOptions(change);
        this.fieldOptions = FIELD_OPTIONS;
        this._currentField = this.data.filters.fields.find(
          (f) => f.value === change
        );
        // const FIELD_OPTIONS_VALUE = this.fieldOptions.find(
        //   (option) => option.default
        // ).value;
        // this.C('fieldOption').setValue(FIELD_OPTIONS_VALUE);
      });

    this.C('fieldOption')
      .valueChanges.pipe(takeUntil(this._COMPONENT_DESTROY$))
      .subscribe((change: number) => {
        const CONDITION = this.data.filters.fields.find(
          (option) => option.value === this.C('field').value
        ).condition;

        const FIELD = CONDITION > Condition.bool ? Condition.bool : CONDITION;
        if (change === 7) {
          this._changeInputInteval[FIELD as number]();
          this.C('searchValue').setValue(null);
          this.C('searchValueEnd').setValue(null);
          return;
        }

        this._changeInput[FIELD as number]();
        this.C('searchValue').setValue(null);
        this.C('searchValueEnd').setValue(null);
      });
    this.C('showOrganism')
      .valueChanges.pipe(takeUntil(this._COMPONENT_DESTROY$))
      .subscribe((change: boolean) => {
        if (this.data.showOrganismOption) {
          this.data.extraFilters = {
            ...this.data.extraFilters,
            exibeParoquias: change,
          };
          this.handleSearch(1);
        }
      });
    this.C('multiFilterSearch')
      .valueChanges.pipe(takeUntil(this._COMPONENT_DESTROY$))
      .subscribe((change: boolean) => {
        if (!change) this.clearFilters();
      });
  }

  private _setDefaults() {
    // const FIELD = this.data.filters.fields.find((field) => field.default) ?? {
    //   value: 0,
    // };
	const FIELD = {value: 0}
    const SEARCH_VALUE = this.data?.filters?.searchValue ?? null;

    this.C('field').setValue(FIELD.value);
    this.C('searchValue').setValue(SEARCH_VALUE);
  }

  private _createAdditionalConditions() {
    this.data.filters.fields.forEach((item) => {
      if (!item.newCondition) return;
      item.condition = this._CONDITION_LIST.add(item.newCondition);
    });
  }

  private _createFilterOptions(currentCondition: Condition) {
    const CURRENT_CONDITION = this.data.filters.fields.find(
      (field) => field.value === currentCondition
    ).condition;
    const FILTER_OPTIONS = this._CONDITION_LIST
      .get(CURRENT_CONDITION)
      .reduce((result, val) => {
        delete val['condition'];
        result.push(val);
        return result;
      }, []);
    return FILTER_OPTIONS;
  }

  private _createRequestBody(
    pageNumber: number,
    pageSize: number | string = 50
  ): ISearchDialogRequestBody | ISearchDialogRequestBodyCore {
    const FORM_VALUE = this.fg.getRawValue();
    const IS_SEARCH_VALUE_HIDDEN =
      this.data.filters.fields.find((field) => field.value === FORM_VALUE.field)
        .condition > Condition.textDate;
    const FIELD = this.data.filters.fields.find(
      (field) => field.value === FORM_VALUE.field
    ).field;
    const FILTER_PARAMS:
      | IFilterParameters
      | Array<IFilterParametersCore> = this._getFilterParams[this.data.apiType](
      FIELD,
      IS_SEARCH_VALUE_HIDDEN,
      FORM_VALUE
    );
    const REQ = this._getReq[this.data.apiType](
      pageNumber,
      pageSize,
      FILTER_PARAMS
    );

    return REQ;
  }

  private _gridInit() {
    this.gridOptions = {
      overlayLoadingTemplate: 'Digite algo para pesquisar',
      defaultColDef: {
        resizable: true,
        sortable: true,
        suppressMovable: true,
      },
      localeText: AG_GRID_LOCALE.localeText,
      suppressPropertyNamesCheck: true,
      rowSelection: 'single',
      suppressCellSelection: true,
      rowMultiSelectWithClick: false,
      autoSizePadding: 24,
      onRowDoubleClicked: () => this.handleSelected(),
      onRowClicked: () => this._setSelected(),
    } as GridOptions;

    if (this.data.codigoMenuWeb) {
      const DEFAULT = this.pegarPreferenciaPadrao();
      this.data?.columns.forEach((column: ColDef) => {
        const COL =
          DEFAULT?.dadosDaTela?.objetosFonteDeDadosProperties?.find(
            (col) => col?.name === column?.field
          ) || null;
        const SIZE = COL?.size || column?.width || 200;
        column.width = Number.parseInt(SIZE);
      });
    }

    this.gridOptions.columnDefs = this.data?.columns ?? [];
  }

  private _setSelected() {
    const SELECTED = this.gridOptions.api.getSelectedRows();

    this.selectedRows = SELECTED;
    this.disableSelected = SELECTED.length === 0;
    this._cdr.markForCheck();
  }

  private _injectPortal(template: TemplateRef<any>) {
    const PORTAL = new TemplatePortal(template, this._viewContainerRef);
    if (!PORTAL)
      return console.error(
        'Portal creation failed, check injected templateRef'
      );

    this.portalOutlet.detach();
    this.portalOutlet.attachTemplatePortal(PORTAL);
  }

  private _imprimirPersonalizado() {
    if (!this.totalSearchData) return;
    // this.dataPersonalizada = this.mesclarDados();
    this.configuracaoDaTela = this.pegarConfiguracoesDaTela();
    const VIEW_MODEL_PARAMS = {
      pageNumber: this.data.apiType === 'core' ? 1 : null,
      pageSize: this.data.apiType === 'core' ? this.totalSearchData : 'all',
    };
    this.configDialogRelatorioPersonalizado = {
      titleSearch: this.data.title,
      viewModel: this._createRequestBody(
        VIEW_MODEL_PARAMS.pageNumber,
        VIEW_MODEL_PARAMS.pageSize
      ),
      apiUrl: this._searchEndpoint,
      totalSearchData: this.totalSearchData,
    //   properties: this.pegarObjetosFonteDeDadosProperties(),
      limiteImpressao: this.limiteImpressao,
      configuracaoDaTela: this.configuracaoDaTela,
      codigoMenuWeb: this.data.codigoMenuWeb,
    };
    this.abrirModalPersonalizacao();
  }

//   mesclarDados() {
//     const FONTE_DE_DADOS = this.pegarObjetosFonteDeDadosProperties();
//     if (this.configuracaoDaTela?.length === 0) return FONTE_DE_DADOS;
//     const PADRAO = this.pegarPreferenciaPadrao();
//     const DADOS_MESCLADOS = FONTE_DE_DADOS.map((dados) => {
//       const VALOR_NA_CONFIG = PADRAO?.dadosDaTela?.objetosFonteDeDadosProperties?.find(
//         (config) => config.name == dados.name
//       );
//       if (VALOR_NA_CONFIG) {
//         dados = { ...dados, ...VALOR_NA_CONFIG };
//       }
//       return dados;
//     });
//     return DADOS_MESCLADOS;
//   }

//   pegarObjetosFonteDeDadosProperties(): IObjetosFonteDeDadosProperties[] {
//     const MONTAR_DADOS = (d) => ({
//       name: d.userProvidedColDef.field,
//       alias: d.userProvidedColDef.headerName,
//       size: d.actualWidth.toFixed(0),
//       agrupar: 0,
//       ordenacao: 0,
//       ...d.userProvidedColDef.extras,
//     });
//     const API = this.gridOptions.columnApi;
//     return API.getAllColumns().map(MONTAR_DADOS);
//   }

  pegarPreferenciaPadrao() {
    if (this.data.codigoMenuWeb) {
      this.configuracaoDaTela = this.pegarConfiguracoesDaTela();
      if (this.configuracaoDaTela?.length > 0) {
        var config = this.configuracaoDaTela.find(
          (config) => config?.dadosDaTela.padrao
        );
        if (config === undefined) [config] = this.configuracaoDaTela;
      }
      return config;
    }
    return undefined;
  }

  pegarConfiguracoesDaTela() {
    const PREFERENCIAS = JSON.parse(
      localStorage.getItem('preferenciasImpressao')
    );
    if (!PREFERENCIAS) return undefined;
    const CONFIGURACOES_DA_TELA =
      PREFERENCIAS.filter(
        (preferencia) => preferencia.codigoMenuWeb === this.data.codigoMenuWeb
      ) || [];
    CONFIGURACOES_DA_TELA.forEach((config) => {
      config.dadosDaTela = JSON.parse(config.dadosDaTela);
    });
    return CONFIGURACOES_DA_TELA;
  }

  abrirModalPersonalizacao() {
    // const DIALOG_REF = this._dialog.open(
    //   RelatorioPersonalizadoDialogComponent,
    //   {
    //     maxWidth: '1180px',
    //     backdropClass: 'th-mat-dialog__darker',
    //     panelClass: ['th-mat-dialog__no-padding', 'container'],
    //     data: {
    //       config: this.configDialogRelatorioPersonalizado,
    //       data: this.dataPersonalizada ?? [],
    //     },
    //   }
    // );
  }
  //* FIM IMPRESSÃO DE BUSCAS

  //* MULTIFILTROS (Filtrar no resultado)
  handleMultiFilterSearch(pageNumber = 1) {
    const FORM_VALUE = this.fg.getRawValue();
    const IS_SEARCH_VALUE_HIDDEN =
      this.data.filters.fields.find((field) => field.value === FORM_VALUE.field)
        .condition > Condition.textDate;
    const FIELD = this.data.filters.fields.find(
      (field) => field.value === FORM_VALUE.field
    ).field;
    const [FILTER_PARAMS] = this._getFilterParams['core'](
      FIELD,
      IS_SEARCH_VALUE_HIDDEN,
      FORM_VALUE
    );
    FILTER_PARAMS.textCondition = this.getFilterLabel(FILTER_PARAMS);
    if (this.addFilter(FILTER_PARAMS)) {
      this.handleSearch(pageNumber, true);
    }
  }
  clearFilters() {
    this.currentFilters = [];
    this.fg.get('multiFilterSearch').setValue(false, { emitEvent: false });
  }
  addFilter(filter: IFilterParametersCore) {
    if (!this.fg.get('multiFilterSearch').value) this.clearFilters();
    if (this.canAddFilter(filter)) {
      const EXTRA_FILTERS =
        this.data.filters.fields.find(
          (field) => field.value === this.fg.getRawValue().field
        ).extraFilters || {};
      this.data['currentExtraFilters'] = {
        ...this.data['currentExtraFilters'],
        ...EXTRA_FILTERS,
      };
      this.currentFilters.push(filter);
      this.C('currentFilters').setValue([...this.currentFilters] || []);
      return true;
    }
    return false;
  }
  canAddFilter(filter: IFilterParametersCore) {
    if (this.currentFilters?.length == 0) return true;
    const KEYS = Object.keys(filter);
    const REDUCE_TO_BOOLEAN = (prev, cur) => prev && cur;
    const COMPARE_VALUES = (f1, f2) => f1 == f2;
    const FILTER_TO_TRUE = (v) => v;
    const [EXISTS] = this.currentFilters
      .map((f) =>
        KEYS.map((k) => COMPARE_VALUES(filter[k], f[k])).reduce(
          REDUCE_TO_BOOLEAN,
          true
        )
      )
      .filter(FILTER_TO_TRUE);

    if (EXISTS) {
      this._notification.notifyWarning(
        'Este filtro já está sendo utilizado na pesquisa'
      );
      return false;
    }

    const EXTRA_FILTERS_KEYS = Object.keys(
      this.data.filters.fields.find(
        (field) => field.value === this.fg.getRawValue().field
      ).extraFilters || {}
    );
    var canAdd = true;
    const CURRENT_EXTRA_FILTERS_KEYS = Object.keys(
      this.data['currentExtraFilters']
    );
    CURRENT_EXTRA_FILTERS_KEYS.forEach((currentKey) => {
      if (EXTRA_FILTERS_KEYS.includes(currentKey)) {
        this._notification.notifyWarning(
          'Esse tipo de filtro não pode aparecer na pesquisa mais de uma vez'
        );
        canAdd = false;
      }
    });

    return canAdd;
  }
  removeFilter(filter: IFilterParametersCore) {
    const [DELETED_FILTER] = this.currentFilters.splice(
      this.currentFilters.indexOf(filter),
      1
    );
    const EXTRA_FILTERS_TO_DELETE =
      this.data.filters.fields.find(
        (field) => field.field === DELETED_FILTER.property
      ).extraFilters || {};
    Object.keys(EXTRA_FILTERS_TO_DELETE).forEach((key) => {
      const { [key]: REMOVE, ...NEW_EXTRA_FILTERS } = this.data[
        'currentExtraFilters'
      ];
      this.data['currentExtraFilters'] = NEW_EXTRA_FILTERS || {};
    });
  }
  getFilterLabel(filter: IFilterParametersCore) {
    const { label: FIELD } = this._currentField;
    const { label: CONDITION } = this.fieldOptions.find(
      (option) =>
        (this._currentField.newCondition
          ? filter.conditionStart
          : filter.condition) === option.value
    );
    const EMPTY_STRING = '(&nbsp&nbsp&nbsp&nbsp)';
    var condition = ` ${EMPTY_STRING}`;
    const CONDITION_START =
      this._currentField.condition === Condition.date
        ? DATE_VALUE_FORMATTER({ value: filter.conditionStart })
        : filter.conditionStart;
    const CONDITION_END =
      this._currentField.condition === Condition.date
        ? DATE_VALUE_FORMATTER({ value: filter.conditionEnd })
        : filter.conditionEnd;
    if (CONDITION_END && CONDITION_START)
      condition = ` ${CONDITION_START} e ${CONDITION_END}`;
    else if (CONDITION_START || CONDITION_END)
      condition = ` ${CONDITION_START || CONDITION_END}`;
    else if (!this.searchValue) condition = ``;
    return `${FIELD} ${CONDITION.toLowerCase()}${
      this._currentField.newCondition ? '' : condition
    }`;
  }
  addFilterOnSearch(filter: IFilterParametersCore) {
    const C = (name) => this.fg.get(name);
    const SET_VALUE = (name, value) =>
      C(name).setValue(value, { emitEvent: false });

    SET_VALUE('conditionStart', filter.conditionStart);
    SET_VALUE('conditionEnd', filter.conditionEnd);
    SET_VALUE('property', filter.property);
    SET_VALUE('condition', filter.condition);
  }
  //* FIM MULTIFILTROS (Filtrar no resultado)
}

export interface SearchConfig {
  id: string;
  title: string;
  endpoint: string;
  filters: ISearchFilters;
  columns: ColDef[];
  telaSistema: number;
  autoSearch?: boolean;
  codigoMenuWeb?: number | string;
  extraFilters?: any;
  lastFilterState?: any;
  apiType: 'accounting' | 'core';
  showOrganismOption?: boolean;
  enableMultiFilterSearch?: boolean;
}

interface ISearchDialogRequestBody {
  pageNumber: number;
  pageSize: number;
  telaSistema: number;
  filterParameters: IFilterParameters[];
  sortParameters?: ISortParameters[];
}

export interface IFilterParameters {
  propriedade: string;
  tipo: number;
  termo: string | number;
  termoFinal?: string | number;
}

// # PARA API CORE
interface ISearchDialogRequestBodyCore {
  page: number;
  pageSize: number;
  filter: IFilterParametersCore;
}

export interface IFilterParametersCore {
  property: string;
  condition: number;
  conditionStart: any;
  conditionEnd?: any;
  textCondition?: string;
}

export interface ISortParameters {
  fieldName: string;
  reverse: boolean;
}

export interface ISearchFilters {
  fields: TheosSearchDialogSelectOption[];
  searchValue?: string | number;
}

export interface TheosSearchDialogSelectOption extends TheosSelectOption {
  condition: Condition;
  field: string;
  newCondition?: ConditionItem;
  extraFilters?: any;
}
