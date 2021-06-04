import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ECLESIAL_VALIDATORS_MESSAGES } from '../_resources/theos-strings.res';

export const THDateInvalid = (inputRef: HTMLInputElement) => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value && inputRef?.validity.badInput)
      return { thError: ECLESIAL_VALIDATORS_MESSAGES.dateInvalid() };
    return null;
  };
};
