import { AppConfig } from '@lib/_eclesial/config/app.config';
import { Condition } from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';
import { SearchGenericConfig } from '@lib/ui/components/src/lib/theos-search-dialog/theos-search-dialog-generic.component';
import { ActionsPermission } from '@lib/_eclesial/config/app-permissoes.config';
import { ColDef } from 'ag-grid-community';

export const _CODIGO_MENU_WEB = new ActionsPermission().BBT_FESTAS_UNIDADE;

export const API_URL: string = `${AppConfig.settings.env.apiUrlFestas}v1/`;

export const UNIDADE_SEARCH_CONFIG = {
  id: 'busca-unidade',
  title: 'Busca de unidade',
  endpoint: `${API_URL}Unidade`,
  // TODO: refatorar tipo da prop filters dos componentes theos-input-search-component e theos-input-search-gr
  filters: {
    fields: [
      {
        value: 1,
        label: 'Unidade',
        field: 'descricao',
        condition: Condition.text,
        default: true,
      },
    ]
  },
  columns: [
    {
      headerName: 'Unidade',
      headerTooltip: 'Unidade',
      field: 'descricao',
      minWidth: 500
    },
  ] as ColDef[],
  telaSistema: null,
  autoSearch: true,
  apiType: 'core'
} as any