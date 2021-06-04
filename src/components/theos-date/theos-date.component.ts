import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TheosCalendarComponent } from '../theos-calendar/theos-calendar.component';
import { REQUIRED_VALIDATION_NAMES } from '../_resources/common.constants';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';
import {
	CALENDAR_BUTTON_SIZE_CORRECTION,
	CALENDAR_HEIGHT,
	CALENDAR_WIDTH,

	DEFAULT_CONFIG
} from './theos-date.constants';
import { TheosDate } from './theos-date.interface';

@Component({
  selector: 'theos-date',
  templateUrl: './theos-date.component.html',
  styleUrls: ['./theos-date.component.scss'],
})
export class TheosDateComponent {
  @Input() config: TheosDate = DEFAULT_CONFIG;

  @ViewChild('thInputDate', { static: true }) inputRef: ElementRef;

  get isRequired() {
    if (!this.config?.control?.validator) return false;
    const VALIDATORS_IN_CONTROL = Object.keys(
      this.config.control.validator({} as AbstractControl) ?? {}
    );
    return VALIDATORS_IN_CONTROL.some((validatorInControl) =>
      REQUIRED_VALIDATION_NAMES.includes(validatorInControl)
    );
  }

  readonly PREFIX = THEOS_COMPONENTS_PREFIXES.date;

  constructor(private _dialog: MatDialog) {}

  blockEvent(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  isPlaceholderVisible = false;
  handleFocus() {
    this.inputRef.nativeElement.placeholder = this.config.placeholder ?? '';
    this.isPlaceholderVisible = !!this.config.placeholder;
  }
  handleFocusOut() {
    this.inputRef.nativeElement.placeholder = '';
    this.isPlaceholderVisible = false;
  }

  handleCalendarClick(e: MouseEvent) {
    const CALENDAR_POSITION = this._resolveDialogPosition(e);

    const CALENDAR_REF = this._dialog.open(TheosCalendarComponent, {
      width: `${CALENDAR_WIDTH}px`,
      height: `${CALENDAR_HEIGHT}px`,
      hasBackdrop: true,
      backdropClass: 'th-mat-dialog__transparent',
      panelClass: ['th-mat-dialog__no-padding', 'th-mat-dialog__no-overflow'],
      position: {
        left: CALENDAR_POSITION.left,
        top: CALENDAR_POSITION.top,
      },
      data: {
        currentDate: this.config.control.value,
        dateType: this.config.dateType,
      },
      autoFocus: false,
    });

    CALENDAR_REF.afterClosed().subscribe((selectedDate: string) => {
      if (!selectedDate) return;
      this.config.control.setValue(selectedDate);
      this.config.control.markAsTouched();
      this.config.control.markAsDirty();
    });
  }

  private _resolveDialogPosition(e: MouseEvent) {
    const { clientX: CLIENT_X, clientY: CLIENT_Y } = e;
    const { innerWidth: VIEW_WIDTH } = window;
    const { innerHeight: VIEW_HEIGHT } = window;

    const CORRECTION_CLIENT_X =
      CLIENT_X > VIEW_WIDTH / 2 ? CLIENT_X - CALENDAR_WIDTH : CLIENT_X;

    const CORRECTION_CLIENT_Y =
      CLIENT_Y > VIEW_HEIGHT / 2
        ? CLIENT_Y - CALENDAR_HEIGHT - CALENDAR_BUTTON_SIZE_CORRECTION
        : CLIENT_Y + CALENDAR_BUTTON_SIZE_CORRECTION;

    return {
      left: `${CORRECTION_CLIENT_X}px`,
      top: `${CORRECTION_CLIENT_Y}px`,
    };
  }
}
