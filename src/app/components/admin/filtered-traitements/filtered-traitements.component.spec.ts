import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredTraitementsComponent } from './filtered-traitements.component';

describe('FilteredTraitementsComponent', () => {
  let component: FilteredTraitementsComponent;
  let fixture: ComponentFixture<FilteredTraitementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilteredTraitementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteredTraitementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
