import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'theos-text-area',
  templateUrl: './theos-text-area.component.html',
  styleUrls: ['./theos-text-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheosTextAreaComponent implements OnInit, OnDestroy {
  @Input() id = 'THTextarea';
  @Input() control: FormControl;
  @Input() label = `Label`;
  @Input() placeholder = '';
  @Input() style = {};

  @Input() maxLength = 1000;
  @Input() maxRows = 3;

  @ViewChild('thTextarea', { static: true }) textarea: ElementRef;
  @ViewChild('content', { static: true }) dynamicContent: ElementRef;

  readonly PREFIX = THEOS_COMPONENTS_PREFIXES.textArea;

  private readonly _COMPONENT_DESTROY$ = new Subject<void>();

  constructor(private _cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.dynamicContent.nativeElement.innerHTML)
      this.textarea.nativeElement.style.paddingRight = '48px';

    if (this.control) {
      this.control.statusChanges
        .pipe(takeUntil(this._COMPONENT_DESTROY$))
        .subscribe(() => {
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

  handleFocus() {
    this.textarea.nativeElement.placeholder = this.placeholder;
  }

  handleFocusOut() {
    this.textarea.nativeElement.placeholder = ``;
  }

  get hasValue() {
    return this.control?.value ? true : null;
  }

  get invalid() {
    return this.control?.invalid && this.control?.dirty;
  }

  get valid() {
    return this.control?.valid && this.control?.dirty;
  }

  get isRequired() {
    if (this.control.validator) {
      const VALIDATOR = this.control.validator({} as AbstractControl);
      if (VALIDATOR && (VALIDATOR.ThRequired || VALIDATOR.required))
        return true;
    }

    return false;
  }
}
