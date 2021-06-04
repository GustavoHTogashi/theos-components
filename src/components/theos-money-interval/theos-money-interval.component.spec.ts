import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { InputType } from '../theos-input/theos-input.constants';
import { TheosInputModule } from '../theos-input/theos-input.module';
import { TheosMoneyIntervalComponent } from './theos-money-interval.component';

fdescribe('TheosMoneyIntervalComponent', () => {
  let component: TheosMoneyIntervalComponent;
  let fixture: ComponentFixture<TheosMoneyIntervalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TheosMoneyIntervalComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,

        TheosInputModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheosMoneyIntervalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('Deve criar um componente padrão', () => {
    expect(component).toBeTruthy();
    expect(component.config.id).toBe('THMoneyInterval');

    expect(component.config.initial.id).toBe('inicial');
    expect(component.config.initial.control).toBeTruthy();
    expect(component.config.initial.label).toBe('Inicial');
    expect(component.config.initial.inputType).toBe(InputType.money);

    expect(component.config.final.id).toBe('final');
    expect(component.config.final.control).toBeTruthy();
    expect(component.config.final.label).toBe('Final');
    expect(component.config.final.inputType).toBe(InputType.money);
  });

  it('Deve apresentar prefixo correto', () => {
    let prefix = 'mon-intr';
    expect(component.PREFIX).toBe(prefix);
  });

  it('Valida as propriedades de ligature', () => {
    component.config.initial.control.setValue(120);
    expect(component.ligatureInvalid).toBeTrue();

    component.config.final.control.setValue(120);
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
