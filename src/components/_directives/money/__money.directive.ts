import {
	AfterViewInit,
	Directive,
	ElementRef,
	EventEmitter,
	forwardRef,
	Input,
	OnInit,
	Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[money]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MoneyDirective),
      multi: true,
    },
  ],
})
export class MoneyDirective
  implements ControlValueAccessor, OnInit, AfterViewInit {
  private _input: HTMLInputElement = {} as HTMLInputElement;
  private _onTouched: any;
  private _onChange: any;
  private _isMouseDown = false;
  @Output() keypressed: EventEmitter<KeyboardEvent> = new EventEmitter();
  @Input() decimalDigits = 2;

  constructor(private _el: ElementRef) {}

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }
}
