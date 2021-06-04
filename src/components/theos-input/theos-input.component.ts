import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	ViewChild
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { REQUIRED_VALIDATION_NAMES } from '../_resources/common.constants';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';
import { DEFAULT_CONFIG, InputType } from './theos-input.constants';
import { TheosInput } from './theos-input.interface';

@Component({
  selector: 'theos-input',
  templateUrl: './theos-input.component.html',
  styleUrls: ['./theos-input.component.scss'],
})
export class TheosInputComponent implements AfterViewInit {
  @Input() config: TheosInput = DEFAULT_CONFIG;

  @ViewChild('thInput') inputRef: ElementRef;
  @ViewChild('thInputActions', { static: true }) inputActionsRef: ElementRef;

  private readonly _REQUIRED_VALIDATION_NAMES = REQUIRED_VALIDATION_NAMES;
  get isRequired() {
    if (!this.config?.control?.validator) return false;
    const VALIDATORS_IN_CONTROL = Object.keys(
      this.config.control.validator({} as AbstractControl) ?? {}
    );
    return VALIDATORS_IN_CONTROL.some((validatorInControl) =>
      this._REQUIRED_VALIDATION_NAMES.includes(validatorInControl)
    );
  }

  readonly PREFIX = THEOS_COMPONENTS_PREFIXES.input;
  readonly INPUT_TYPE = InputType;

  constructor() {}

  ngAfterViewInit(): void {
    const INPUT_ACTIONS_REF = this.inputActionsRef?.nativeElement;
    if (INPUT_ACTIONS_REF?.innerHTML) {
      const { clientWidth: WIDTH } = INPUT_ACTIONS_REF;
      const INPUT: HTMLInputElement = this.inputRef.nativeElement;
      INPUT.style.padding = `0 ${WIDTH + 24}px 0 12px`;
      const INPUT_LABEL = INPUT.nextElementSibling as HTMLLabelElement;
      INPUT_LABEL.style.maxWidth = `calc(100% - ${WIDTH + 28}px)`;
    }
  }

  isPlaceholderVisible = false;
  handleFocus() {
    if (this.inputRef) this.inputRef.nativeElement.placeholder = this.config.placeholder ?? '';
    this.isPlaceholderVisible = !!this.config.placeholder;
  }

  handleFocusOut() {
    if (this.inputRef) this.inputRef.nativeElement.placeholder = '';
    this.isPlaceholderVisible = false;
  }
}
