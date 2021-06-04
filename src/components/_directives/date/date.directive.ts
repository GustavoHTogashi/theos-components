import { DatePipe } from '@angular/common';
import {
	AfterViewInit,
	Directive,
	ElementRef,
	EventEmitter,
	forwardRef,
	HostListener,
	Input,
	OnInit,
	Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
	ACCEPTED_NUMBER_KEYS,
	DateTypeEnum,
	DEFAULT_DAY,
	DEFAULT_MAX_DAY,
	DEFAULT_MONTH,
	DEFAULT_YEAR,
	IDateProperty,
	IDateTypeProperty,
	MONTHS_PER_DAYS_MAPPING
} from './date.directive.constants';
@Directive({
  selector: 'input[date]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateDirective),
      multi: true,
    },
  ],
})
export class DateDirective implements ControlValueAccessor, OnInit, AfterViewInit {
  private _input: HTMLInputElement = {} as any;
  private _onTouched: any;
  private _onChange: any;
  private _isMouseDown = false;
  @Output() keypressed: EventEmitter<KeyboardEvent> = new EventEmitter();
  @Input() dateType: DateTypeEnum = DateTypeEnum.FullDate;
  private readonly _DATE_PROPERTIES: IDateTypeProperty = {
    [DateTypeEnum.FullDate]: {
      types: {
        day: {
          rangeStart: 0,
          rangeEnd: 2,
          length: 2,
          maxValue: 31,
          minValue: 1,
        },
        month: {
          rangeStart: 3,
          rangeEnd: 5,
          length: 2,
          maxValue: 12,
          minValue: 1,
        },
        year: {
          rangeStart: 6,
          rangeEnd: 10,
          length: 4,
          maxValue: 2100,
          minValue: DEFAULT_YEAR,
        },
      },
      mask: 'dd/mm/aaaa',
    },
    [DateTypeEnum.MonthAndYear]: {
      types: {
        month: {
          rangeStart: 0,
          rangeEnd: 2,
          length: 2,
          maxValue: 12,
          minValue: 1,
        },
        year: {
          rangeStart: 3,
          rangeEnd: 7,
          length: 4,
          maxValue: 2100,
          minValue: DEFAULT_YEAR,
        },
      },
      mask: 'mm/aaaa',
    },
    [DateTypeEnum.DayAndMonth]: {
      types: {
        day: {
          rangeStart: 0,
          rangeEnd: 2,
          length: 2,
          maxValue: 31,
          minValue: 1,
        },
        month: {
          rangeStart: 3,
          rangeEnd: 5,
          length: 2,
          maxValue: 12,
          minValue: 1,
        },
      },
      mask: 'dd/mm',
    },
    [DateTypeEnum.Year]: {
      types: {
        year: {
          rangeStart: 0,
          rangeEnd: 4,
          length: 4,
          maxValue: 2100,
          minValue: DEFAULT_YEAR,
        },
      },
      mask: 'aaaa',
    },
  };
  private _currentProperty = '';
  private _typedCharacters = 0;
  private _typedString = '';
  private _currentString = '';

  private _initialValue = '';
  private _isPristine = true;
  constructor(private _el: ElementRef) {}
  ngOnInit(): void {
    this._input = this._el.nativeElement;
    this._input.addEventListener('mouseup', (ev) => {
      this._isMouseDown = false;
      ev.preventDefault();
      return false;
    });
    this._input.addEventListener('mousedown', (ev) => {
      this._isMouseDown = true;
    });
    this._input.addEventListener('drop', (ev) => {
      ev.preventDefault();
      return false;
    });
  }

  ngAfterViewInit(): void {
    this._initialValue = this._input.value;
  }

  writeValue(value: any): void {
    switch (this.dateType) {
      case DateTypeEnum.FullDate: {
        const NEW_VALUE =
          value && value.substring(4, 5) === '-'
            ? new DatePipe('pt-BR').transform(value, 'dd/MM/yyyy')
            : value;
        this._input.value = NEW_VALUE;
        break;
      }
      case DateTypeEnum.MonthAndYear: {
        value =
          value && value.substring(4, 5) !== '-'
            ? value.split('/').shift().join('/')
            : value;
        const NEW_VALUE =
          value && value.substring(4, 5) === '-'
            ? new DatePipe('pt-BR').transform(value, 'MM/yyyy')
            : value;
        this._input.value = NEW_VALUE;
        break;
      }
      case DateTypeEnum.DayAndMonth: {
        value =
          value && value.substring(4, 5) !== '-'
            ? value.split('/').unshift().join('/')
            : value;
        const NEW_VALUE =
          value && value.substring(4, 5) === '-'
            ? new DatePipe('pt-BR').transform(value, 'dd/MM')
            : value;
        this._input.value = NEW_VALUE;
        break;
      }
      case DateTypeEnum.Year: {
        value =
          value && value.substring(4, 5) !== '-'
            ? value.split('/').unshift().join('/')
            : value;
        const NEW_VALUE =
          value && value.substring(4, 5) === '-'
            ? new DatePipe('pt-BR').transform(value, 'yyyy')
            : value;
        this._input.value = NEW_VALUE;
        break;
      }
    }
  }
  registerOnChange(fn: (value: any) => any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this._input.disabled = isDisabled;
  }
  @HostListener('change', ['$event'])
  onChange($event: any) {
    this._onChange();
  }

  @HostListener('focus', ['$event'])
  onFocus($event: FocusEvent) {
    this._onTouched();
    if (!this._input.value) {
      const MASK = this._DATE_PROPERTIES[this.dateType].mask;
      this._input.value = MASK;
    }
    if ($event.relatedTarget) {
      this._currentProperty = this._getDatePropertyKey(0);
      this._clearValuesOnNewProperty();
      this._selectInputRange();
    }
  }
  @HostListener('blur', ['$event'])
  onBlur($event: any) {
    const { value: VALUE } = this._input;
    if (VALUE === this._initialValue) return;
    if (
      VALUE === this._DATE_PROPERTIES[this.dateType].mask &&
      this._isPristine
    ) {
      this._input.value = null;
      return;
    }

    const DATE = this._convertDate(this._input.value);
    const VALID_DATE = !DATE.split('-').some(
      (d: string) => d === 'dd' || d === 'mm' || d === 'aaaa'
    );

    if (!VALID_DATE) {
      this._input.value = null;
      this._onChange(null);
      return;
    }

    this._triggerOnChange(DATE);
  }
  @HostListener('click', ['$event'])
  onClick($event: any) {
    this._currentProperty = this._getDatePropertyKey(
      this._input.selectionStart
    );
    this._clearValuesOnNewProperty();
    this._selectInputRange();
  }
  @HostListener('keydown', ['$event'])
  onKeyDown($event: KeyboardEvent) {
    if (this._isPristine) this._isPristine = false;

    if (this._input.selectionStart === this._input.selectionEnd) {
      this._currentProperty = this._getDatePropertyKey(0);
      this._clearValuesOnNewProperty();
      this._selectInputRange();
    }
    if ($event.key === 'Tab') {
      this._clearValuesOnNewProperty();
      if ($event.shiftKey) this._selectPreviousInputRange();
      else this._selectNextInputRange();
      $event.preventDefault();
      return;
    }
    if ($event.shiftKey) {
      $event.preventDefault();
      return;
    }
    switch ($event.key) {
      case 'ArrowLeft': {
        this._clearValuesOnNewProperty();
        this._selectPreviousInputRange();
        $event.preventDefault();
        break;
      }
      case 'ArrowRight': {
        this._clearValuesOnNewProperty();
        this._selectNextInputRange();
        $event.preventDefault();
        break;
      }
      case 'ArrowUp': {
        this._sumNumberOnRange(1);
        $event.preventDefault();
        break;
      }
      case 'ArrowDown': {
        this._sumNumberOnRange(-1);
        $event.preventDefault();
        break;
      }
      case 'Delete':
      case 'Backspace': {
        this._deleteFromRange();
        $event.preventDefault();
        break;
      }
    }
    if ($event.code === 'Space') {
      this.keypressed.emit($event);
      $event.preventDefault();
    }
    const KEY = Number.parseInt($event.key);
    if (KEY === NaN || !ACCEPTED_NUMBER_KEYS.some((key) => key === KEY)) {
      $event.preventDefault();
      return;
    }
  }
  @HostListener('keypress', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    const KEY = Number.parseInt($event.key);
    if (KEY === NaN || !ACCEPTED_NUMBER_KEYS.some((key) => key === KEY)) {
      $event.preventDefault();
      return;
    }
    this._selectInputRange();
    const PROPERTY = this._getDateProperty();
    this._typedCharacters++;
    this._typedString += `${KEY}`;
    this._currentString = this._composeText();
    this._addTextOnRange(this._currentString);
    if (this._typedCharacters === PROPERTY.length) {
      let actualMaxValue = this._getActualMaxValue(
        PROPERTY.maxValue.toString()
      );

      if (Number.parseInt(this._typedString) > +actualMaxValue)
        this._addTextOnRange(
          this._formatPadding(actualMaxValue, PROPERTY.length)
        );
      if (Number.parseInt(this._typedString) < PROPERTY.minValue)
        this._addTextOnRange(
          this._formatPadding(PROPERTY.minValue.toString(), PROPERTY.length)
        );
      this._selectNextInputRange();
      $event.preventDefault();
      return;
    }
    $event.preventDefault();
  }
  private _composeText() {
    const PROPERTY = this._getDateProperty();
    const TEXT = this._formatPadding(this._typedString, PROPERTY.length);
    return TEXT;
  }
  private _addTextOnRange(text: any) {
    this._input.setRangeText(text);
    const DATE = this._convertDate(this._input.value);
    this._triggerOnChange(DATE);
  }
  private _sumNumberOnRange(amount: any) {
    const PROPERTY = this._getDateProperty();
    const SUM = this._getRangeValue() + amount;
    var finalValue = this._formatPadding(SUM.toString(), PROPERTY.length);
    let actualMaxValue = this._getActualMaxValue(PROPERTY.maxValue.toString());
    if (SUM > actualMaxValue)
      finalValue = this._formatPadding(
        PROPERTY.minValue.toString(),
        PROPERTY.length
      );
    if (SUM < PROPERTY.minValue)
      finalValue = this._formatPadding(
        actualMaxValue.toString(),
        PROPERTY.length
      );
    this._addTextOnRange(finalValue);
  }
  private _deleteFromRange() {
    if (this._isMouseDown) return;
    const PROPERTY = this._getDateProperty();
    const TYPE = this._DATE_PROPERTIES[this.dateType];
    const MASK_FOR_PROPERTY = TYPE.mask.substring(
      PROPERTY.rangeStart,
      PROPERTY.rangeEnd
    );
    this._clearValuesOnNewProperty();
    this._addTextOnRange(MASK_FOR_PROPERTY);
  }
  private _formatPadding(text: any, amout: any) {
    return text.padStart(amout, '0');
  }
  private _selectInputRange() {
    const PROPERTY = this._getDateProperty();
    this._input.setSelectionRange(PROPERTY.rangeStart, PROPERTY.rangeEnd);
  }
  private _selectNextInputRange() {
    this._currentProperty = this._getNextPropertyKey();
    this._clearValuesOnNewProperty();
    this._selectInputRange();
  }
  private _selectPreviousInputRange() {
    this._currentProperty = this._getPreviousPropertyKey();
    this._clearValuesOnNewProperty();
    this._selectInputRange();
  }
  private _getDatePropertyKey(currentRangeSelection: any) {
    const [[PROPERTY]] = Object.entries(
      this._DATE_PROPERTIES[this.dateType].types
    ).filter((property) => {
      const [, RANGES] = property;
      return (
        (RANGES as IDateProperty).rangeStart <= currentRangeSelection &&
        (RANGES as IDateProperty).rangeEnd >= currentRangeSelection
      );
    });
    return PROPERTY;
  }
  private _getNextPropertyKey() {
    const PROPERTY_KEYS = Object.keys(
      this._DATE_PROPERTIES[this.dateType].types
    );
    const CURRENT_RANGE_INDEX = PROPERTY_KEYS.findIndex(
      (key) => key === this._currentProperty
    );
    return CURRENT_RANGE_INDEX + 1 > PROPERTY_KEYS.length - 1
      ? PROPERTY_KEYS[CURRENT_RANGE_INDEX]
      : PROPERTY_KEYS[CURRENT_RANGE_INDEX + 1];
  }
  private _getPreviousPropertyKey() {
    const PROPERTY_KEYS = Object.keys(
      this._DATE_PROPERTIES[this.dateType].types
    );
    const CURRENT_RANGE_INDEX = PROPERTY_KEYS.findIndex(
      (key) => key === this._currentProperty
    );
    return CURRENT_RANGE_INDEX - 1 < 0
      ? PROPERTY_KEYS[0]
      : PROPERTY_KEYS[CURRENT_RANGE_INDEX - 1];
  }
  private _getDateProperty(): IDateProperty {
    return this._DATE_PROPERTIES[this.dateType].types[this._currentProperty];
  }
  private _getRangeValue() {
    const PROPERTY = this._getDateProperty();
    const VALUE = this._input.value.substring(
      PROPERTY.rangeStart,
      PROPERTY.rangeEnd
    );
    return Number.parseInt(VALUE) || 0;
  }
  private _clearValuesOnNewProperty() {
    this._typedString = '';
    this._currentString = '';
    this._typedCharacters = 0;
  }
  private _convertDate(date) {
    return date.split('/').reverse().join('-');
  }
  private _triggerOnChange(date) {
    switch (this.dateType) {
      case DateTypeEnum.FullDate: {
        this._onChange(date);
        break;
      }
      case DateTypeEnum.MonthAndYear: {
        this._onChange(`${date}-${DEFAULT_DAY}`);
        break;
      }
      case DateTypeEnum.DayAndMonth: {
        this._onChange(`${DEFAULT_YEAR}-${date}`);
        break;
      }
      case DateTypeEnum.Year: {
        this._onChange(`${date}-${DEFAULT_MONTH}-${DEFAULT_DAY}`);
        break;
      }
    }
  }

  private _getActualMaxValue(actualMaxValue: string) {
    const PROPERTY_HAS_DAY_OR_MONTH =
      this.dateType === DateTypeEnum.FullDate ||
      this.dateType === DateTypeEnum.DayAndMonth;
    if (PROPERTY_HAS_DAY_OR_MONTH) {
      const TYPED_CHARACTER_IS_DAY = this._getDateProperty().rangeStart === 0;

      const MONTH_VAL = this._input.value.substring(3, 5);
      const MONTH_NUM = isNaN(+MONTH_VAL) ? 0 : +MONTH_VAL;

      const YEAR_VAL = this._input.value.substring(6, 10);
      const YEAR_NUM = isNaN(+YEAR_VAL) ? 0 : +YEAR_VAL;

      let [dayMaxValue] = MONTHS_PER_DAYS_MAPPING.find(
        (mapping) =>
          mapping.includes(MONTH_NUM) &&
          mapping[1] === this._isLeapYear(YEAR_NUM)
      ) ?? [DEFAULT_MAX_DAY];

      if (TYPED_CHARACTER_IS_DAY) actualMaxValue = dayMaxValue;
      const DAY_VAL = this._input.value.substring(0, 2);
      const DAY_NUM = isNaN(+DAY_VAL) ? 0 : +DAY_VAL;
      if (DAY_NUM > +dayMaxValue) this._input.setRangeText(dayMaxValue, 0, 2);

      return actualMaxValue;
    }

    return actualMaxValue;
  }
  private _isLeapYear(year: number) {
    const YEAR = isNaN(year) ? 0 : year;
    if (YEAR % 4 > 0) return false;
    if (YEAR % 100 > 0) return true;
    if (YEAR % 400 > 0) return false;
    return true;
  }
}
