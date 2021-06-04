import { AppConfig } from '@lib/_eclesial/config/app.config';
import {
    Condition,
} from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';

export const API_URL = `${AppConfig.settings.env.apiUrlFieisCadastros}v1/`;

export const PASTORAL_SEARCH_CONFIG = {
  dialogTitle: 'Busca de pastoral',
  endpoint: `${API_URL}Pastoral`,
  filters: [
    {
      value: 1,
      label: 'Pastoral',
      field: 'descricao',
      condition: Condition.text,
    },
  ],
  autoSearch: true,
  apiType: 'core',
}