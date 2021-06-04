import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherModule } from 'angular-feather';
import { Calendar } from 'angular-feather/icons';
import { DateTypeEnum } from 'src/components/_directives/date/date.directive.constants';
import { DateDirectiveModule } from 'src/components/_directives/date/date.directive.module';
import { TheosCalendarModule } from '../theos-calendar/theos-calendar.module';
import { TheosDateComponent } from './theos-date.component';

registerLocaleData(localePt, 'pt');

fdescribe('TheosDateComponent', () => {
  let component: TheosDateComponent;
  let fixture: ComponentFixture<TheosDateComponent>;

  const ICONS = {
    Calendar,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TheosDateComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatTooltipModule,
        FeatherModule.pick(ICONS),

        DateDirectiveModule,
        TheosCalendarModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheosDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('Deve criar um componente padrão', () => {
    expect(component).toBeTruthy();
    expect(component.config.id).toBe('THDate');
    expect(component.config.label).toBe('This is a label');
    expect(component.config.placeholder).toBe('');
    expect(component.config.dateType).toBe(DateTypeEnum.FullDate);
    expect(component.config.control).toBeTruthy();
    expect(component.inputRef).toBeTruthy();
  });

  it('Deve apresentar prefixo correto', () => {
    let prefix = 'dt';
    expect(component.PREFIX).toBe(prefix);
    expect(component.inputRef.nativeElement.id).toContain(prefix);
  });

  it('Valida método HandleFocus', () => {
    let placeholderMock = 'This is a placeholder';
    component.config.placeholder = placeholderMock;

    let element = component.inputRef.nativeElement;
    element.dispatchEvent(new Event('focus'));

    expect(element.placeholder).toBe(placeholderMock);
    expect(component.isPlaceholderVisible).toBeTrue();
  });

  it('Valida método HandleFocusOut', () => {
    let placeholderMock = 'This is a placeholder';
    component.config.placeholder = placeholderMock;

    let element: HTMLInputElement = component.inputRef.nativeElement;
    element.dispatchEvent(new Event('focus'));
    element.dispatchEvent(new Event('focusout'));

    expect(element.placeholder).toBe('');
    expect(component.isPlaceholderVisible).toBeFalse();
  });

  it('Valida prop isRequired', () => {
    let requiredControl = new FormControl(null, Validators.required);

    expect(component.isRequired).toBe(false);

    component.config.control = requiredControl;

    expect(component.isRequired).toBe(true);
  });

  it('Valida componente desabilitado', () => {
    expect(component.config.control.disabled).toBeFalse();

    component.config.control.disable();
    expect(component.config.control.disabled).toBeTrue();
  });

  it('Valida componente com dateType mês/ano', () => {
    component.config.dateType = DateTypeEnum.MonthAndYear;
    fixture.detectChanges();
    component.config.control.setValue('2020-02-29');

    let element: HTMLInputElement = component.inputRef.nativeElement;
    expect(element.value).toBe('02/2020');
  });

  it('Valida componente com dateType dia/mês', () => {
    component.config.dateType = DateTypeEnum.DayAndMonth;
    fixture.detectChanges();
    component.config.control.setValue('2020-02-29');

    let element: HTMLInputElement = component.inputRef.nativeElement;
    expect(element.value).toBe('29/02');
  });
  it('Valida componente com dateType ano', () => {
    component.config.dateType = DateTypeEnum.Year;
    fixture.detectChanges();
    component.config.control.setValue('2020-02-29');

    let element: HTMLInputElement = component.inputRef.nativeElement;
    expect(element.value).toBe('2020');
  });

  it('Valida se o evento da tecla espaço é bloqueado', () => {
	let blockEventSpy = spyOn(component, 'blockEvent');

	let element = component.inputRef.nativeElement as HTMLInputElement;
	let spaceKeyEvent = new KeyboardEvent('keydown', {key: ' '});
    element.dispatchEvent(spaceKeyEvent);

	expect(blockEventSpy).toHaveBeenCalled();
  });
});
