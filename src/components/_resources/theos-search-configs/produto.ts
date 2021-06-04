import { AppConfig } from '@lib/_eclesial/config/app.config';
import { Condition } from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';
import { ActionsPermission } from '@lib/_eclesial/config/app-permissoes.config';
import { CurrencyPipe } from '@angular/common';
import { ColDef } from 'ag-grid-community';

export const _CODIGO_MENU_WEB = new ActionsPermission().BBT_FESTAS_PRODUTO;

export const API_URL = `${AppConfig.settings.env.apiUrlFestas}v1/`;

const _MOEDA_VALUE_FORMATTER = (row: any) => {
  const datePipe = new CurrencyPipe(
    AppConfig.settings.env.internationalization.locale
  );
  return datePipe.transform(
    row.value,
    AppConfig.settings.env.internationalization.currency.code
  );
};

export const PRODUTO_SEARCH_CONFIG = {
  id: 'busca-produto',
  title: 'Busca de produtos',
  endpoint: `${API_URL}Produto`,
  // TODO: refatorar tipo da prop filters dos componentes theos-input-search-component e theos-input-search-gr
  filters: {
    fields: [
      {
        value: 1,
        label: 'Descrição',
        field: 'descricao',
        condition: Condition.text,
        default: true,
      },
      {
        value: 2,
        label: 'Código',
        field: 'codigo',
        condition: Condition.numeric,
        default: true,
      },
      {
        value: 3,
        label: 'Valor',
        field: 'valor',
        condition: Condition.money,
      },
      {
        value: 4,
        label: 'Unidade',
        field: 'unidade',
        condition: Condition.text,
      },
      {
        value: 5,
        label: 'Grupo',
        field: 'grupo',
        condition: Condition.text,
      },
      {
        value: 6,
        label: 'Ativo',
        field: 'ativo',
        condition: Condition.bool,
      },
    ]
  },
  columns: [
    {
      headerName: 'Descrição',
      headerTooltip: 'descricao',
      field: 'descricao',
    },
    {
      headerName: 'Código',
      headerTooltip: 'codigo',
      field: 'codigo',
    },
    {
      headerName: 'Valor',
      headerTooltip: 'valor',
      field: 'valorUnitario',
      valueFormatter: _MOEDA_VALUE_FORMATTER
    },
    {
      headerName: 'Unidade',
      headerTooltip: 'unidade',
      field: 'unidade.descricao',
    },
    {
      headerName: 'Grupo',
      headerTooltip: 'grupo',
      field: 'grupoProduto.descricao',
    },
    {
      headerName: 'Ativo',
      headerTooltip: 'ativo',
      field: 'ativo',
    },
  ] as ColDef[],
  telaSistema: null,
  autoSearch: true,
  apiType: 'core',
  extraProps: { grupoId: 0 },
  extraFilters: { grupoId: 0 }
} as any