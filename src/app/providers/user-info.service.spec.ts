import { TestBed } from '@angular/core/testing';

import { UserInfoService } from './user-info.service';
import { testProviders } from '../../testing/test-helpers';

describe('UserInfoService', () => {
  let service: UserInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: testProviders() });
    service = TestBed.inject(UserInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
