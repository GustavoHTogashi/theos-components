import { relatorioTipoDeDadosEnum } from '@lib/_eclesial/base/component/base.search.interface';
import { ConditionEnum } from '@lib/_eclesial/base/enum/condition.enum';
import { AppConfig } from '@lib/_eclesial/config/app.config';

export const API_URL_NEW = `${AppConfig.settings.env.apiUrlNew}v1/`;
export const API_URL_NEW_FESTAS = `${AppConfig.settings.env.apiUrlFestas}v1/`

export const CLASSIFICACAO_FINANCEIRA_SEARCH_CONFIG = {
  title: 'Busca de classificação financeira',
  endpoint: `${API_URL_NEW}classificacaofinanceira`,
  filters: [
    {
      value: 1,
      label: 'Descrição',
      field: 'descricao',
      condition: ConditionEnum.String,
      default: true
    },
    {
      value: 2,
      label: 'Destino',
      field: 'destino',
      condition: ConditionEnum.Destino,
      extras: {
        tipoDeDados: relatorioTipoDeDadosEnum.Destino,
      },
    },
    {
      value: 3,
      label: 'Conta débito',
      field: 'contaDebito',
      condition: ConditionEnum.String,
    },
    {
      value: 4,
      label: 'Conta crédito',
      field: 'contaCredito',
      condition: ConditionEnum.String,
    },
    {
      value: 5,
      label: 'Provisionar',
      field: 'provisionar',
      condition: ConditionEnum.Bool,
      extras: {
        tipoDeDados: relatorioTipoDeDadosEnum.Booleano,
      },
    },
    {
      value: 6,
      label: 'Apropriar',
      field: 'apropriar',
      condition: ConditionEnum.Bool,
      extras: {
        tipoDeDados: relatorioTipoDeDadosEnum.Booleano,
      },
    },
    {
      value: 7,
      label: 'Situacao',
      field: 'situacao',
      condition: ConditionEnum.Situacao,
      extras: {
        tipoDeDados: relatorioTipoDeDadosEnum.Situacao,
      },
    },
  ],
  apiType: 'accounting',
  autoSearch: true
}

export const CLASSIFICACAO_FINANCEIRA_FESTA_SEARCH_CONFIG = {
  ...CLASSIFICACAO_FINANCEIRA_SEARCH_CONFIG,
  filters: [
    {
      value: 1,
      label: 'Descrição',
      field: 'descricao',
      condition: ConditionEnum.String,
      default: true
    },
  ],
  endpoint: `${API_URL_NEW_FESTAS}classificacaofinanceira`,
  apiType: 'core'
}
