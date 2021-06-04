import { AppConfig } from '@lib/_eclesial/config/app.config';
import { Condition } from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';
import { SearchGenericConfig } from '@lib/ui/components/src/lib/theos-search-dialog/theos-search-dialog-generic.component';
import { ActionsPermission } from '@lib/_eclesial/config/app-permissoes.config';
import { ColDef } from 'ag-grid-community';

export const _CODIGO_MENU_WEB = new ActionsPermission().BBT_FESTAS_FORMA_RECEBIMENTO;

export const API_URL = `${AppConfig.settings.env.apiUrlFestas}v1/`;

export const FORMA_RECEBIMENTO_SEARCH_CONFIG = {
  id: 'forma-recebimento',
  title: 'Busca de forma de recebimento',
  endpoint: `${API_URL}FormaRecebimento`,
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
      headerTooltip: 'Descrição',
      field: 'descricao',
      minWidth: 500
    },
  ] as ColDef[],
  filtersValue: null,
  telaSistema: null,
  autoSearch: true,
  apiType: 'core'
} as any