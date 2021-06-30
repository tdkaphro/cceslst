import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupFeedbackComponent } from './popup-feedback.component';

describe('PopupFeedbackComponent', () => {
  let component: PopupFeedbackComponent;
  let fixture: ComponentFixture<PopupFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
