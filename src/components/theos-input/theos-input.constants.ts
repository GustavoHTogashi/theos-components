import { FormControl } from '@angular/forms';
import { TheosInput } from './theos-input.interface';

export enum InputType {
  text,
  money,
}

export const DEFAULT_CONFIG: TheosInput = {
  id: 'THInput',
  control: new FormControl(null),
  label: 'This is a label',
  placeholder: '',
  inputType: InputType.text,
};


