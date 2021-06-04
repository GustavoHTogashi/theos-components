import { AppConfig } from '@lib/_eclesial/config/app.config';
import {
    Condition,
} from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';

export const API_URL = `${AppConfig.settings.env.apiUrlFieisCadastros}v1/`;

export const  ETAPA_CATEQUESE_SEARCH_CONFIG = {
  dialogTitle: 'Busca de etapa da catequese',
  endpoint: `${API_URL}EtapaCatequese`,
  filters: [
    {
      value: 1,
      label: 'Etapa',
      field: 'etapa',
      condition: Condition.text,
      default: true,
    },
    {
      value: 2,
      label: 'Material',
      field: 'material',
      condition: Condition.text,
    },
  ],
  autoSearch: true,
  apiType: 'core',
}