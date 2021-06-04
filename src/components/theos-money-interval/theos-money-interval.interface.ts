import { TheosInput } from '../theos-input/theos-input.interface';

export interface TheosMoneyInterval {
  id: string;
  initial: TheosInput;
  final: TheosInput;
  bypassColorizeOnValidation?: boolean;
}
