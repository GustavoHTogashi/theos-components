import { FormControl } from '@angular/forms';

export interface TheosFieldInfo {
  id: string;
  control: FormControl;
  label: string;
  style?: { [klass: string]: any };
  tooltip?: { message: string; class: string };
}
