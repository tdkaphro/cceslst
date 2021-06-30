import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoReaderComponent } from './video-reader.component';

describe('VideoReaderComponent', () => {
  let component: VideoReaderComponent;
  let fixture: ComponentFixture<VideoReaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoReaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
