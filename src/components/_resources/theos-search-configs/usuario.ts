import { AppConfig } from '@lib/_eclesial/config/app.config';
import { Condition } from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';
import { ActionsPermission } from '@lib/_eclesial/config/app-permissoes.config';
import { TelaSistemaEnum } from '@lib/_eclesial/base/enum/tela-sistema.enum';
import { ColDef } from 'ag-grid-community';

export const _CODIGO_MENU_WEB = new ActionsPermission().BBT_FESTAS_RELATORIO_TURNOS;

export const API_URL: string = `${AppConfig.settings.env.apiUrl}v1/`;
export const API_URL_FESTAS: string = `${AppConfig.settings.env.apiUrlFestas}v1/`;

export const USUARIO_SEARCH_CONFIG = {
  id: 'busca-usuario',
  title: 'Busca de usuário',
  endpoint: `${API_URL}usuario`,
  // TODO: refatorar tipo da prop filters dos componentes theos-input-search-component e theos-input-search-gr
  filters: {
    fields: [
        {
          value: 1,
          label: 'Nome',
          field: 'nome',
          condition: Condition.text,
          default: true
        },
      ]
  },
  columns: [
    {
      headerName: 'Nome',
      headerTooltip: 'Nome',
      field: 'nome',
      minWidth: 300
    },
  ] as ColDef[],
  telaSistema: TelaSistemaEnum.relTurnos,
  autoSearch: true,
  apiType: 'accounting'
} as any

export const USUARIO_FESTAS_SEARCH_CONFIG = {
  ...USUARIO_SEARCH_CONFIG,
  codigoMenuWeb: _CODIGO_MENU_WEB,
  endpoint: `${API_URL_FESTAS}Operador`,
  apiType: 'core',
  autoSearch: true
} as any