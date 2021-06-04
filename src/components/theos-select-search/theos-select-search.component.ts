import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostListener,
	Input,
	OnDestroy,
	OnInit,
	ViewChild
} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';
import {
	debounceTime,
	delay,
	distinctUntilChanged,
	map,
	takeUntil
} from 'rxjs/operators';
import { THEOS_COMPONENTS_PREFIXES } from '../_resources/theos-strings.res';

@Component({
  selector: 'theos-select-search',
  templateUrl: './theos-select-search.component.html',
  styleUrls: ['./theos-select-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheosSelectSearchComponent implements OnInit, OnDestroy {
  @Input() id = 'THSelectSearch';
  @Input() control: FormControl;

  @Input() label = `label goes here`;
  valueLabel: string | Array<String> = '';

  @Input() nullOptionName = '-- selecione --';
  @Input() nullable = false;

  private _options;

  @Input() set options(value: TheosSelectOption[]) {
    this._options = value;
    this.control?.setValue(this.control.value);
    this._cdr?.detectChanges();
  }

  get options() {
    return this._options;
  }

  @Input() multiSelect: boolean = false;

  @ViewChild('thSelect', { static: true }) select: ElementRef;
  @ViewChild('menuTrigger', { static: true }) matMenuTrigger: MatMenuTrigger;
  @ViewChild('thInputSearch') thInputSearch: ElementRef;
  @ViewChild('thInputFake') thInputFake: ElementRef;

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.matMenuTrigger.openMenu();
    }
  }

  applyFilter$: Subject<string> = new Subject<string>();
  filteredItems$: Subject<Array<TheosSelectOption>> = new Subject<
    Array<TheosSelectOption>
  >();

  readonly PREFIX = THEOS_COMPONENTS_PREFIXES.selectSearch;

  private readonly _COMPONENT_DESTROY$ = new Subject<void>();

  constructor(private _cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!this.control) {
      this.control = new FormControl(null);
      return;
    }

    this.applyFilter$
      .pipe(
        takeUntil(this._COMPONENT_DESTROY$),
        map((value) => (value ? value.trim() : value)),
        map((value) => value.toLowerCase()),
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((filter) => {
        const VALUES = (this.options || []).filter((option) =>
          option.label.toLowerCase().includes(filter)
        );
        this.filteredItems$.next(VALUES);
      });

    const CONTROL_VALUE_CHANGE = (changedValue) => {
      if (this.multiSelect) {
        const NEW_LABEL = this.options.reduce((prev, cur) => {
          if ((changedValue || []).includes(cur.value)) {
            prev.push(cur.label);
            this._cdr.detectChanges();
            return prev;
          }
          this._cdr.detectChanges();
          return prev;
        }, []);
        this.valueLabel = NEW_LABEL ?? '';
        this._cdr.detectChanges();
        return;
      }
      const OPTION = this.options?.find(
        (option) => option.value === changedValue
      );
      this.valueLabel = OPTION?.label ?? '';
      this._cdr.detectChanges();
    };

    this.control.statusChanges
      .pipe(takeUntil(this._COMPONENT_DESTROY$))
      .subscribe(() => {
        this._cdr.detectChanges();
      });

    this.control.valueChanges
      .pipe(takeUntil(this._COMPONENT_DESTROY$))
      .subscribe(CONTROL_VALUE_CHANGE);

    this.matMenuTrigger.menuOpened
      .pipe(takeUntil(this._COMPONENT_DESTROY$), delay(1))
      .subscribe(() => {
        this.thInputSearch.nativeElement.focus();
      });
    this.matMenuTrigger.menuClosed
      .pipe(takeUntil(this._COMPONENT_DESTROY$))
      .subscribe(() => {
        this.thInputFake.nativeElement.focus();
      });
  }

  ngOnDestroy(): void {
    this._COMPONENT_DESTROY$.next();
    this._COMPONENT_DESTROY$.complete();
  }

  selectOption(option: TheosSelectOption, event?: MouseEvent) {
    if (this.multiSelect) {
      if (event) event.stopPropagation();
      const VALUE = this.control.value ?? [];
      if (VALUE.includes(option.value)) {
        const FILTERED_VALUE = VALUE.filter((val: any) => val !== option.value);
        this.control.patchValue(
          FILTERED_VALUE.length === 0 ? null : FILTERED_VALUE
        );
      } else {
        this.control.patchValue([...VALUE, option.value]);
        this.control.markAsDirty();
      }
      return;
    }
    this.control.patchValue(option.value);
    this.control.markAsDirty();
  }

  selectAll(event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (!this.multiSelect) return;
    if (this.control.value?.length === this.options.length) this.clearControl();
    else {
      const VALUE = this.options.map((opt) => opt.value);
      this.control.patchValue(VALUE);
    }
  }

  clearControl() {
    if (this.control.disabled) return;
    this.control.patchValue(null);
  }

  get hasValue() {
    return (this.nullable && this.nullOptionName) ||
      this.control?.value ||
      this.control?.value === 0
      ? true
      : null;
  }

  get invalid() {
    return this.control?.invalid && this.control?.dirty;
  }

  get valid() {
    return this.control?.valid && this.control?.dirty;
  }

  get isRequired() {
    if (this.control.validator) {
      const VALIDATOR = this.control.validator({} as AbstractControl);
      if (VALIDATOR && (VALIDATOR.ThRequired || VALIDATOR.required))
        return true;
    }

    return false;
  }

  get disabled() {
    return this.control?.disabled;
  }
  getWidth(element: HTMLElement) {
    return `${element.clientWidth}px`;
  }
}

export interface TheosSelectOption {
  value: number;
  label: string;
  default?: boolean;
}
