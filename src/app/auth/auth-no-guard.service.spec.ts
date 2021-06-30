import { TestBed } from '@angular/core/testing';

import { AuthNoGuardService } from './auth-no-guard.service';

describe('AuthNoGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthNoGuardService = TestBed.get(AuthNoGuardService);
    expect(service).toBeTruthy();
  });
});
