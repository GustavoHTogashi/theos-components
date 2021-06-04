import { TheosSelectOption } from "../theos-select/theos-select.interface";


export class Condition {
  static text = 0;
  static numeric = 1;
  static money = 2;
  static date = 3;
  static textDate = 4;
  static bool = 5;
  static situation = 6;
  static situationReverse = 7;
}

export interface ConditionItem {
  key: string;
  options: TheosSelectOption[];
}

export class ConditionSearchList {
  private _conditions = {
    [Condition.text]: [
      { value: 0, label: 'Igual' },
      { value: 1, label: 'Contenha', default: true },
      { value: 2, label: 'Não contenha' },
      { value: 8, label: 'Comece com' },
      { value: 9, label: 'Termine com' },
    ] as TheosSelectOption[],
    [Condition.numeric]: [
      { value: 0, label: 'Igual', default: true },
      { value: 3, label: 'Maior ou igual' },
      { value: 4, label: 'Maior que' },
      { value: 5, label: 'Menor ou igual' },
      { value: 6, label: 'Menor que' },
      { value: 7, label: 'Entre' },
    ] as TheosSelectOption[],
    [Condition.money]: [
      { value: 0, label: 'Igual' },
      { value: 3, label: 'Maior ou igual', default: true },
      { value: 4, label: 'Maior que' },
      { value: 5, label: 'Menor ou igual' },
      { value: 6, label: 'Menor que' },
      { value: 7, label: 'Entre' },
    ] as TheosSelectOption[],
    [Condition.date]: [
      { value: 3, label: 'Maior ou igual', default: true },
      { value: 4, label: 'Maior que' },
      { value: 5, label: 'Menor ou igual' },
      { value: 6, label: 'Menor que' },
      { value: 7, label: 'Entre' },
    ] as TheosSelectOption[],
    [Condition.bool]: [
      { value: 0, label: 'Não', default: true },
      { value: 1, label: 'Sim' },
    ] as TheosSelectOption[],
    [Condition.situation]: [
      { value: 0, label: 'Inativo' },
      { value: 1, label: 'Ativo', default: true },
    ] as TheosSelectOption[],
    [Condition.situationReverse]: [
      { value: 0, label: 'Ativo' },
      { value: 1, label: 'Inativo', default: true },
    ] as TheosSelectOption[],
    [Condition.textDate]: [
      { value: 3, label: 'Maior ou igual', default: true },
      { value: 4, label: 'Maior que' },
      { value: 5, label: 'Menor ou igual' },
      { value: 6, label: 'Menor que' },
      { value: 7, label: 'Entre' },
    ] as TheosSelectOption[],
  };

  get(condition: Condition): TheosSelectOption[] {
    return this._conditions[condition as number];
  }

//   default(condition: Condition) {
//     return this._conditions[condition as number].find(
//       (condition) => condition.default
//     );
//   }

  add(item: ConditionItem): number {
    Condition[item.key] = Object.keys(Condition).length;
    this._conditions[Condition[item.key]] = item.options;
    return Condition[item.key];
  }
}
