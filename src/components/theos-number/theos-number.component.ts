import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	ViewChild
} from '@angular/core';
import { CONTROL_IS_REQUIRED } from '../_resources/common.constants';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';
import { DEFAULT_CONFIG } from './theos-number.constants';
import { TheosNumber } from './theos-number.interface';

@Component({
  selector: 'theos-number',
  templateUrl: './theos-number.component.html',
  styleUrls: ['./theos-number.component.scss'],
})
export class TheosNumberComponent {
  @Input() config: TheosNumber = DEFAULT_CONFIG;

  @Output() focusOut: EventEmitter<void> = new EventEmitter();

  @ViewChild('thNumber', { static: true }) inputRef: ElementRef;

  get isRequired() {
    return CONTROL_IS_REQUIRED(this.config.control);
  }

  readonly PREFIX = THEOS_COMPONENTS_PREFIXES.number;

  isPlaceholderVisible = false;
  handleFocus() {
    this.inputRef.nativeElement.placeholder = this.config.placeholder ?? '';
    this.isPlaceholderVisible = !!this.config.placeholder;
  }

  handleFocusOut() {
    this.inputRef.nativeElement.placeholder = '';
    this.isPlaceholderVisible = false;
    const { value: VALUE } = this.config.control;
    if (VALUE != null) this.addNumber(0, true);
    this.focusOut.emit(VALUE);
  }

  handleChevronUpClick() {
    this.addNumber(1, true);
  }

  handleChevronDownClick() {
    this.addNumber(-1, true);
  }

  addNumber(number: number, validMin = false) {
    const { value: NUMBER_INPUT } = this.config.control;
    const NEW_NUMBER = number + (+NUMBER_INPUT || 0);
    this.setNumber(NEW_NUMBER, validMin);
  }

  setNumber(number: number, validMin = false) {
    const MAX = this.config.max ?? Number.MAX_SAFE_INTEGER;

    if (validMin && number < this.config.min) number = this.config.min;
    if (number > MAX) number = MAX;
    this.config.control.setValue(number);
    this.config.control.markAsTouched();
    this.config.control.markAsDirty();
  }
}
