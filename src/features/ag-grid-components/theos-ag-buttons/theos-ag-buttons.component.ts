import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { THEOS_AG_COMPONENTS_PREFIXES } from '../theos-ag-resources/theos-ag-prefixes.res';
import { TheosAgButtons } from './theos-ag-buttons.interface';

@Component({
  selector: 'theos-ag-buttons',
  templateUrl: './theos-ag-buttons.component.html',
  styleUrls: ['./theos-ag-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheosAgButtonsComponent implements ICellRendererAngularComp {
  buttons: TheosAgButtons[] = [];

  readonly PREFIX = THEOS_AG_COMPONENTS_PREFIXES.genericIcons;

  private _params: ICellRendererParams;

  refresh(): boolean {
    return false;
  }

  agInit(params: ICellRendererParams): void {
    this._params = params;

    const { buttons: BUTTONS } = params as any;

    if (!Array.isArray(BUTTONS) || !BUTTONS.length)
      throw Error('Não foi passado os botões para serem renderizados');

    this.buttons = BUTTONS;
  }

  handleClick(methodName: string) {
    const { componentParent: COMPONENT_PARENT_INSTANCE } = this._params.context;
    if (!COMPONENT_PARENT_INSTANCE)
      throw Error(
        'Verifique se na propriedade gridOptions do seu componente, for fornecido a propriedade context'
      );

    if (!COMPONENT_PARENT_INSTANCE[methodName])
      throw Error(
        'Verifique se na propriedade gridOptions do seu componente, for fornecido um método válido para a propriedade methodName'
      );

    COMPONENT_PARENT_INSTANCE[methodName](this._params.rowIndex);
  }
}
