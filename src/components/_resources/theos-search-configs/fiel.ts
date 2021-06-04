import { AppConfig } from '@lib/_eclesial/config/app.config';
import {
    Condition,
} from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';
import { TIPO_CONTATO_ENUM } from '@lib/ui/components/src/lib/theos-contact/theos-contact.constants';
import {
    ISearchFilters,
    SearchConfig,
  } from '@lib/ui/components/src/lib/theos-search-dialog/theos-search-dialog.component';
import { ColDef } from 'ag-grid-community';
import { FieisCadastrosActEnum } from '@lib/_eclesial/core/permission-poc/enum/fieis-cadastros';

export const API_URL = `${AppConfig.settings.env.apiUrlFieisCadastros}v1/`;

const WINDOW_ID = 'cadastro-fieis';
const _CODIGO_MENU_WEB = FieisCadastrosActEnum.CADASTRO_FIEIS;

export const FIEL_SEARCH_CONFIG = {
    id: WINDOW_ID + '__search',
    title: 'Busca de cadastro de fiéis',
    endpoint: `${API_URL}Fiel`,
    apiType: 'core',
    autoSearch: true,
    enableMultiFilterSearch: true,
    codigoMenuWeb: _CODIGO_MENU_WEB,
    columns: [
      {
        hide: true,
        field: 'id',
      },
      {
        headerName: 'Nome',
        headerTooltip: 'Nome',
        field: 'nome',
        minWidth: 120,
      },
      {
        headerName: 'Código dizimista',
        headerTooltip: 'Código dizimista',
        field: 'codigoDizimista',
        minWidth: 120,
      },
      {
        headerName: 'Data de nascimento',
        headerTooltip: 'Data de nascimento',
        field: 'dataNascimento',
        minWidth: 120,
      },
      {
        headerName: 'CPF',
        headerTooltip: 'CPF',
        field: 'cpf',
        minWidth: 120,
      },
      {
        headerName: 'Cônjuge',
        headerTooltip: 'Cônjuge',
        field: 'conjuge',
        minWidth: 120,
      },
      {
        headerName: 'Comunidade',
        headerTooltip: 'Comunidade',
        field: 'comunidade',
        minWidth: 120,
      },
      {
        headerName: 'Pai',
        headerTooltip: 'Pai',
        field: 'pai',
        minWidth: 120,
      },
      {
        headerName: 'Mãe',
        headerTooltip: 'Mãe',
        field: 'mae',
        minWidth: 120,
      },
      {
        headerName: 'E-mail',
        headerTooltip: 'E-mail',
        field: 'email',
        minWidth: 120,
      },
      {
        headerName: 'Código benfeitor',
        headerTooltip: 'Código benfeitor',
        field: 'benfeitorId',
        minWidth: 120,
      },
      {
        headerName: 'Grupo',
        headerTooltip: 'Grupo',
        field: 'grupo',
        minWidth: 120,
      },
      {
        headerName: 'Cidade',
        headerTooltip: 'Cidade',
        field: 'cidade',
        minWidth: 120,
      },
      {
        headerName: 'Bairro',
        headerTooltip: 'Bairro',
        field: 'bairro',
        minWidth: 120,
      },
      {
        headerName: 'Endereço',
        headerTooltip: 'Endereço',
        field: 'endereco',
        minWidth: 120,
      },
      {
        headerName: 'Complemento',
        headerTooltip: 'Complemento',
        field: 'complemento',
        minWidth: 120,
      },
      {
        headerName: 'CEP',
        headerTooltip: 'CEP',
        field: 'cep',
        minWidth: 120,
      },
      {
        headerName: 'Estado',
        headerTooltip: 'Estado',
        field: 'estado',
        minWidth: 120,
      },
      {
        headerName: 'Contato',
        headerTooltip: 'Contato',
        field: 'contato',
        minWidth: 120,
      },
      {
        headerName: 'Sexo',
        headerTooltip: 'Sexo',
        field: 'sexo',
        minWidth: 120,
      },
      {
        headerName: 'Cartão magnético',
        headerTooltip: 'Cartão magnético',
        field: 'cartaoMagnetico',
        minWidth: 120,
      },
      {
        headerName: 'Id comunidade',
        headerTooltip: 'Id comunidade',
        field: 'comunidadeId',
        minWidth: 120,
      },
      {
        headerName: 'Id fiel',
        headerTooltip: 'Id fiel',
        field: 'id',
        minWidth: 120,
      },
    ] as ColDef[],
    filters: {
      fields: [
        {
          value: 1,
          label: 'Nome',
          field: 'nome',
          condition: Condition.text,
          default: true,
        },
        {
          value: 2,
          label: 'Código dizimista',
          field: 'dizimistaId',
          condition: Condition.numeric,
        },
        {
          value: 3,
          label: 'Data de nascimento',
          field: 'dataNascimento',
          condition: Condition.date,
        },
        {
          value: 4,
          label: 'CPF',
          field: 'cpf',
          condition: Condition.text,
        },
        {
          value: 5,
          label: 'Conjuge',
          field: 'nomeConjuge',
          condition: Condition.text,
        },
        {
          value: 6,
          label: 'Comunidade',
          field: 'comunidade',
          condition: Condition.text,
        },
        {
          value: 7,
          label: 'Pai',
          field: 'nomePai',
          condition: Condition.text,
        },
        {
          value: 8,
          label: 'Mãe',
          field: 'nomeMae',
          condition: Condition.text,
        },
        {
          value: 10,
          label: 'Código benfeitor',
          field: 'benfeitorId',
          condition: Condition.numeric,
        },
        {
          value: 11,
          label: 'Grupo',
          field: 'grupo',
          condition: Condition.text,
        },
        {
          value: 12,
          label: 'Cidade',
          field: 'cidade',
          condition: Condition.text,
        },
        {
          value: 13,
          label: 'Bairro',
          field: 'bairro',
          condition: Condition.text,
        },
        {
          value: 14,
          label: 'Endereço',
          field: 'endereco',
          condition: Condition.text,
        },
        {
          value: 15,
          label: 'Complemento',
          field: 'complemento',
          condition: Condition.text,
        },
        {
          value: 16,
          label: 'CEP',
          field: 'cep',
          condition: Condition.text,
        },
        {
          value: 17,
          label: 'Estado',
          field: 'estado',
          condition: Condition.text,
        },
        {
          value: 18,
          label: 'Telefone residencial',
          field: 'contato',
          condition: Condition.text,
          extraFilters: { contatoTipoId: TIPO_CONTATO_ENUM.TELEFONE_RESIDENCIAL },
        },
        {
          value: 19,
          label: 'Celular',
          field: 'contato',
          condition: Condition.text,
          extraFilters: { contatoTipoId: TIPO_CONTATO_ENUM.CELULAR },
        },
        {
          value: 20,
          label: 'Fax',
          field: 'contato',
          condition: Condition.text,
          extraFilters: { contatoTipoId: TIPO_CONTATO_ENUM.FAX },
        },
        {
          value: 22,
          label: 'Email',
          field: 'contato',
          condition: Condition.text,
          extraFilters: { contatoTipoId: TIPO_CONTATO_ENUM.EMAIL },
        },
        {
          value: 23,
          label: 'Sexo',
          field: 'sexo',
          newCondition: {
            key: 'sexo',
            options: [
              {
                value: 'M',
                label: 'Masculino',
                default: true,
              },
              {
                value: 'F',
                label: 'Feminino',
              },
            ],
          },
        },
        {
          value: 24,
          label: 'Cartão magnético',
          field: 'cartaoMagnetico',
          condition: Condition.text,
        },
        {
          value: 25,
          label: 'Id comunidade',
          field: 'comunidadeId',
          condition: Condition.numeric,
        },
        {
          value: 26,
          label: 'Id fiel',
          field: 'id',
          condition: Condition.numeric,
        },
      ],
    } as ISearchFilters,
  } as SearchConfig;