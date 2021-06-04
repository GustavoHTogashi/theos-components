import { AppConfig } from '@lib/_eclesial/config/app.config';
import {
    Condition,
} from '@lib/ui/components/src/lib/_models/search-dialog-field-options.model';

export const API_URL = `${AppConfig.settings.env.apiUrlFieisCadastros}v1/`;

export const AGENTE_DIZIMO_SEARCH_CONFIG = {
  dialogTitle: 'Busca de missionário do dízimo',
  endpoint: `${API_URL}AgenteDizimo`,
  filters: [
    {
      value: 1,
      label: 'Nome',
      field: 'nome',
      condition: Condition.text,
    },
  ],
  autoSearch: true,
  apiType: 'core',
}