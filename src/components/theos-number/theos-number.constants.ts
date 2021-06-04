import { FormControl } from '@angular/forms';
import { TheosNumber } from './theos-number.interface';

export const DEFAULT_CONFIG: TheosNumber = {
  id: 'THNumber',
  control: new FormControl(null),
  label: 'This is a label',
  placeholder: '',
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
};
