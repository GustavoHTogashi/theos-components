import { FormControl, Validators } from '@angular/forms';
import { DateTypeEnum } from 'src/components/_directives/date/date.directive.constants';

export const DEFAULT_CONFIG = {
  id: 'THDateInterval',
  initial: {
    id: 'inicial',
    control: new FormControl(
      { value: null, disabled: false },
      Validators.required
    ),
    label: 'Inicial',
    dateType: DateTypeEnum.FullDate,
  },
  final: {
    id: 'final',
    control: new FormControl(
      { value: null, disabled: false },
      Validators.required
    ),
    label: 'Final',
    dateType: DateTypeEnum.FullDate,
  },
};
