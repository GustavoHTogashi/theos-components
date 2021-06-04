import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaskModule } from 'ngx-mask';
import { MoneyDirectiveModule } from 'src/components/_directives/money/money.directive.module';
import { TheosInputComponent } from './theos-input.component';
import { InputType } from './theos-input.constants';

fdescribe('TheosInputComponent', () => {
  let component: TheosInputComponent;
  let fixture: ComponentFixture<TheosInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TheosInputComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),

		MatTooltipModule,
        MoneyDirectiveModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheosInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('Deve criar um componente padrão', () => {
    expect(component).toBeTruthy();
    expect(component.config.id).toBe('THInput');
    expect(component.config.label).toBe('This is a label');
    expect(component.config.placeholder).toBe('');
    expect(component.config.control).toBeTruthy();
    expect(component.config.inputType).toBe(InputType.text);
    expect(component.inputRef).toBeTruthy();
  });

  it('Deve apresentar prefixo correto', () => {
    let prefix = 'ipt';
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

  it('Valida componente com conteúdo dinâmico', () => {
    fixture = TestBed.createComponent(TheosInputComponent);
    component = fixture.componentInstance;

    expect(component.inputActionsRef.nativeElement).toBeTruthy();

    const FAKE_SPAN = document.createElement('span');
    FAKE_SPAN.style.height = '20px';
    FAKE_SPAN.style.width = '20px';
    component.inputActionsRef.nativeElement.appendChild(FAKE_SPAN);
    fixture.detectChanges();

    expect(component.inputRef.nativeElement.style.padding).toBe(
      '0px 44px 0px 12px'
    );
    expect(
      component.inputRef.nativeElement.nextElementSibling.style.maxWidth
    ).toBe('calc(100% - 48px)');
  });
});
