import { FormControl } from '@angular/forms';
import { InputType } from '../theos-input/theos-input.constants';
import { TheosInput } from '../theos-input/theos-input.interface';
import { TheosMoneyInterval } from './theos-money-interval.interface';

export const DEFAULT_CONFIG: TheosMoneyInterval = {
  id: 'THMoneyInterval',
  initial: {
    id: 'inicial',
    control: new FormControl(null),
    label: 'Inicial',
    inputType: InputType.money,
  } as TheosInput,
  final: {
    id: 'final',
    control: new FormControl(null),
    label: 'Final',
    inputType: InputType.money,
  } as TheosInput,
};
