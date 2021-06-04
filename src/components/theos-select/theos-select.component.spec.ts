import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeatherModule } from 'angular-feather';
import { ChevronDown } from 'angular-feather/icons';
import { TheosSelectComponent } from './theos-select.component';

fdescribe('TheosSelectComponent', () => {
  let component: TheosSelectComponent;
  let fixture: ComponentFixture<TheosSelectComponent>;

  const ICONS = {
    ChevronDown,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TheosSelectComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        FeatherModule.pick(ICONS),

        MatDialogModule,
        MatTooltipModule,

        BrowserAnimationsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheosSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('Deve criar um componente padrão', () => {
    expect(component).toBeTruthy();
    expect(component.config.id).toBe('THSelect');
    expect(component.config.control).toBeTruthy();
    expect(component.config.label).toBe('This is a label');
    expect(component.config.options).toHaveSize(3);
  });

  it('Deve apresentar prefixo correto', () => {
    let prefix = 'slct';
    expect(component.PREFIX).toBe(prefix);
    expect(component.selectRef.nativeElement.id).toContain(prefix);
  });

  it('Valida prop isRequired', () => {
    let requiredControl = new FormControl(null, Validators.required);
    expect(component.isRequired).toBe(false);

    component.config.control = requiredControl;
    expect(component.isRequired).toBe(true);
  });

  it('Valida prop currentOptionLabel', () => {
    component.config.control.setValue(2);
    fixture.detectChanges();

    expect(component.currentOptionLabel).toBe('Option 2');
  });

  it('Valida prop selectClasses', () => {
    let initialStateClasses = {
      'ng-invalid': false,
      'ng-valid': true,
      'ng-touched': false,
      'ng-untouched': true,
      'ng-dirty': false,
      'ng-pristine': true,
    };
    // expect(component.selectClasses).toEqual(initialStateClasses);

    let element = component.selectRef.nativeElement as HTMLDivElement;
    element.click();

    let touchedStateClasses = {
      'ng-invalid': false,
      'ng-valid': true,
      'ng-touched': true,
      'ng-untouched': false,
      'ng-dirty': false,
      'ng-pristine': true,
    };

    // expect(component.selectClasses).toEqual(touchedStateClasses);

    component.config.control.setValue(2);

    let dirtyStateClasses = {
      'ng-invalid': false,
      'ng-valid': true,
      'ng-touched': true,
      'ng-untouched': false,
      'ng-dirty': true,
      'ng-pristine': false,
    };

    // expect(component.selectClasses).toEqual(dirtyStateClasses);
  });

  it('Valida componente desabilitado', () => {
    expect(component.config.control.disabled).toBeFalse();

    component.config.control.disable();
    expect(component.config.control.disabled).toBeTrue();
  });

  it('Valida método handleSelectClick', () => {});

  it('Valida método handleOptionClick', () => {});

  it('Valida método handleKeyDown', () => {});
});
