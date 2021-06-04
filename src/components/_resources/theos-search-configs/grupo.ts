import { AppConfig } from '@lib/_eclesial/config/app.config';
import {
    Condition,
} from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';

export const API_URL = `${AppConfig.settings.env.apiUrlFieisCadastros}v1/`;

export const GRUPO_SEARCH_CONFIG = {
  dialogTitle: 'Busca de grupos da comunidade',
  endpoint: `${API_URL}Grupo`,
  filters: [
    {
      value: 1,
      label: 'Nome',
      field: 'nome',
      condition: Condition.text,
    },
  ],
  autoSearch: true,
  extraFilters: { comunidadeId: 0 },
  apiType: 'core',
}