import {
	Component,
	ElementRef,
	Input,
	OnInit,
	TemplateRef,
	ViewChild
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fromEvent } from 'rxjs';
import { CONTROL_IS_REQUIRED } from '../_resources/common.constants';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';
import {
	DEFAULT_CONFIG,
	KEY_ARROW_DOWN,
	KEY_ARROW_UP,
	SELECT_DROPDOWN_HEIGHT,
	SELECT_HEIGHT
} from './theos-select.constants';
import { TheosSelect } from './theos-select.interface';

@Component({
  selector: 'theos-select',
  templateUrl: './theos-select.component.html',
  styleUrls: ['./theos-select.component.scss'],
})
export class TheosSelectComponent implements OnInit {
  @Input() config: TheosSelect = DEFAULT_CONFIG;

  @ViewChild('thSelectHidden', { static: true }) selectHiddenRef: ElementRef;
  @ViewChild('thSelect', { static: true }) selectRef: ElementRef;
  @ViewChild('thSelectDropdown')
  selectDropdownRef: ElementRef<HTMLDivElement>;
  @ViewChild('thSelectDropdownTemplate')
  thSelectDropdownTemplate: TemplateRef<any>;

  readonly PREFIX = THEOS_COMPONENTS_PREFIXES.select;

  constructor(private _matDialog: MatDialog) {}

  ngOnInit(): void {
    this.config.control.valueChanges.subscribe((value) => {
      console.log(this.config.control.valid);
      console.log(this.config.control.touched);
      console.log(this.config.control.dirty);
    });
  }

  get isRequired() {
    return CONTROL_IS_REQUIRED(this.config.control);
  }

  get currentOptionLabel() {
    return (
      this.config.options.find(
        (option) => option.value === this.config.control.value
      )?.label ?? ''
    );
  }

  get selectClasses() {

    let ngStates = [
      'invalid',
      'valid',
      'touched',
      'untouched',
      'dirty',
      'pristine',
    ];

    return ngStates.reduce((result, state) => {
      result[`ng-${state}`] = this.config.control[state];
      return result;
    }, {});

    // return {
    //   'ng-invalid': this.config.control.invalid,
    //   'ng-valid': this.config.control.valid,
    //   'ng-touched': this.config.control.touched,
    //   'ng-untouched': this.config.control.untouched,
    //   'ng-dirty': this.config.control.dirty,
    //   'ng-pristine': this.config.control.pristine,
    // };
  }

  handleSelectClick(e: Event) {
    this.blockEvent(e);
    this.config.control.markAsTouched();
    this.handleChevronDownClick();
  }

  private _selectDropdownDialogRef: MatDialogRef<TemplateRef<any>, any>;
  private _whichToFocus: ScrollTarget;
  handleChevronDownClick() {
    this.config.control.markAsTouched();
    const {
      width: WIDTH,
      left: LEFT,
      top: TOP,
    } = this.selectRef.nativeElement.getBoundingClientRect();

    // OPEN DROPDOWN
    this._selectDropdownDialogRef = this._matDialog.open(
      this.thSelectDropdownTemplate,
      {
        width: WIDTH,
        maxHeight: `${SELECT_DROPDOWN_HEIGHT}px`,
        hasBackdrop: true,
        backdropClass: 'th-mat-dialog__transparent',
        panelClass: ['th-mat-dialog__no-padding', 'th-mat-dialog__no-overflow'],
        position: {
          left: `${LEFT}px`,
          top: `${TOP + SELECT_HEIGHT}px`,
        },
      }
    );

    this._selectDropdownDialogRef.afterOpened().subscribe(() =>
      fromEvent(this.selectDropdownRef.nativeElement, 'scroll').subscribe(
        (e: Event) => {
          if (!this._whichToFocus) return;
          const TARGET = e.target as HTMLDivElement;
          const CHILDREN = TARGET.children;
          if (
            TARGET.scrollTop === 0 &&
            this._whichToFocus === ScrollTarget.first
          ) {
            const FIRST = CHILDREN[0];
            (FIRST as HTMLButtonElement).focus();
            this._whichToFocus = undefined;
            return;
          }
          if (
            TARGET.scrollTop === TARGET.scrollHeight - 200 &&
            this._whichToFocus === ScrollTarget.last
          ) {
            const LAST = CHILDREN[CHILDREN.length - 2];
            (LAST as HTMLButtonElement).focus();
            this._whichToFocus = undefined;
            return;
          }
        }
      )
    );

    this._selectDropdownDialogRef
      .beforeClosed()
      .subscribe(() => this.selectHiddenRef.nativeElement.focus());
  }

  handleOptionClick(value: string | number) {
    this.config.control.setValue(value);
    this.config.control.markAsDirty();
    this._selectDropdownDialogRef.close();
  }

  blockEvent(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleKeyDown(e: KeyboardEvent) {
    if ([KEY_ARROW_DOWN, KEY_ARROW_UP].indexOf(e.key) == -1) return;

    this.blockEvent(e);

    const { activeElement: ACTIVE_ELEMENT } = document;
    const { nativeElement: DROPDOWN } = this.selectDropdownRef;

    if (e.key === KEY_ARROW_DOWN) {
      const { nextElementSibling: NEXT } = ACTIVE_ELEMENT;
      if (NEXT && NEXT instanceof HTMLButtonElement)
        return (NEXT as HTMLButtonElement).focus();

      DROPDOWN.scroll({
        top: 0,
        behavior: 'smooth',
      });
      this._whichToFocus = ScrollTarget.first;
      return;
    }

    if (e.key === KEY_ARROW_UP) {
      const { previousElementSibling: PREVIOUS } = ACTIVE_ELEMENT;
      if (PREVIOUS && PREVIOUS instanceof HTMLButtonElement)
        return (PREVIOUS as HTMLButtonElement).focus();

      DROPDOWN.scroll({
        top: DROPDOWN.scrollHeight,
        behavior: 'smooth',
      });
      this._whichToFocus = ScrollTarget.last;
      return;
    }
  }
}

enum ScrollTarget {
  first = 'FIRST',
  last = 'LAST',
}
