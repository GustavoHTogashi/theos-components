import { FormControl } from '@angular/forms';

export interface TheosNumber {
  id: string;
  control: FormControl;
  label: string;
  placeholder?: string;
  min?: number;
  max?: number;
  style?: { [klass: string]: any };
  bypassColorizeOnValidation?: boolean;
  tooltip?: { message: string; class: string };
}
