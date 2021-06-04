import { FormControl } from '@angular/forms';
import { DateTypeEnum } from 'src/components/_directives/date/date.directive.constants';

export interface TheosDate {
  id: string;
  control: FormControl;
  dateType: DateTypeEnum;
  label?: string;
  placeholder?: string;
  style?: { [key: string]: any };
  bypassColorizeOnValidation?: boolean;
  tooltip?: { message: string; class: string };
}
