import {
  Condition
} from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';
import { AppConfig } from '@lib/_eclesial/config/app.config';

const _API_FINANCEIRO = AppConfig?.settings.env.apiUrl ?? '';

export const BANCO_SEARCH_CONFIG = {
    title: 'Busca de bancos',
    endpoint: `${_API_FINANCEIRO}v1/banco`,
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
        label: 'Nome do banco',
        field: 'nomeBanco',
        condition: Condition.text,
      },
      {
        value: 3,
        label: 'Agência',
        field: 'agencia',
        condition: Condition.text,
      },
      {
        value: 4,
        label: 'Número da conta',
        field: 'conta',
        condition: Condition.text,
      },
      {
        value: 5,
        label: 'Tipo da conta',
        field: 'tipoConta',
        condition: Condition.text,
      },
      {
        value: 6,
        label: 'Código da conta',
        field: 'contaContabil',
        condition: Condition.numeric,
      },
      {
        value: 7,
        label: 'Conta',
        field: 'descricaoContaContabil',
        condition: Condition.text,
      },
      {
        value: 8,
        label: 'Situação',
        field: 'situacao',
        condition: Condition.situation,
      },
    ],
    extraProps: { contaContabilId: null, organismoId: null },
    extraFilters: {
      contaContabilId: null,
      organismoId: null,
    }
}
