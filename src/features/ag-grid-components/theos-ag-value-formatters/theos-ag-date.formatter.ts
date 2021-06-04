import { DatePipe } from '@angular/common';
import { DateTypeEnum } from 'src/components/_directives/date/date.directive.constants';

export const DATE_VALUE_FORMATTER = (params: any) => {
  const TYPE = params?.colDef?.valueFormatterParams ?? DateTypeEnum.FullDate;
  return params.value && params.value.substring(4, 5) === '-'
    ? FORMATTERS[TYPE](params.value)
    : params.value;
};

// INCOMING PATTERN NEEDS TO BE YYYY-MM-DD
const DATE_PIPE = new DatePipe('pt-BR');
const FORMATTERS = {
  [DateTypeEnum.FullDate]: (v: string) => DATE_PIPE.transform(v, 'dd/MM/yyyy'),
  [DateTypeEnum.MonthAndYear]: (v: string) => DATE_PIPE.transform(v, 'MM/yyyy'),
  [DateTypeEnum.DayAndMonth]: (v: string) => DATE_PIPE.transform(v, 'dd/MM'),
};
