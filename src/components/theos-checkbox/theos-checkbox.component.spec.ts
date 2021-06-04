import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheosCheckboxComponent } from './theos-checkbox.component';

describe('TheosCheckboxComponent', () => {
  let component: TheosCheckboxComponent;
  let fixture: ComponentFixture<TheosCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheosCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheosCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
