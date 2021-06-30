import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraitementMessagesPopupComponent } from './traitement-messages-popup.component';

describe('TraitementMessagesPopupComponent', () => {
  let component: TraitementMessagesPopupComponent;
  let fixture: ComponentFixture<TraitementMessagesPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraitementMessagesPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraitementMessagesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
