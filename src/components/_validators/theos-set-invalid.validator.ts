import { AbstractControl, ValidationErrors } from '@angular/forms';

export const THSetInvalid = (msg: string) => {
  return (): ValidationErrors | null => {
    return { thError: msg };
  };
};
