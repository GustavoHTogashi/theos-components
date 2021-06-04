import { FormControl } from '@angular/forms';

export interface TheosSelect {
  id: string;
  control: FormControl;
  label: string;
  options: TheosSelectOption[];
  nullOptionLabel?: string;

  style?: { [key: string]: any };
  bypassColorizeOnValidation?: boolean;
  tooltip?: { message: string; class: string };
}

export interface TheosSelectOption {
  value: number | string;
  label: string;
}
