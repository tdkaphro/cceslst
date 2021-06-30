import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoPlayerComponent } from './photo-player.component';

describe('PhotoPlayerComponent', () => {
  let component: PhotoPlayerComponent;
  let fixture: ComponentFixture<PhotoPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
