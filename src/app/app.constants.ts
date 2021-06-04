import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators
} from '@angular/forms';
import { TheosDateInterval } from 'src/components/theos-date-interval/theos-date-interval.interface';
import { TheosDate } from 'src/components/theos-date/theos-date.interface';
import { TheosFieldInfo } from 'src/components/theos-info/theos-field-info.interface';
import { InputType } from 'src/components/theos-input/theos-input.constants';
import { TheosMoneyInterval } from 'src/components/theos-money-interval/theos-money-interval.interface';
import { TheosNumber } from 'src/components/theos-number/theos-number.interface';
import { TheosSelect } from 'src/components/theos-select/theos-select.interface';
import { DateTypeEnum } from 'src/components/_directives/date/date.directive.constants';
import {
	Condition,
	ConditionItem
} from 'src/components/_models/search-dialog-field-options.model';
import { PLANO_CONTAS_CONTABIL_SEARCH_CONFIG } from 'src/components/_resources/theos-search-configs/plano-contas-contabil';

export const CONTROL_NAMES = {
  address: 'endereco',
  contact: 'contato',

  date: 'data',

  fieldInfo: 'campoDescricao',

  dateInitial: 'dataInicial',
  dateFinal: 'dataFinal',
  dateInterval: 'dateInterval',

  input: 'campoTexto',
  inputFiel: 'campoFiel',

  inputSearch: 'campoBusca',
  inputSearchGroup: 'campoBuscaGrupo',

  moneyInitial: 'valorInicial',
  moneyFinal: 'valorFinal',
  moneyInterval: 'moneyInterval',

  number: 'numero',

  select: 'selecao',
  selectSearch: 'selecaoBusca',

  textArea: 'areaTexto',
};

export const CREATE_FORM = (builder: FormBuilder) => {
  return builder.group({
    [CONTROL_NAMES.address]: null,
    [CONTROL_NAMES.contact]: null,

    [CONTROL_NAMES.date]: null,

    [CONTROL_NAMES.fieldInfo]: 'Valor fixo',

    [CONTROL_NAMES.dateInitial]: [null, Validators.required],
    [CONTROL_NAMES.dateFinal]: [null, Validators.required],

    [CONTROL_NAMES.input]: 'Valor default',
    [CONTROL_NAMES.inputFiel]: true,

    [CONTROL_NAMES.inputSearch]: builder.group({
      id: [null, Validators.required],
      descricao: null,
    }),
    [CONTROL_NAMES.inputSearchGroup]: builder.group({
      id: [null, Validators.required],
      codigo: null,
      descricao: null,
    }),

    [CONTROL_NAMES.moneyInitial]: null, // inicializando somente valor
    [CONTROL_NAMES.moneyFinal]: null, // inicializando valor e estado desabilitado

    [CONTROL_NAMES.number]: [null, Validators.required], // inicializando valor e validador

    [CONTROL_NAMES.select]: [null, Validators.required],
    [CONTROL_NAMES.selectSearch]: '',

    [CONTROL_NAMES.textArea]: new Array([]),
  });
};

export const GET_CONTROL = (controlName: string, fg: FormGroup) =>
  fg.get(controlName) as FormControl;

export const GET_GROUP = (controlName: string, fg: FormGroup) =>
  controlName ? (fg.get(controlName) as FormGroup) : (fg as FormGroup);

export const COMPONENTS_CONFIGS = (id: string, fg: FormGroup) => ({
  [CONTROL_NAMES.address]: null,
  [CONTROL_NAMES.contact]: null,

  [CONTROL_NAMES.date]: {
    id: `${id}__date`,
    dateType: DateTypeEnum.FullDate,
    control: GET_CONTROL(CONTROL_NAMES.date, fg),
    label: 'Date',
  } as TheosDate,

  [CONTROL_NAMES.fieldInfo]: {
    id: `${id}__field_info`,
    control: GET_CONTROL(CONTROL_NAMES.fieldInfo, fg),
    label: 'Field Info',
  } as TheosFieldInfo,

  [CONTROL_NAMES.dateInterval]: {
    id: `${id}__date_interval`,
    initial: {
      id: `${id}__date_initial`,
      dateType: DateTypeEnum.FullDate,
      control: GET_CONTROL(CONTROL_NAMES.dateInitial, fg),
      label: 'Date Initial',
    },
    final: {
      id: `${id}__date_final`,
      dateType: DateTypeEnum.FullDate,
      control: GET_CONTROL(CONTROL_NAMES.dateFinal, fg),
      label: 'Date Final',
    },
  } as TheosDateInterval,

  [CONTROL_NAMES.input]: {
    id: 'teste8',
    control: GET_CONTROL(CONTROL_NAMES.input, fg),
    label: 'Campo com uma label muito grande',
  },

  [CONTROL_NAMES.inputFiel]: null,

  [CONTROL_NAMES.inputSearch]: {
    dialogTitle: 'Busca de representante legal',
    endpoint: `https://{HOST}.theos.com.br/EclesialCoreContabil/api/v1/RepresentanteLegal`,
    filters: [
      {
        value: 1,
        label: 'Nome',
        field: 'nome',
        condition: Condition.text,
      },
      {
        value: 2,
        label: 'CPF',
        field: 'cpf',
        condition: Condition.numeric,
      },
      {
        value: 3,
        label: 'Função',
        field: 'funcao',
        condition: Condition.text,
      },
      {
        value: 4,
        label: 'Origem registro',
        field: 'origemRegistro',
        newCondition: {
          key: 'origemRegistro',
          options: [
            {
              value: 1,
              label: 'Representante Legal',
              default: true,
            },
            {
              value: 2,
              label: 'Responsável',
            },
          ],
        } as ConditionItem,
      },
    ],
    columns: [],
  } as any,
  [CONTROL_NAMES.inputSearchGroup]: { ...PLANO_CONTAS_CONTABIL_SEARCH_CONFIG },

  [CONTROL_NAMES.moneyInitial]: {} as TheosMoneyInterval,
  [CONTROL_NAMES.moneyFinal]: {} as TheosMoneyInterval,

  [CONTROL_NAMES.moneyInterval]: {
    id: `${id}__money_interval`,
    initial: {
      id: `${id}__money_initial`,
      inputType: InputType.money,
      control: GET_CONTROL(CONTROL_NAMES.moneyInitial, fg),
      label: 'Money Initial',
    },
    final: {
      id: `${id}__money_final`,
      inputType: InputType.money,
      control: GET_CONTROL(CONTROL_NAMES.moneyFinal, fg),
      label: 'Money Final',
    },
  } as TheosMoneyInterval,

  [CONTROL_NAMES.number]: {
    id: `${id}__number`,
    control: GET_CONTROL(CONTROL_NAMES.number, fg),
    label: 'Number',
    min: 1,
  } as TheosNumber,

  [CONTROL_NAMES.select]: {
    label: 'Select',
    control: GET_CONTROL(CONTROL_NAMES.select, fg),
    options: [
      { value: 1, label: 'test 1' },
      { value: 2, label: 'test 2' },
      { value: 3, label: 'test 3' },
      { value: 4, label: 'test 4' },
      { value: 5, label: 'test 5' },
      { value: 6, label: 'test 6' },
      { value: 7, label: 'test 7' },
      { value: 8, label: 'test 8' },
      { value: 9, label: 'test 9' },
      { value: 10, label: 'test 10' },
      { value: 11, label: 'test 11' },
      { value: 12, label: 'test 12' },
      { value: 13, label: 'test 13' },
      { value: 14, label: 'test 14' },
      { value: 15, label: 'test 15' },
      { value: 16, label: 'test 16' },
    ],
    nullOptionLabel: '-- selecione --',
    bypassColorizeOnValidation: false,
  } as TheosSelect,
  [CONTROL_NAMES.selectSearch]: {
    label: 'Select Search',
    options: [
      { value: 0, label: 'test 1' },
      { value: 1, label: 'test 2' },
      { value: 2, label: 'test 3' },
    ],
  },

  [CONTROL_NAMES.textArea]: null,
});
