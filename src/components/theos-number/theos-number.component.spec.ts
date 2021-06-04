import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherModule } from 'angular-feather';
import { ChevronDown, ChevronUp } from 'angular-feather/icons';
import { NumberDirectiveModule } from '../_directives/number/number.module';
import { TheosNumberComponent } from './theos-number.component';

fdescribe('TheosNumberComponent', () => {
  let component: TheosNumberComponent;
  let fixture: ComponentFixture<TheosNumberComponent>;

  const ICONS = {
    ChevronUp,
    ChevronDown,
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TheosNumberComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        NumberDirectiveModule,

        MatTooltipModule,
        FeatherModule.pick(ICONS),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheosNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('Deve criar um componente padrão', () => {
    expect(component).toBeTruthy();
    expect(component.config.id).toBe('THNumber');
    expect(component.config.label).toBe('This is a label');
    expect(component.config.placeholder).toBe('');
    expect(component.config.control).toBeTruthy();
    expect(component.inputRef).toBeTruthy();
  });

  it('Deve apresentar prefixo correto', () => {
    let prefix = 'nmb';
    expect(component.PREFIX).toBe(prefix);
    expect(component.inputRef.nativeElement.id).toContain(prefix);
  });

  it('Valida Método HandleFocus', () => {
    let placeholderMock = 'This is a placeholder';
    component.config.placeholder = placeholderMock;

    let element = component.inputRef.nativeElement;
    element.dispatchEvent(new Event('focus'));

    expect(element.placeholder).toBe(placeholderMock);
    expect(component.isPlaceholderVisible).toBeTrue();
  });

  it('Valida Método HandleFocusOut', () => {
    let placeholderMock = 'This is a placeholder';
    component.config.placeholder = placeholderMock;

    let element: HTMLInputElement = component.inputRef.nativeElement;
    element.dispatchEvent(new Event('focus'));
    expect(element.placeholder).toBe(placeholderMock);

    component.config.control.setValue('');
    element.dispatchEvent(new Event('focusout'));

    expect(component.isPlaceholderVisible).toBeFalse();
    expect(component.config.control.value).toBe(0);
    expect(component.inputRef.nativeElement.value).toBe('0');
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

  it('Valida clique da seta para cima', () => {
    component.config.control.setValue(0);
	component.handleChevronUpClick();
    
    expect(component.config.control.value).toBe(1);
	expect(component.inputRef.nativeElement.value).toBe('1');

	component.config.control.setValue(Number.MAX_SAFE_INTEGER + 3);
	component.handleChevronDownClick();

	expect(component.config.control.value).toBe(Number.MAX_SAFE_INTEGER);
	expect(component.inputRef.nativeElement.value).toBe(`${Number.MAX_SAFE_INTEGER}`);
  });

  it('Valida clique da seta para baixo', () => {
    component.config.control.setValue(1);
	component.handleChevronDownClick();

    component.config.control.disable();
    expect(component.config.control.value).toBe(0);
	expect(component.inputRef.nativeElement.value).toBe('0');

	component.config.control.setValue(-1);
	component.handleChevronDownClick();

	expect(component.config.control.value).toBe(0);
	expect(component.inputRef.nativeElement.value).toBe('0');
  });
});
