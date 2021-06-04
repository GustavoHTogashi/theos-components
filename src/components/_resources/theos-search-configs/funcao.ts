import { AppConfig } from '@lib/_eclesial/config/app.config';
import {
    Condition,
} from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';

export const API_URL = `${AppConfig.settings.env.apiUrlFieisCadastros}v1/`;

export const FUNCAO_SEARCH_CONFIG = {
  dialogTitle: 'Busca de função',
  endpoint: `${API_URL}Funcao`,
  filters: [
    {
      value: 1,
      label: 'Descrição',
      field: 'descricao',
      condition: Condition.text,
    },
  ],
  autoSearch: true,
  apiType: 'core',
}