import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeUtilisationComponent } from './mode-utilisation.component';

describe('ModeUtilisationComponent', () => {
  let component: ModeUtilisationComponent;
  let fixture: ComponentFixture<ModeUtilisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeUtilisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeUtilisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
