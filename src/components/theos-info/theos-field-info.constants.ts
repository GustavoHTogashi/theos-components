import { FormControl } from '@angular/forms';
import { TheosFieldInfo } from './theos-field-info.interface';

export const DEFAULT_CONFIG: TheosFieldInfo = {
  id: 'THFieldInfo',
  control: new FormControl(null),
  label: 'Label',
};
