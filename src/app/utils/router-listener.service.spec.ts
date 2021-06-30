import { TestBed } from '@angular/core/testing';

import { RouterListenerService } from './router-listener.service';

describe('RouterListenerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouterListenerService = TestBed.get(RouterListenerService);
    expect(service).toBeTruthy();
  });
});
