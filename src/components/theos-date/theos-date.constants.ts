import { FormControl } from '@angular/forms';
import { DateTypeEnum } from 'src/components/_directives/date/date.directive.constants';
import { TheosDate } from './theos-date.interface';

export const DEFAULT_CONFIG: TheosDate = {
  id: 'THDate',
  control: new FormControl(null),
  label: 'This is a label',
  placeholder: '',
  dateType: DateTypeEnum.FullDate,
  bypassColorizeOnValidation: false,
};

export const CONTROL_NOT_FOUND = (prefix) =>
  `${prefix} => Não foi informado corretamente o control, verifique a config que foi passada para o componente <theos-date>`;

export const CALENDAR_WIDTH = 296;
export const CALENDAR_HEIGHT = 312;
export const CALENDAR_BUTTON_SIZE_CORRECTION = 32;
