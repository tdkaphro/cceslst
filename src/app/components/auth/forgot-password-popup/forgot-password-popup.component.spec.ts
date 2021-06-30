import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordPopupComponent } from './forgot-password-popup.component';

describe('ForgotPasswordPopupComponent', () => {
  let component: ForgotPasswordPopupComponent;
  let fixture: ComponentFixture<ForgotPasswordPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
