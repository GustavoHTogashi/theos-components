import { AbstractControl, ValidationErrors } from '@angular/forms';

export const THRequired = (msg: string) => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value || control.value === 0 ) return null;
    return { ThRequired: msg };
  };
};
