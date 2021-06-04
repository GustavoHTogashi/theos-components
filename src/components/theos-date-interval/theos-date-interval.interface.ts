import { TheosDate } from '../theos-date/theos-date.interface';

export interface TheosDateInterval {
  id: string;
  initial: TheosDate;
  final: TheosDate;
  bypassColorizeOnValidation?: boolean;
  test: string;
}
