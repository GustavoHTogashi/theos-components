import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	TemplateRef,
	ViewChild
} from '@angular/core';
import {
	MatDialog,
	MatDialogConfig,
	MatDialogRef
} from '@angular/material/dialog';
import { TheosIconMenuConfig, TheosLabelMenuButtonsConfig } from '../theos-icon-menu/theos-icon-menu.constants';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';

@Component({
  selector: 'theos-button',
  templateUrl: './theos-button.component.html',
  styleUrls: ['./theos-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheosButtonComponent implements OnChanges, OnInit {
  @Input() id = 'THButton';
  @Input() disable = false;
  @Input() config: TheosButtonConfig;
  @Input() type: ButtonTypes = ButtonTypes.DEFAULT;
  @Output() buttonClick: EventEmitter<any> = new EventEmitter();

  prefix = THEOS_COMPONENTS_PREFIXES.button;
  buttonTypes = ButtonTypes;

  // Dropdown button properties
  @ViewChild('button', { read: ElementRef }) dropdownButton: ElementRef<
    HTMLButtonElement
  >;
  @ViewChild('labelMenu', { static: true }) labelMenu: TemplateRef<any>;
  private _labelMenuRef: MatDialogRef<any>;
  private _dropdownConfig: TheosIconMenuConfig;

  private readonly _OPTIONS_MARGIN = 8;

  constructor(private _cdr: ChangeDetectorRef, private _dialog: MatDialog) {}

  ngOnInit() {
    this._dropdownConfig =
      this.type === ButtonTypes.DROPDOWN ? this.dropdownConfig() : null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._cdr.detectChanges();
  }

  handleButtonClick(event: any) {
    if (!this.disable) this.buttonClick.emit(event);
  }

  // Dropdown button methods
  dropdownConfig() {
    return {
      buttonOptionSize: 7,
      buttonOptionStyle: {
        border: '1px solid #CBD5E0',
        backgroundColor: '#FFFFFF',
        color: '#718096',
      },
      menuLabelList: this.config.dropdown.menuLabelList,
    } as TheosIconMenuConfig;
  }

  handleOpenLabelMenu() {
    const POSITION = this._getLabelMenuPosition();
    this._labelMenuRef = this._dialog.open(this.labelMenu, {
      backdropClass: 'th-mat-dialog__transparent',
      panelClass: ['th-mat-dialog__no-padding'],
      position: {
        left: `${POSITION.left}px`,
        top: `${POSITION.top}px`,
      },
      width: `${
        this.dropdownButton.nativeElement.offsetWidth -
        this._dropdownConfig.buttonOptionSize
      }px`,
      data: this._dropdownConfig,
    } as MatDialogConfig<any>);
    return;
  }

  handleLabelMenuItemClick(item) {
    this._labelMenuRef.close();
    if (item.action instanceof Function) {
      item.action();
      return;
    }
  }

  private _getLabelMenuPosition(): { left: number; top: number } {
    const COORDINATES: DOMRect = this.dropdownButton.nativeElement.getBoundingClientRect();

    const POSITION = { left: 0, top: 0 };
    const CORRECTIONS = this._createLabelPositionCorrection();

    POSITION.left = COORDINATES.left + CORRECTIONS.left;
    POSITION.top = COORDINATES.top + CORRECTIONS.top;

    return POSITION;
  }

  private _createLabelPositionCorrection() {
    const RECT_CORRECTION = 2;
    const DEFAULT_LABEL_HEIGHT = 27;

    let widthCorrection = 0;
    let heightCorrection = 0;
    widthCorrection = this._dropdownConfig.buttonOptionSize + 2;
    heightCorrection = this.config.dropdown.menuPositionY === "top" ?
      0 - this.config.dropdown.menuLabelList.length * DEFAULT_LABEL_HEIGHT - this._OPTIONS_MARGIN - RECT_CORRECTION
      : 0 + this.dropdownButton.nativeElement.offsetHeight + this._OPTIONS_MARGIN;
    return {
      left: widthCorrection,
      top: heightCorrection,
    };
  }
}

export enum ButtonTypes {
  DROPDOWN,
  DEFAULT,
}
export interface TheosButtonConfig {
  background?: string;
  color?: string;
  icon?: string;
  iconRight?: string;
  label: string;
  tooltip?: string;
  height?: number;
  width?: number;
  border?: string;
  dropdown?: TheosButtonDropdownConfig;
}

export interface TheosButtonDropdownConfig {
  menuLabelList: TheosLabelMenuButtonsConfig[];
  menuDirection?: string;
  menuPositionX?: string;
  menuPositionY?: string;
}
