import { Condition } from "src/components/_models/search-dialog-field-options.model";


const _API_FINANCEIRO = '' ?? '';

export const PLANO_CONTAS_CONTABIL_SEARCH_CONFIG = {
    dialogTitle: 'Busca de plano de contas',
    endpoint: `${_API_FINANCEIRO}v1/planoContasContabil`,
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
        label: 'Conta',
        field: 'conta',
        condition: Condition.text,
      },
      {
        value: 3,
        label: 'Descrição',
        field: 'descricao',
        condition: Condition.text,
      },
      {
        value: 4,
        label: 'Natureza',
        field: 'natureza',
        condition: Condition.text,
      },
      {
        value: 5,
        label: 'Conta de disponivel',
        field: 'contaDeDisponivel',
        condition: Condition.bool,
      },
      {
        value: 6,
        label: 'Situação',
        field: 'situacao',
        condition: Condition.situation,
      },
      {
        value: 7,
        label: 'DRE',
        field: 'dre',
        condition: Condition.text,
      },
    ],
    extraFilters: { organismoId: null },
    extraProps: { organismoId: null },
}