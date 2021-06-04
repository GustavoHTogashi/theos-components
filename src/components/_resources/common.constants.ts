import { AbstractControl } from '@angular/forms';
import { pipe } from 'rxjs';
import { tap } from 'rxjs/operators';

export const REQUIRED_VALIDATION_NAMES = ['required', 'ThRequired'];

// GENERAL
export const CONTROL_IS_REQUIRED = (control: AbstractControl) => {
  if (!control?.validator) return false;

  return Object.keys(control.validator({} as AbstractControl) ?? {}).some(
    (validatorInControl) =>
      REQUIRED_VALIDATION_NAMES.includes(validatorInControl)
  );
};

// INTERVAL COMPONENTS
export const INTERVAL_INITIAL_STYLE = {
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
};
export const INTERVAL_FINAL_STYLE = {
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
};

export const INTERVAL_LIGATURE_IS_VALID = (controls: AbstractControl[]) => {
  const [INITIAL_CONTROL_VALID, FINAL_CONTROL_VALID] = controls.map(
    ({ valid, dirty }) => valid && dirty
  );
  return INITIAL_CONTROL_VALID || FINAL_CONTROL_VALID;
};

export const INTERVAL_LIGATURE_IS_INVALID = (controls: AbstractControl[]) => {
  const [INITIAL_CONTROL_INVALID, FINAL_CONTROL_INVALID] = controls.map(
    ({ invalid, dirty }) => invalid && dirty
  );
  return INITIAL_CONTROL_INVALID || FINAL_CONTROL_INVALID;
};

export const INTERVAL_LIGATURE_IS_DISABLED = (controls: AbstractControl[]) => {
  const [INITIAL_CONTROL_DISABLED, FINAL_CONTROL_DISABLED] = controls.map(
    ({ disabled }) => disabled
  );
  return INITIAL_CONTROL_DISABLED || FINAL_CONTROL_DISABLED;
};

export const INTERVAL_IS_EMPTY = (
  [initial, final]: AbstractControl[],
  type: string
) => {
  if (type === 'date') return !initial.value && !final.value;
  if (type === 'money') return initial.value == null && final.value == null;
};

export const INTERVAL_IS_VALID = (
  [initial, final]: AbstractControl[],
  type: string
) => {
  if (type === 'date')
    return Date.parse(initial.value) <= Date.parse(final.value);

  if (type === 'money')
    return (
      initial.value != null &&
      final.value != null &&
      initial.value <= final.value
    );
};

export const INTERVAL_SET_ERROR_ON_VALUE_CHANGE_PIPE = (
  controls: AbstractControl[],
  type: string
) =>
  pipe(
    tap({
      next: () => {
        controls.forEach((control) => {
          control?.markAsDirty();
        });

        if (INTERVAL_IS_EMPTY(controls, type)) {
          if (controls.every((control) => CONTROL_IS_REQUIRED(control))) return;
          return controls.forEach((control) => control?.setErrors(null));
        }

        if (INTERVAL_IS_VALID(controls, type))
          return controls.forEach((control) => control?.setErrors(null));

        controls.forEach((control) =>
          control?.setErrors({
            thError: 'Intervalo inválido',
            ...control?.errors,
          })
        );
      },

      error: () => {},
      complete: () => {},
    })
  );
