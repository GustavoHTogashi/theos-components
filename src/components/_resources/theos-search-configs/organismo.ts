import { AppConfig } from '@lib/_eclesial/config/app.config';
import {
    Condition,
} from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';

const _API_CONTABIL = AppConfig?.settings.env.apiUrl ?? '';

export const ORGANISMO_SEARCH_CONFIG = {
  dialogTitle: 'Busca de organismo',
  endpoint: `${_API_CONTABIL}v1/organismo`,
  filters: [
    {
      value: 1,
      label: 'Código',
      field: 'codigo',
      condition: Condition.numeric,
    },
    {
      value: 2,
      label: 'Razão Social',
      field: 'razaoSocial',
      condition: Condition.text,
      default: true,
    },
    {
      value: 3,
      label: 'Cidade',
      field: 'cidade',
      condition: Condition.text,
    },
    {
      value: 4,
      label: 'Bairro',
      field: 'bairro',
      condition: Condition.text,
    },
    {
      value: 5,
      label: 'Tipo Organismo',
      field: 'tipoOrganismo.nome',
      condition: Condition.text,
    },
    {
      value: 6,
      label: 'CNPJ',
      field: 'cnpj',
      condition: Condition.text,
    },
  ],
}