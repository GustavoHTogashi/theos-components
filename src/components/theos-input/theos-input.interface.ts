import { FormControl } from '@angular/forms';
import { InputType } from './theos-input.constants';

export interface TheosInput {
  id: string;
  control: FormControl;
  label: string;
  placeholder?: string;
  inputType?: InputType;
  maxLength?: number;
  ngxMask?: {
    mask: string;
    [key: string]: any;
  };
  style?: { [key: string]: any };
  bypassColorizeOnValidation?: boolean;
  tooltip?: { message: string; class: string };
  test: string;
}
