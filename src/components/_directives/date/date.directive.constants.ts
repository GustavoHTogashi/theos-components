export enum DateTypeEnum {
  FullDate,
  MonthAndYear,
  DayAndMonth,
  Year,
}
export interface IDateTypeProperty {
  [DateTypeEnum.FullDate]: {
    types: IDateTypes;
    mask: string;
  };
  [DateTypeEnum.MonthAndYear]: {
    types: IDateTypes;
    mask: string;
  };
  [DateTypeEnum.DayAndMonth]: {
    types: IDateTypes;
    mask: string;
  };
  [DateTypeEnum.Year]: {
    types: IDateTypes;
    mask: string;
  };
}
export interface IDateTypes {
  day?: IDateProperty;
  month?: IDateProperty;
  year?: IDateProperty;
}
export interface IDateProperty {
  rangeStart: number;
  rangeEnd: number;
  length: number;
  maxValue: number;
  minValue: number;
}

export const ACCEPTED_NUMBER_KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

export const DEFAULT_DAY = '01';
export const DEFAULT_MAX_DAY = '31';
export const DEFAULT_MONTH = '01';
export const DEFAULT_YEAR = 1500;

export const MONTHS_PER_DAYS_MAPPING = [
  ['28', false, 2],
  ['29', true, 2],
  ['30', false, 4, 6, 9, 11],
  ['30', true, 4, 6, 9, 11],
  [DEFAULT_MAX_DAY, false, 0, 1, 3, 5, 7, 8, 10, 12],
  [DEFAULT_MAX_DAY, true, 0, 1, 3, 5, 7, 8, 10, 12],
] as [string, boolean, number][];
