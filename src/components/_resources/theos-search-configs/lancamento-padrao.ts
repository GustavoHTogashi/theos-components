import { AppConfig } from '@lib/_eclesial/config/app.config';
import { ActionsPermission } from '@lib/_eclesial/config/app-permissoes.config';
import {
    Condition,
    ConditionItem,
} from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';

const _API_FINANCEIRO = AppConfig?.settings.env.apiUrl ?? '';

export const LANCAMENTO_PADRAO_SEARCH_CONFIG = {
  dialogTitle: 'Busca de lançamento padrão',
  endpoint: `${_API_FINANCEIRO}v1/lancamentopadrao`,
  codigoMenuWeb: new ActionsPermission().BBT_LANCAMENTO_PADRAO,
  filters: [
    {
      value: 1,
      label: 'Código',
      field: 'codigo',
      condition: Condition.numeric,
    },
    {
      value: 2,
      label: 'Descrição',
      field: 'descricao',
      condition: Condition.text,
    },
    {
      value: 3,
      label: 'Nível de acesso',
      field: 'nivelAcessoDescricao',
      newCondition: {
        key: 'nivelAcesso',
        options: [
          {
            value: 1,
            label: 'Diocesano',
            default: true,
          },
          {
            value: 2,
            label: 'Neste organismo',
          },
          {
            value: 3,
            label: 'Organismo especifico',
          },
        ],
      } as ConditionItem,
    },
  ],
}