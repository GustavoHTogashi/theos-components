import { AppConfig } from '@lib/_eclesial/config/app.config';
import {
    Condition,
} from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';

export const API_URL = `${AppConfig.settings.env.apiUrlFieisCadastros}v1/`;

export const MOVIMENTO_SEARCH_CONFIG = {
  dialogTitle: 'Busca de movimento',
  endpoint: `${API_URL}Movimento`,
  filters: [
    {
      value: 1,
      label: 'Movimento',
      field: 'descricao',
      condition: Condition.text,
    },
  ],
  autoSearch: true,
  apiType: 'core',
}