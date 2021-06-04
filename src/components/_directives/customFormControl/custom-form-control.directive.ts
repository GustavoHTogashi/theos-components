import { Directive, ElementRef, forwardRef, Input } from '@angular/core';
import {
	ControlValueAccessor,
	FormControl,
	NG_VALUE_ACCESSOR
} from '@angular/forms';

@Directive({
  selector: 'div[customFormControl]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomFormControlDirective),
      multi: true,
    },
  ],
})
export class CustomFormControlDirective implements ControlValueAccessor {
  private _input: HTMLInputElement;
  private _onTouched: any;
  private _onChange: any;

  @Input() customControl: FormControl = new FormControl();

  constructor(private _el: ElementRef) {}

  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this._input.disabled = isDisabled;
  }
}
