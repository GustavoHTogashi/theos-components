import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { DateTypeEnum } from 'src/components/_directives/date/date.directive.constants';
import { TheosDateModule } from '../theos-date/theos-date.module';
import { TheosDateIntervalComponent } from './theos-date-interval.component';

fdescribe('TheosDateIntevalComponent', () => {
  let component: TheosDateIntervalComponent;
  let fixture: ComponentFixture<TheosDateIntervalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TheosDateIntervalComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,

        TheosDateModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheosDateIntervalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('Deve criar um componente padrão', () => {
    expect(component).toBeTruthy();
    expect(component.config.id).toBe('THDateInterval');

    expect(component.config.initial.id).toBe('inicial');
    expect(component.config.initial.control).toBeTruthy();
    expect(component.config.initial.label).toBe('Inicial');
    expect(component.config.initial.dateType).toBe(DateTypeEnum.FullDate);

    expect(component.config.final.id).toBe('final');
    expect(component.config.final.control).toBeTruthy();
    expect(component.config.final.label).toBe('Final');
    expect(component.config.final.dateType).toBe(DateTypeEnum.FullDate);
  });

  it('Deve apresentar prefixo correto', () => {
    let prefix = 'dt-intr';
    expect(component.PREFIX).toBe(prefix);
  });
  it('Valida as propriedades de ligature', () => {
    component.config.initial.control.setValue('1994-12-31');
    expect(component.ligatureInvalid).toBeTrue();

    component.config.final.control.setValue('1994-12-31');
    expect(component.ligatureValid).toBeTrue();

    component.config.initial.control.disable();
    component.config.final.control.disable();
    expect(component.ligatureDisabled).toBeTrue();

    component.config.bypassColorizeOnValidation = true;
    expect(component.ligatureBypassColorizeOnValidation).toBeTrue();
  });

  it('Valida componente desabilitado', () => {
    component.config.initial.control.disable();
    component.config.final.control.disable();

    expect(component.config.initial.control.disabled).toBeTrue();
    expect(component.config.final.control.disabled).toBeTrue();
  });
});
