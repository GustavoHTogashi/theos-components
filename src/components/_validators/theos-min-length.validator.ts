import { AbstractControl, ValidationErrors } from '@angular/forms';

export const THMinLength = (length: number, msg: string) => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    if (control.value.length < length) return { thError: msg };
    return null;
  };
};
