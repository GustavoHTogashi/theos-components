import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheosIconMenuComponent } from './theos-icon-menu.component';

describe('TheosIconMenuComponent', () => {
  let component: TheosIconMenuComponent;
  let fixture: ComponentFixture<TheosIconMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheosIconMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheosIconMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
