import { AppConfig } from '@lib/_eclesial/config/app.config';
import {
    Condition,
} from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';
import { ActionsPermission } from '@lib/_eclesial/config/app-permissoes.config';
import { TelaSistemaEnum } from '@lib/_eclesial/base/enum/tela-sistema.enum';
import { ColDef } from 'ag-grid-community';

export const _CODIGO_MENU_WEB_FESTAS = new ActionsPermission().BBT_FESTAS_EVENTO

export const API_URL = `${AppConfig.settings.env.apiUrlFieisCadastros}v1/`;
export const API_URL_FESTAS = `${AppConfig.settings.env.apiUrlFestas}v1/`;

export const COMUNIDADE_SEARCH_CONFIG = {
  dialogTitle: 'Busca de comunidades',
  endpoint: `${API_URL}Comunidade`,
  filters: [
    {
      value: 1,
      label: 'Nome',
      field: 'nome',
      condition: Condition.text,
    },
  ],
  autoSearch: true,
  apiType: 'core',
}

export const COMUNIDADE_FESTA_SEARCH_CONFIG = {
  id: 'busca-comunidades',
  title: 'Busca de comunidades',
  endpoint: `${API_URL_FESTAS}comunidade`,
  // TODO: refatorar tipo da prop filters dos componentes theos-input-search-component e theos-input-search-gr
  filters: {
    fields: [
        {
          value: 1,
          label: 'Comunidade',
          field: 'descricao',
          condition: Condition.text,
          default: true
        },
      ]
  },
  columns: [
    {
      headerName: 'Comunidade',
      headerTooltip: 'Comunidade',
      field: 'descricao',
      minWidth: 300
    },
  ] as ColDef[],
  telaSistema: TelaSistemaEnum.organismo,
  autoSearch: true,
  apiType: 'core'
} as any