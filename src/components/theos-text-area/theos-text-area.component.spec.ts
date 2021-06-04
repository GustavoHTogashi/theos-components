import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheosTextAreaComponent } from './theos-text-area.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

describe('Teste do componente -> TheosTextArea', () => {
  let component: TheosTextAreaComponent;
  let fixture: ComponentFixture<TheosTextAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TheosTextAreaComponent],
      imports: [CommonModule, ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheosTextAreaComponent);
    component = fixture.componentInstance;
  });

  it('Deve criar o componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('Validar valores padrão', () => {
    fixture.detectChanges();
    expect(component.id).toBe('THTextarea');
    expect(component.maxLength).toBe(1000);
    expect(component.maxRows).toBe(3);
    expect(component.textarea).toBeTruthy();
  });

  it('Deve criar um FormControl, caso não tenha sido informado algum', () => {
    fixture.detectChanges();
    expect(component.control).toBeTruthy();
    expect(component.control.value).toBe('');
    expect(component.control.valid).toBe(true);
  });

  it('Valida funcionamento do conteúdo dinâmico', () => {
    component.dynamicContent.nativeElement.appendChild(
      document.createElement('span')
    );
    fixture.detectChanges();
    expect(component.dynamicContent).toBeTruthy();
    expect(component.textarea.nativeElement.style.paddingRight).toBe('44px');
  });

  it('Valida funcionamento do placeholder', () => {
    const PLACE = 'PLACEHOLDER XPTO';
    component.placeholder = PLACE;
    fixture.detectChanges();

    component.textarea.nativeElement.focus();
    fixture.detectChanges();
    expect(component.textarea.nativeElement.placeholder).toBe(PLACE);

    component.textarea.nativeElement.blur();
    fixture.detectChanges();
    expect(component.textarea.nativeElement.placeholder).toBe('');
  });
});
