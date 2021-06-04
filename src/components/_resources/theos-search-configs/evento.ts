import { AppConfig } from '@lib/_eclesial/config/app.config';
import { Condition } from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';
import { ActionsPermission } from '@lib/_eclesial/config/app-permissoes.config';
import { ColDef } from 'ag-grid-community';

export const _CODIGO_MENU_WEB = new ActionsPermission().BBT_FESTAS_EVENTO;

export const API_URL: string = `${AppConfig.settings.env.apiUrlFestas}v1/`;

const _DATE_REMOVE_HOURS = (params: any) => {
  return params.value ? params.value.split(" ")[0] : ''
};

export const EVENTO_SEARCH_CONFIG = {
  id: 'busca-evento',
  title: 'Busca de festas e eventos',
  endpoint: `${API_URL}Festa`,
  // TODO: refatorar tipo da prop filters dos componentes theos-input-search-component e theos-input-search-gr
  filters: {
    fields: [
        {
          value: 1,
          label: 'Nome',
          field: 'nomeFesta',
          condition: Condition.text,
          default: true
        },
        {
          value: 2,
          label: 'Local',
          field: 'localFesta',
          condition: Condition.text,
        },
        {
          value: 3,
          label: 'Data início',
          field: 'dataInicio',
          condition: Condition.date,
        },
        {
          value: 4,
          label: 'Data término',
          field: 'dataTermino',
          condition: Condition.date,
        },
        {
          value: 5,
          label: 'Ativo',
          field: 'ativo',
          condition: Condition.bool,
        },
      ]
  },
  columns: [
    {
      headerName: 'Nome',
      headerTooltip: 'Nome',
      field: 'nomeFesta',
      minWidth: 300
    },
    {
      headerName: 'Local',
      headerTooltip: 'Local',
      field: 'localFesta',
      minWidth: 300
    },
    {
      headerName: 'Data início',
      headerTooltip: 'Data início',
      field: 'dataInicio',
      valueFormatter: _DATE_REMOVE_HOURS,
      minWidth: 300
    },
    {
      headerName: 'Data término',
      headerTooltip: 'Data término',
      field: 'dataTermino',
      valueFormatter: _DATE_REMOVE_HOURS,
      minWidth: 300
    },
    {
      headerName: 'Ativo',
      headerTooltip: 'Ativo',
      field: 'ativo',
      minWidth: 300,
    },
  ] as ColDef[],
  telaSistema: null,
  autoSearch: true,
  apiType: 'core'
} as any