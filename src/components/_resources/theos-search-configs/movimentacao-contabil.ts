import { CurrencyPipe, DatePipe } from '@angular/common';
import { SearchGenericConfig } from '@lib/ui/components/src/lib/theos-search-dialog/theos-search-dialog-generic.component';
import { relatorioTipoDeDadosEnum } from '@lib/_eclesial/base/component/base.search.interface';
import { TelaSistemaEnum } from '@lib/_eclesial/base/enum/tela-sistema.enum';
import { AppConfig } from '@lib/_eclesial/config/app.config';
import { ContabilidadeActEnum } from '@lib/_eclesial/core/permission-poc/enum/contabilidade';
import { ColDef } from 'ag-grid-community';

const _API_CONTABIL = AppConfig?.settings.env.apiUrlContabil ?? '';
const TELA_SISTEMA = TelaSistemaEnum.movimentacaoContabil;
const _CODIGO_MENU_WEB = ContabilidadeActEnum.MOVIMENTACAO_CONTABIL;

const _DATE_VALUE_FORMATTER = (params: any) => {
  return params.value && params.value.substring(4, 5) === '-'
    ? new DatePipe(
        AppConfig.settings.env.internationalization.locale
      ).transform(
        params.value,
        AppConfig.settings.env.internationalization.dateFormat
      )
    : params.value;
};

const _MOEDA_VALUE_FORMATTER = (row: any) => {
  let datePipe = new CurrencyPipe(
    AppConfig.settings.env.internationalization.locale
  );
  return datePipe.transform(
    row.value,
    AppConfig.settings.env.internationalization.currency.code
  );
};

export const MOVIMENTACAO_CONTABIL_SEARCH_CONFIG = {
  id: 'movimentacao-contabil-search',
  title: 'Busca de movimentação contábil',
  endpoint: `${_API_CONTABIL}v1/MovimentoContabil/search`,
  codigoMenuWeb: _CODIGO_MENU_WEB,
  columns: [
    {
      headerName: 'Número do Lançamento',
      headerTooltip: 'Número do Lançamento',
      field: 'numeroLancamento',
    },
    {
      headerName: 'Data',
      headerTooltip: 'Data',
      field: 'data',
      cellStyle: { textAlign: 'center' },
      valueFormatter: _DATE_VALUE_FORMATTER,
      extras: {
        tipoDeDados: relatorioTipoDeDadosEnum.Data,
      },
    },
    {
      headerName: 'Tipo do documento',
      headerTooltip: 'Tipo do documento',
      field: 'tipoDocumento',
    },
    {
      headerName: 'Documento',
      headerTooltip: 'Documento',
      field: 'documento',
    },
    {
      headerName: 'Tipo',
      headerTooltip: 'Tipo',
      field: 'tipo',
    },
    {
      headerName: 'Origem',
      headerTooltip: 'Origem',
      field: 'origem',
    },
    {
      headerName: 'Valor',
      headerTooltip: 'Valor',
      field: 'valor',
      cellStyle: { textAlign: 'right' },
      valueFormatter: _MOEDA_VALUE_FORMATTER,
      extras: {
        tipoDeDados: relatorioTipoDeDadosEnum.Moeda,
      },
    },
    {
      headerName: 'Conta',
      headerTooltip: 'Conta',
      field: 'conta',
    },
    {
      headerName: 'Centro de custo',
      headerTooltip: 'Centro de custo',
      field: 'centroCusto',
    },
    {
      headerName: 'Histórico',
      headerTooltip: 'Histórico',
      field: 'historico',
    },
    {
      headerName: 'Banco',
      headerTooltip: 'Banco',
      field: 'banco',
    },
  ] as ColDef[],
  filtersValue: null,
  telaSistema: TELA_SISTEMA,
  autoSearch: true,
} as SearchGenericConfig