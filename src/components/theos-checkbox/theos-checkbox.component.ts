import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { noop, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { status } from '../_enum/control-status';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';

@Component({
  selector: 'theos-checkbox',
  templateUrl: './theos-checkbox.component.html',
  styleUrls: ['./theos-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheosCheckboxComponent implements OnInit, OnDestroy {
  @Input() id = 'THCheckbox';
  @Input() control: FormControl;

  @Input() label = `Label`;

  @Input() nullable = false;
  @Input() reverse = false;
  @Input() multiLine = false;

  @Input() style = { 'min-width': '18px', 'min-height': '18px' };

  @Input() tooltipMessage = '';
  @Input() tooltipIcon = 'help-circle';

  @ViewChild('thCheckbox', { static: true }) checkbox: ElementRef<
    HTMLInputElement
  >;
  @ViewChild('thInputField', { static: true }) inputField: ElementRef;

  readonly PREFIX = THEOS_COMPONENTS_PREFIXES.checkbox;

  private _checkbox: HTMLInputElement;
  private _inputField: HTMLSpanElement;
  private _checkState = checkState.unchecked;

  private readonly _COMPONENT_DESTROY$ = new Subject<void>();

  @Output() clicked: EventEmitter<boolean> = new EventEmitter();

  constructor(private _cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this._checkbox = this.checkbox.nativeElement;
    this._inputField = this.inputField.nativeElement;

    if (this.control) {
      this.control.disabled ? this._STATUS_CHANGE[status.disabled]() : noop();
      this._valueChange(this.control.value);

      this.control.valueChanges
        .pipe(takeUntil(this._COMPONENT_DESTROY$))
        .subscribe((value) => {
          this._valueChange(value);
        });

      this.control.statusChanges
        .pipe(takeUntil(this._COMPONENT_DESTROY$))
        .subscribe((status) => {
          this._STATUS_CHANGE[status]();
          this._cdr.markForCheck();
        });

      return;
    }

    this.control = new FormControl('');
  }

  ngOnDestroy(): void {
    this._COMPONENT_DESTROY$.next();
    this._COMPONENT_DESTROY$.complete();
  }

  handleClick() {
    this._checkState = this._checkState === 0 ? 1 : 0;
    this._CHECK_INPUT[this._checkState]();
    this.clicked.emit(this.control.value);
  }

  handleNullableClick() {
    this._checkState < 2 ? this._checkState++ : (this._checkState = 0);
    this._CHECK_INPUT[this._checkState]();
    this.clicked.emit(this.control.value);
  }

  private readonly _TOGGLE_CLASS = {
    [checkState.unchecked]: () => {
      this._checkbox.classList.remove('checked');
      this._checkbox.classList.remove('half-checked');
      this._cdr.markForCheck();
    },
    [checkState.checked]: () => {
      this._checkbox.classList.remove('half-checked');
      this._checkbox.classList.add('checked');
      this._cdr.markForCheck();
    },
    [checkState.halfchecked]: () => {
      this._checkbox.classList.remove('checked');
      this._checkbox.classList.add('half-checked');
      this._cdr.markForCheck();
    },
  };

  private readonly _CHECK_INPUT = {
    [checkState.unchecked]: () => {
      this._TOGGLE_CLASS[checkState.unchecked]();
      this.control.setValue(false);
    },
    [checkState.checked]: () => {
      this._TOGGLE_CLASS[checkState.checked]();
      this.control.setValue(true);
    },
    [checkState.halfchecked]: () => {
      this._TOGGLE_CLASS[checkState.halfchecked]();
      this.control.setValue(null);
    },
  };

  private readonly _STATUS_CHANGE = {
    [status.disabled]: () => {
      this._addDisabled();
    },
    [status.invalid]: () => {
      this._removeDisabled();
    },
    [status.valid]: () => {
      this._removeDisabled();
    },
  };

  private _valueChange(value: boolean | null) {
    switch (value) {
      case true:
        this._checkState = checkState.checked;
        this._TOGGLE_CLASS[checkState.checked]();
        break;
      case false:
        this._checkState = checkState.unchecked;
        this._TOGGLE_CLASS[checkState.unchecked]();
        break;
      default:
        if (!this.nullable) return;
        this._checkState = checkState.halfchecked;
        this._TOGGLE_CLASS[checkState.halfchecked]();
        break;
    }
    this._cdr.markForCheck();
  }

  private _addDisabled() {
    if (this._inputField.classList.contains('disabled')) return;

    this._inputField.classList.add('disabled');
    return;
  }

  private _removeDisabled() {
    if (!this._inputField.classList.contains('disabled')) return;

    this._inputField.classList.remove('disabled');
    return;
  }
}

enum checkState {
  unchecked,
  checked,
  halfchecked,
}
