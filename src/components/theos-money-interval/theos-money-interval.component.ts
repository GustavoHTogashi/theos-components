import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import {
	INTERVAL_FINAL_STYLE,
	INTERVAL_INITIAL_STYLE,
	INTERVAL_LIGATURE_IS_DISABLED,
	INTERVAL_LIGATURE_IS_INVALID,
	INTERVAL_LIGATURE_IS_VALID,
	INTERVAL_SET_ERROR_ON_VALUE_CHANGE_PIPE
} from '../_resources/common.constants';
import {
	INTERVAL_LIGATURE_TEXT,
	THEOS_COMPONENTS_PREFIXES
} from '../_resources/theos-strings.res';
import { DEFAULT_CONFIG } from './theos-money-interval.constants';
import { TheosMoneyInterval } from './theos-money-interval.interface';

@Component({
  selector: 'theos-money-interval',
  templateUrl: './theos-money-interval.component.html',
  styleUrls: ['./theos-money-interval.component.scss'],
})
export class TheosMoneyIntervalComponent implements OnInit, AfterViewInit {
  @Input() config: TheosMoneyInterval = DEFAULT_CONFIG;

  get ligatureInvalid() {
    return INTERVAL_LIGATURE_IS_INVALID([
      this.config.initial.control,
      this.config.final.control,
    ]);
  }

  get ligatureValid() {
    return INTERVAL_LIGATURE_IS_VALID([
      this.config.initial.control,
      this.config.final.control,
    ]);
  }

  get ligatureDisabled() {
    return INTERVAL_LIGATURE_IS_DISABLED([
      this.config.initial.control,
      this.config.final.control,
    ]);
  }

  get ligatureBypassColorizeOnValidation() {
    return this.config.bypassColorizeOnValidation;
  }

  readonly PREFIX = THEOS_COMPONENTS_PREFIXES.moneyInterval;
  readonly LIGATURE_TEXT = INTERVAL_LIGATURE_TEXT;

  ngOnInit(): void {
    this.config.initial.style = {
      ...this.config.initial.style,
      ...INTERVAL_INITIAL_STYLE,
    };
    this.config.final.style = {
      ...this.config.final.style,
      ...INTERVAL_FINAL_STYLE,
    };
  }

  ngAfterViewInit(): void {
    this._setFormListeners();
  }

  private _setFormListeners() {
    [this.config.initial.control, this.config.final.control].forEach(
      (control) => {
        control.valueChanges
          .pipe(
            INTERVAL_SET_ERROR_ON_VALUE_CHANGE_PIPE(
              [this.config.initial.control, this.config.final.control],
              'money'
            )
          )
          .subscribe();
      }
    );
  }
}
