import { Directive, ElementRef, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[number]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberDirective),
      multi: true,
    },
  ],
})
export class NumberDirective implements ControlValueAccessor {
  private _onTouched: any;
  private _onChange: any;

  constructor(private _el: ElementRef<HTMLInputElement>) {}

  writeValue(value: any): void {
    this._el.nativeElement.value = value;
  }
  registerOnChange(fn: (value: any) => any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this._el.nativeElement.disabled = isDisabled;
  }

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    return this._resolveInput(event);
  }

  private _resolveInput(event: InputEvent) {
    let { data, inputType } = event;

    if (inputType === 'insertFromPaste') {
      const NUMERIC_DATA =
        data?.normalize('NFD').replace(/(?![\u0030-\u0039])./g, '') ?? '';
      this._el.nativeElement.value = NUMERIC_DATA;
      this._onChange(+NUMERIC_DATA);
      return;
    }

    if (!data || data.length > 1) {
      this._onChange(+this._el.nativeElement.value);
      return;
    }

    if (+this._el.nativeElement.value > Number.MAX_SAFE_INTEGER) {
      this._onChange(Number.MAX_SAFE_INTEGER);
      return;
    }

    const NON_NUMERIC_DATA = data
      .normalize('NFD')
      .replace(/[\u0030-\u0039]/g, '');

    if (NON_NUMERIC_DATA.length) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const TYPED_CHARACTERS = this._el.nativeElement.value.split('');
      TYPED_CHARACTERS.pop();
      const CLEANED_TYPED_CHARACTERS = TYPED_CHARACTERS.join('');
      this._el.nativeElement.value = CLEANED_TYPED_CHARACTERS;
      this._onChange(+CLEANED_TYPED_CHARACTERS);
      return;
    }

    this._onChange(+this._el.nativeElement.value);
    return;
  }

  @HostListener('blur', ['$event'])
  onBlur() {
    if(this._onTouched) this._onTouched();
  }
}
