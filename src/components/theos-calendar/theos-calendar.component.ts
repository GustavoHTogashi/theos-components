import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as Moment from 'moment';
import {
    DateTypeEnum,
    DEFAULT_DAY,
    DEFAULT_MONTH, DEFAULT_YEAR
} from 'src/components/_directives/date/date.directive.constants';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';

@Component({
  selector: 'theos-calendar',
  templateUrl: './theos-calendar.component.html',
  styleUrls: ['./theos-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheosCalendarComponent implements OnInit {
  @Input() locale = navigator.language.toLowerCase();

  @ViewChild('daysCalendar', { static: true }) daysCalendar: ElementRef;
  @ViewChild('monthCalendar', { static: true }) monthCalendar: ElementRef;
  @ViewChild('yearCalendar', { static: true }) yearCalendar: ElementRef;
  @ViewChild('thCalendar', { static: true }) calendar: ElementRef;

  cType = CalendarType;

  days = [];
  months = [];
  years = [];
  weekDays = [];

  periodMonth = ``;
  periodYears = ``;
  periodYear = ``;

  dateType = DateTypeEnum.FullDate;
  DateTypeEnum = DateTypeEnum;
  currentDate = '';
  selectedDate: string;

  prefix = THEOS_COMPONENTS_PREFIXES.calendar;

  private _selectedDay: number;
  private _selectedMonth: number;
  private _selectedYear: number;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { currentDate: string; dateType: DateTypeEnum },
    private _dialogRef: MatDialogRef<TheosCalendarComponent>
  ) {}

  ngOnInit(): void {
    this.dateType = this.data?.dateType;
    switch (this.dateType) {
      case DateTypeEnum.FullDate: {
        this.yearCalendar.nativeElement.style.display = D_NONE;
        this.daysCalendar.nativeElement.style.display = D_BLOCK;
        this.monthCalendar.nativeElement.style.display = D_NONE;
        break;
      }
      case DateTypeEnum.MonthAndYear: {
        this.yearCalendar.nativeElement.style.display = D_NONE;
        this.daysCalendar.nativeElement.style.display = D_NONE;
        this.monthCalendar.nativeElement.style.display = D_BLOCK;
        break;
      }
      case DateTypeEnum.DayAndMonth: {
        this.yearCalendar.nativeElement.style.display = D_NONE;
        this.daysCalendar.nativeElement.style.display = D_NONE;
        this.monthCalendar.nativeElement.style.display = D_BLOCK;
        break;
      }
      case DateTypeEnum.Year: {
        this.yearCalendar.nativeElement.style.display = D_BLOCK;
        this.daysCalendar.nativeElement.style.display = D_NONE;
        this.monthCalendar.nativeElement.style.display = D_NONE;
        break;
      }
    }

    this.currentDate = this.data?.currentDate
      ? this.data?.currentDate
      : Moment().format(DATE_FORMAT) ?? Moment().format(DATE_FORMAT);

    const [DAY, MONTH, YEAR] = this.currentDate
      .split('-')
      .reverse()
      .map((date) => Number.parseInt(date));

    this._selectedDay = Moment(this.currentDate).date() || DAY;
    this._selectedMonth = Moment(this.currentDate).month() || MONTH - 1;
    this._selectedYear = Moment(this.currentDate).year() || YEAR;

    this.weekDays = Array.apply(null, Array(7)).map((_: number, i: number) =>
      Moment().locale(this.locale).weekday(i).format('ddd')
    );

    this.months = Array.apply(null, Array(12)).map((_: number, i: number) =>
      Moment().locale(this.locale).month(i).format('MMM')
    );

    this.years = this._getYears();

    this.days = this._getDays();

    if (
      this.dateType === DateTypeEnum.MonthAndYear ||
      this.dateType === DateTypeEnum.DayAndMonth
    ) {
      this._updatePeriods(CalendarType.month);
    }
    if (this.dateType === DateTypeEnum.Year) {
      this._updatePeriods(CalendarType.year);
    }
    this._updatePeriods(CalendarType.day);
  }

  handleSelector(c: CalendarType) {
    switch (c) {
      case CalendarType.day:
        if (this.dateType === DateTypeEnum.DayAndMonth) {
          this._updatePeriods(CalendarType.month);
          this._openMonthCalendar();
          break;
        }
        this._updatePeriods(CalendarType.year);
        this._openYearCalendar();
        break;
      case CalendarType.month:
        if (this.dateType === DateTypeEnum.MonthAndYear) {
          this._updatePeriods(CalendarType.year);
          this._openYearCalendar();
          break;
        }
        this._updatePeriods(CalendarType.day);
        this._openDayCalendar();
        break;
      case CalendarType.year:
        if (this.dateType === DateTypeEnum.MonthAndYear) {
          this._updatePeriods(CalendarType.month);
          this._openMonthCalendar();
          break;
        }
        if (this.dateType === DateTypeEnum.Year) {
          this._updatePeriods(CalendarType.year);
          break;
        }

        this._updatePeriods(CalendarType.day);
        this._openDayCalendar();
        break;
    }
  }

  handleNext(c: CalendarType) {
    switch (c) {
      case CalendarType.day:
        if (this._selectedMonth < 12) {
          this._selectedMonth++;
        }

        if (this._selectedMonth >= 12) {
          this._selectedYear++;
          this._selectedMonth = 0;
        }

        this.days = this._getDays();
        this._updatePeriods(CalendarType.day);
        break;
      case CalendarType.month:
        this._selectedYear++;
        this._updatePeriods(CalendarType.month);
        break;
      case CalendarType.year:
        this.years = this._getNextYears(this.years[this.years.length - 1]);
        this.periodYears = `${this.years[0]} - ${
          this.years[this.years.length - 1]
        }`;
        break;
    }
  }

  handlePrevious(c: CalendarType) {
    switch (c) {
      case CalendarType.day:
        if (this._selectedMonth >= 0) {
          this._selectedMonth--;
        }

        if (this._selectedMonth < 0) {
          this._selectedYear--;
          this._selectedMonth = 11;
        }

        this.days = this._getDays();
        this._updatePeriods(CalendarType.day);
        break;
      case CalendarType.month:
        this._selectedYear--;
        this._updatePeriods(CalendarType.month);
        break;
      case CalendarType.year:
        this.years = this._getPreviousYears(this.years[0]);
        this.periodYears = `${this.years[0]} - ${
          this.years[this.years.length - 1]
        }`;
        break;
    }
  }

  handleSelectedDay(d: number) {
    this._selectedDay = d;
    const CURRENT = Moment().set({
      year:
        this.dateType === DateTypeEnum.DayAndMonth
          ? DEFAULT_YEAR
          : this._selectedYear,
      month: this._selectedMonth,
      date: this._selectedDay,
    });

    this._updatePeriods(CalendarType.day);

    const DATE = `${CURRENT.format('YYYY-MM-DD')}`;

    this.selectedDate = DATE;
    this._dialogRef.close(DATE);
  }

  handleSelectedMonth(m: number) {
    this._selectedMonth = m;
    if (this.dateType === DateTypeEnum.MonthAndYear) {
      const YEAR = Moment().year(this._selectedYear).format('YYYY');
      const MONTH = Moment()
        .locale(this.locale)
        .month(this._selectedMonth)
        .format('MM');
      const DAY = DEFAULT_DAY;
      const DATE = `${YEAR}-${MONTH}-${DAY}`;
      this.selectedDate = DATE;
      this._dialogRef.close(DATE);
      return;
    }
    this._updatePeriods(CalendarType.day);
    this._openDayCalendar();
  }

  handleSelectedYear(y: number) {
    this._selectedYear = y;
    if (this.dateType === DateTypeEnum.Year) {
      const YEAR = Moment().year(this._selectedYear).format('YYYY');
      const MONTH = DEFAULT_MONTH;
      const DAY = DEFAULT_DAY;
      const DATE = `${YEAR}-${MONTH}-${DAY}`;
      this.selectedDate = DATE;
      this._dialogRef.close(DATE);
    }

    this._updatePeriods(CalendarType.month);
    this._openMonthCalendar();
  }

  private _getDays() {
    const MAX_DAYS = Moment()
      .year(this._selectedYear)
      .month(this._selectedMonth)
      .daysInMonth();

    const SKIPPED_START = Moment()
      .year(this._selectedYear)
      .month(this._selectedMonth)
      .startOf('month')
      .day();
    const SKIPPED_END = 42 - MAX_DAYS - SKIPPED_START;

    const DAYS = Array.apply(
      null,
      Array(MAX_DAYS)
    ).map((_: number, i: number) => ({ day: i + 1, disabled: false }));

    const MAX_DAYS_PREV_MONTH = Moment()
      .year(this._selectedYear)
      .month(this._selectedMonth - 1)
      .daysInMonth();

    const EMPTY_START = Array.apply(null, Array(SKIPPED_START))
      .map((_: number, i: number) => ({
        day: MAX_DAYS_PREV_MONTH - i,
        disabled: true,
      }))
      .reverse();

    const EMPTY_END = Array.apply(
      null,
      Array(SKIPPED_END)
    ).map((_: number, i: number) => ({ day: i + 1, disabled: true }));

    return [...EMPTY_START, ...DAYS, ...EMPTY_END];
  }

  private _getYears(baseYear: number = Moment().year()): number[] {
    const START_YEAR = Moment().year(baseYear).subtract(4, 'years').year();

    return Array.apply(null, Array(24)).map(
      (_: number, i: number) => START_YEAR + i
    );
  }

  private _getNextYears(baseYear: number = Moment().year()): number[] {
    const START_YEAR = Moment().year(baseYear).add(1, 'years').year();

    return Array.apply(null, Array(24)).map(
      (_: number, i: number) => START_YEAR + i
    );
  }

  private _getPreviousYears(baseYear: number = Moment().year()): number[] {
    const START_YEAR = Moment().year(baseYear).subtract(24, 'years').year();

    return Array.apply(null, Array(24)).map(
      (_: number, i: number) => START_YEAR + i
    );
  }

  private _openDayCalendar() {
    this.days = this._getDays();
    this.daysCalendar.nativeElement.style.display = D_BLOCK;
    this.monthCalendar.nativeElement.style.display = D_NONE;
    this.yearCalendar.nativeElement.style.display = D_NONE;
  }

  private _openYearCalendar() {
    this.years = this._getYears(this._selectedYear);
    this.daysCalendar.nativeElement.style.display = D_NONE;
    this.monthCalendar.nativeElement.style.display = D_NONE;
    this.yearCalendar.nativeElement.style.display = D_BLOCK;
  }

  private _openMonthCalendar() {
    this.daysCalendar.nativeElement.style.display = D_NONE;
    this.monthCalendar.nativeElement.style.display = D_BLOCK;
    this.yearCalendar.nativeElement.style.display = D_NONE;
  }

  private _updatePeriods(cType: CalendarType) {
    switch (cType) {
      case CalendarType.day:
        const MONTH = Moment()
          .locale(this.locale)
          .month(this._selectedMonth)
          .format('MMM');
        this.periodMonth = `${MONTH} ${
          this.dateType === DateTypeEnum.DayAndMonth ? '' : this._selectedYear
        }`;
        break;
      case CalendarType.month:
        this.periodYear = `${this._selectedYear}`;
        break;
      case CalendarType.year:
        this.periodYears = `${this._selectedYear - 4} - ${
          this._selectedYear + 19
        }`;
        break;
    }
  }

  get sDay() {
    return this._selectedDay;
  }

  get sMonth() {
    return Moment()
      .locale(this.locale)
      .month(this._selectedMonth)
      .format('MMM')
      .toLowerCase();
  }

  get sYear() {
    return this._selectedYear;
  }

  get cDay() {
    if (this._selectedYear !== Moment().year()) {
      return -1;
    }

    if (this._selectedMonth !== Moment().month()) {
      return -1;
    }

    return Moment().date();
  }

  get cMonth() {
    if (this._selectedYear !== Moment().year()) {
      return -1;
    }

    return Moment().month();
  }

  get cYear() {
    return Moment().year();
  }
}

enum CalendarType {
  day,
  month,
  year,
}

const DATE_FORMAT = `YYYY-MM-DD`;

const D_NONE = 'none';
const D_BLOCK = 'block';
