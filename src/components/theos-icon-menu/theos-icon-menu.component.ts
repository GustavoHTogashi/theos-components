import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';
import * as MenuConfig from './theos-icon-menu.constants';
@Component({
  selector: 'theos-icon-menu',
  templateUrl: './theos-icon-menu.component.html',
  styleUrls: ['./theos-icon-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheosIconMenuComponent implements OnInit {
  readonly PREFIX = THEOS_COMPONENTS_PREFIXES.iconMenu;

  private _menuConfig: MenuConfig.TheosIconMenuConfig;
  private _iconMenuRef: MatDialogRef<any>;
  private readonly _FIXED_PADDING = 18;

  @ViewChild('iconMenu', { static: true }) iconMenu: TemplateRef<any>;
  @ViewChild('iconMenuButton', { static: true }) iconMenuButton: ElementRef<
    HTMLButtonElement
  >;
  @ViewChild('labelMenu', { static: true }) labelMenu: TemplateRef<any>;
  private _labelMenuRef: MatDialogRef<any>;

  @Input() id = 'THIconMenu';
  @Input()
  set config(menuConfig: MenuConfig.TheosIconMenuConfig) {
    this._menuConfig = menuConfig;
  }
  get config() {
    return this._menuConfig;
  }
  @Input() menuDirection: 'row' | 'column' = 'column';
  @Input() menuPositionX: 'left' | 'right' = 'left';
  @Input() menuPositionY: 'top' | 'bottom' = 'bottom';

  constructor(private _dialog: MatDialog) {}

  ngOnInit(): void {
    if (!this.config)
      throw new Error(
        'Não foi informado nenhuma configuração para o menu, verificar a propriedade config do componente'
      );
  }

  handleOpenIconMenu() {
    const POSITION = this._getIconMenuPosition();
    if (!this._menuConfig.isMenuLabelOnly) {
      this._iconMenuRef = this._dialog.open(this.iconMenu, {
        backdropClass: 'th-mat-dialog__transparent',
        panelClass: ['th-mat-dialog__no-padding'],
        position: {
          left: `${POSITION.left}px`,
          top: `${POSITION.top}px`,
        },
        data: this._menuConfig,
      } as MatDialogConfig<any>);
      return;
    }
    this._labelMenuRef = this._dialog.open(this.labelMenu, {
      backdropClass: 'th-mat-dialog__transparent',
      panelClass: ['th-mat-dialog__no-padding'],
      position: {
        left: `${POSITION.left}px`,
        top: `${POSITION.top}px`,
      },
      data: this._menuConfig,
    } as MatDialogConfig<any>);
    return;
  }

  handleIconMenuAction(icon: MenuConfig.TheosIconMenuButtonsConfig) {
    this._iconMenuRef.close();
    if (icon.action instanceof Function) {
      icon.action(this.config);
      return;
    }
    throw new Error('A ACTION informada para o TheosIconMenu não é uma função');
  }
  handleLabelMenuItemClick(item) {
    this._labelMenuRef.close();
    if (item.action instanceof Function) {
      item.action();
      return;
    }
  }
  private _getIconMenuPosition(): { left: number; top: number } {
    const COORDINATES: DOMRect = this.iconMenuButton.nativeElement.getBoundingClientRect();

    const POSITION = { left: 0, top: 0 };
    const CORRECTIONS = this._menuConfig.isMenuLabelOnly
      ? this._createLabelPositionCorrection()
      : this._createIconPositionCorrection();

    POSITION.left = COORDINATES.left + CORRECTIONS.left;
    POSITION.top = COORDINATES.top + CORRECTIONS.top;

    return POSITION;
  }

  private _createIconPositionCorrection() {
    let widthCorrection = 0;
    let heightCorrection = 0;

    if (this.menuDirection === 'row') {
      const MENU_HEIGHT = this.config.menuIconsSize;

      widthCorrection =
        this.menuPositionX === 'left'
          ? -this.iconMenuSize + MENU_HEIGHT / 2
          : MENU_HEIGHT / 2;
      heightCorrection =
        this.menuPositionY === 'top'
          ? -(MENU_HEIGHT + MENU_HEIGHT / 3)
          : MENU_HEIGHT - MENU_HEIGHT / 2;
    } else {
      const MENU_WIDTH = this.config.menuIconsSize;

      widthCorrection =
        this.menuPositionX === 'left'
          ? -(MENU_WIDTH + MENU_WIDTH / 3)
          : MENU_WIDTH / 2;
      heightCorrection =
        this.menuPositionY === 'top'
          ? -this.iconMenuSize + MENU_WIDTH / 2
          : MENU_WIDTH / 2;
    }

    return {
      left: widthCorrection,
      top: heightCorrection,
    };
  }

  private _createLabelPositionCorrection() {
    let widthCorrection = 0;
    let heightCorrection = 0;
    widthCorrection = this._menuConfig.buttonOptionSize + 2;
    heightCorrection = 0;
    return {
      left: widthCorrection,
      top: heightCorrection,
    };
  }
  get iconMenuSize() {
    const SIZE =
      (this._menuConfig.menuIconsSize + this._FIXED_PADDING) *
      this._menuConfig.menuIconsList.length;
    return SIZE;
  }
  get labelMenuSize() {
    const SIZE =
      (this._menuConfig.menuLabelSize / this._menuConfig.menuLabelList.length -
        1 +
        this._FIXED_PADDING) *
        this._menuConfig.menuLabelList.length -
      1;
    return SIZE;
  }

  get iconMenuButtonStyles() {
    return {
      width: `${this.config.buttonOptionSize}px`,
      height: `${this.config.buttonOptionSize}px`,
      ...this.config.buttonOptionStyle,
    };
  }

  get iconMenuClasses() {
    return this.menuDirection === 'row'
      ? 'icon-menu__row'
      : 'icon-menu__column';
  }

  get iconMenuStyles() {
    const SIZE_WITH_PADDING = this.config.menuIconsSize + this._FIXED_PADDING;
    const GRID_TEMPLATE_COLUMNS =
      this.menuDirection === 'row'
        ? `repeat(${this.config.menuIconsList.length}, ${SIZE_WITH_PADDING}px)`
        : `${SIZE_WITH_PADDING}px`;
    const GRID_TEMPLATE_ROWS =
      this.menuDirection === 'row'
        ? `${SIZE_WITH_PADDING}px`
        : `repeat(${this.config.menuIconsList.length}, ${SIZE_WITH_PADDING}px)`;

    return {
      'grid-template-columns': GRID_TEMPLATE_COLUMNS,
      'grid-template-rows': GRID_TEMPLATE_ROWS,
    };
  }

  get itemButtonIconStyles() {
    return {
      width: `${this.config.menuIconsSize}px`,
      height: `${this.config.menuIconsSize}px`,
    };
  }
}
