import { AppConfig } from '@lib/_eclesial/config/app.config';
import { ConditionEnum } from '@lib/_eclesial/base/enum/condition.enum';
import { ActionsPermission } from '@lib/_eclesial/config/app-permissoes.config';
import { ColDef } from 'ag-grid-community';

export const _CODIGO_MENU_WEB = new ActionsPermission().BBT_FESTAS_CANCELAR_VENDA;

export const API_URL = `${AppConfig.settings.env.apiUrlFestas}v1/`;

export const VENDA_SEARCH_CONFIG = {
  id: 'vendas',
  dialogTitle: 'Busca de vendas',
  endpoint: `${API_URL}venda`,
  filters: {
    fields: [
        {
            value: 1,
            label: 'Número da venda',
            field: 'venda',
            condition: ConditionEnum.Numerico,
            default: true
        },
        {
            value: 2,
            label: 'Data',
            field: 'data',
            condition: ConditionEnum.Data,
        },
        {
            value: 3,
            label: 'Qtde Itens',
            field: 'quantidade',
            condition: ConditionEnum.Numerico,
        },
        {
            value: 4,
            label: 'Valor',
            field: 'valor',
            condition: ConditionEnum.Money,
        },
    ]
  },
  columns: [
    {
        headerName: 'Número da venda',
        headerTooltip: 'Venda',
        field: 'venda',
        minWidth: 700
    },
    {
        headerName: 'Data',
        headerTooltip: 'Data',
        field: 'data',
        minWidth: 500
    },
    {
        headerName: 'Qtde Itens',
        headerTooltip: 'Qtde Itens',
        field: 'quantidade',
        minWidth: 500
    },
    {
        headerName: 'Valor',
        headerTooltip: 'Valor',
        field: 'valor',
        minWidth: 500
    },
  ] as ColDef[],
  filtersValue: null,
  telaSistema: null,
  autoSearch: true,
  apiType: 'core'
} as any