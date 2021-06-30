import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraitementDetailsComponent } from './traitement-details.component';

describe('TraitementDetailsComponent', () => {
  let component: TraitementDetailsComponent;
  let fixture: ComponentFixture<TraitementDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraitementDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraitementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
