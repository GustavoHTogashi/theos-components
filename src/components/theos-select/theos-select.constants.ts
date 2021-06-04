import { FormControl } from '@angular/forms';
import { TheosSelect } from './theos-select.interface';

export const DEFAULT_CONFIG: TheosSelect = {
  id: 'THSelect',
  control: new FormControl(null),
  label: 'This is a label',
  options: [
    { value: 0, label: 'Option 0' },
    { value: 1, label: 'Option 1' },
    { value: 2, label: 'Option 2' },
  ],
};

export const SELECT_HEIGHT = 32;
export const SELECT_DROPDOWN_HEIGHT = 200;

export const KEY_ARROW_DOWN = 'ArrowDown';
export const KEY_ARROW_UP = 'ArrowUp';