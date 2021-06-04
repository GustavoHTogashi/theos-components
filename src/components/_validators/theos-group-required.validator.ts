import { AbstractControl, ValidationErrors } from '@angular/forms';

export const THGroupRequired = (msg: string) => {
  return (group: AbstractControl): ValidationErrors | null => {
    const IS_GROUP_EMPTY = Object.keys(group.value).every(
      (key) => !group.value[key]
    );

    if (!IS_GROUP_EMPTY ) return null;
    return { thError: msg };
  };
};
