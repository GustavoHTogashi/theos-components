import { AppConfig } from '@lib/_eclesial/config/app.config';
import {
    Condition,
} from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';

const _API_FINANCEIRO = AppConfig?.settings.env.apiUrl ?? '';

export const CENTRO_CUSTO_SEARCH_CONFIG = {
    dialogTitle: 'Busca de centro de custos',
    showOrganismOption: true,
    endpoint: `${_API_FINANCEIRO}v1/centroCusto`,
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
      {
        value: 3,
        label: 'Paróquia vinculada',
        field: 'paroquiaVinculada',
        condition: Condition.text,
      },
      {
        value: 4,
        label: 'Matriz',
        field: 'isMatriz',
        condition: Condition.bool,
      },
      {
        value: 5,
        label: 'Situação',
        field: 'situacao',
        condition: Condition.situation,
      },
    ],
}