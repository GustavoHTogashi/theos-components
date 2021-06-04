import { AppConfig } from '@lib/_eclesial/config/app.config';
import {
    Condition,
} from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';

const _API_FINANCEIRO = AppConfig?.settings.env.apiUrl ?? '';

export const HISTORICO_PADRAO_SEARCH_CONFIG = {
    dialogTitle: 'Busca de histórico padrões',
    endpoint: `${_API_FINANCEIRO}v1/historicoContabil`,
    filters: [
      {
        value: 1,
        label: 'Código',
        field: 'codigo',
        condition: Condition.numeric,
        default: true,
      },
      {
        value: 2,
        label: 'Descrição',
        field: 'descricao',
        condition: Condition.text,
      },
    ],
  }