import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import { testProviders } from '../../testing/test-helpers';

describe('AuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [AuthInterceptor, ...testProviders()]
  }));

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
