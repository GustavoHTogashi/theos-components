import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpRequestService } from 'src/services/http-request/http-request.service';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';
import { TheosSearchDialogSelectOption } from './theos-search-dialog.component';
import { TheosSearchDialogService } from './theos-search-dialog.service';


@Component({
  selector: 'theos-search-dialog-generic',
  templateUrl: './theos-search-dialog-generic.component.html',
  styleUrls: [
    './theos-search-dialog.component.scss',
    './theos-search-dialog-generic.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheosSearchDialogGenericComponent
  implements OnInit, AfterViewInit, OnDestroy {
  fg: FormGroup;
  gridOptions: GridOptions;
  fieldOptions: TheosSearchDialogSelectOption[] = [];
  newResponse$ = new Subject<any>();
  disableSelected = true;

  selectedRows = null;
  totalSearchData = 0;

  prefix = THEOS_COMPONENTS_PREFIXES.searchDialog;

  @Input() result$: Subject<any>;
  @Input() viewModel: any;

  @Output() selected: any = new EventEmitter<any>();
  @Output() newSearch: any = new EventEmitter<number>();

  private readonly _COMPONENT_DESTROY$ = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SearchGenericConfig,
    private _searchDialog: TheosSearchDialogService,
    private _dialog: MatDialog,
    private _http: HttpRequestService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._gridInit();
  }

  ngAfterViewInit(): void {
    this.result$
      .pipe(takeUntil(this._COMPONENT_DESTROY$))
      .subscribe((result) => {
        this.newResponse$.next({
          totalData: result.rowCount,
          page: result.pageNumber,
        });

        this.totalSearchData = result.rowCount;

        this.gridOptions?.api?.setRowData(result.data);
      });

    this._cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this._COMPONENT_DESTROY$.next();
    this._COMPONENT_DESTROY$.complete();
  }

  handleClose() {
    this._searchDialog.close();
  }

  handleSearch(pageNumber: number) {
    this.newSearch.emit(pageNumber);
  }

  handlePrint() {
    this.imprimirPersonalizado();
  }

  handleSelected() {
    const ROW_OR_ROWS =
      this.selectedRows?.length === 1
        ? this.selectedRows[0]
        : this.selectedRows ?? null;
    this.selected.emit(ROW_OR_ROWS);
  }

  private _gridInit() {
    this.gridOptions = this._searchDialog.createGridOptions();
    this.gridOptions.columnDefs = this.data.columns;
    this.gridOptions.onRowDoubleClicked = () => this.handleSelected();
    this.gridOptions.onRowClicked = () => this._setSelected();
  }

  private _setSelected() {
    const SELECTED = this.gridOptions.api.getSelectedRows();

    this.selectedRows = SELECTED;
    this.disableSelected = SELECTED.length === 0;
    this._cdr.markForCheck();
  }

  // * IMPRESSÃO DE BUSCAS

  dialogComponent: any;
  limiteImpressao = 1;
//   dataPersonalizada: Array<Interface.IObjetosFonteDeDadosProperties> = [];
  configDialogRelatorioPersonalizado = {};
  configuracaoDaTela: Array<any> = [];

  imprimirPersonalizado() {
    if (!this.totalSearchData) return;
    // this.dataPersonalizada = this.mesclarDados();
    this.configuracaoDaTela = this.pegarConfiguracoesDaTela();
    this.configDialogRelatorioPersonalizado = {
      titleSearch: this.data.title,
      viewModel: this.viewModel,
      apiUrl: this.data.endpoint,
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

//   pegarObjetosFonteDeDadosProperties(): Array<Interface.IObjetosFonteDeDadosProperties> {
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
}

export interface SearchGenericConfig {
  id: string;
  title: string;
  endpoint: string;
  columns: ColDef[];
  telaSistema: number;
  autoSearch?: boolean;
  codigoMenuWeb?: number | string;
  lastFilterState?: any;
  extraFilters?: any;
}

export interface SearchResult {
  data: any[];
  pageCount: number;
  pageNumber: number;
  rowCount: number;
}
