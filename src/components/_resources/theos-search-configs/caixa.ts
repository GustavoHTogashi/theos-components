import { Condition } from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';
import { ActionsPermission } from '@lib/_eclesial/config/app-permissoes.config';
import { AppConfig } from '@lib/_eclesial/config/app.config';
import { ColDef } from 'ag-grid-community';

export const _CODIGO_MENU_WEB = new ActionsPermission().BBT_FESTAS_ABRIR_CAIXA;

export const API_URL = `${AppConfig.settings.env.apiUrlFestas}v1/`;

export const CAIXA_SEARCH_CONFIG = {
  id: 'busca-caixas',
  title: 'Busca de caixas',
  endpoint: `${API_URL}caixa`,
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
    ]
  },
  columns: [
    {
      headerName: 'Descrição',
      headerTooltip: 'descricao',
      field: 'descricao',
    },
  ] as ColDef[],
  telaSistema: null,
  autoSearch: true,
  apiType: 'core',
  extraProps: { festaId: 0 },
  extraFilters: { festaId: 0 }
} as any
