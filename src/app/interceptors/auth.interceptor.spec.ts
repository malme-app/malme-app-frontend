import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AccountInfo, InteractionStatus } from '@azure/msal-browser';
import { of, throwError } from 'rxjs';

import { AuthInterceptor, httpInterceptorProviders } from './auth.interceptor';
import {
  MsalBroadcastServiceStub,
  MsalServiceStub,
  testProviders
} from '../../testing/test-helpers';
import { tokenKey } from '../providers/user-info.service';
import { environment } from 'src/environments/environment';

describe('AuthInterceptor', () => {
  const account = { homeAccountId: 'home', username: 'user@example.com' } as AccountInfo;
  const apiUrl = `${environment.apiBaseUrl}/sale/active`;

  let http: HttpClient;
  let httpMock: HttpTestingController;
  let msal: MsalServiceStub;
  let broadcast: MsalBroadcastServiceStub;

  beforeEach(() => {
    localStorage.removeItem(tokenKey);
    TestBed.configureTestingModule({
      providers: [AuthInterceptor, ...testProviders(), httpInterceptorProviders]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    msal = TestBed.inject(MsalService) as unknown as MsalServiceStub;
    broadcast = TestBed.inject(MsalBroadcastService) as unknown as MsalBroadcastServiceStub;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem(tokenKey);
  });

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('holds API calls until MSAL is done, then sends a freshly acquired token', () => {
    broadcast.inProgress$.next(InteractionStatus.HandleRedirect);
    msal.accounts = [account];
    msal.acquireTokenSilentResult = of({ accessToken: 'fresh-token' });
    localStorage.setItem(tokenKey, 'stale-token');

    http.get(apiUrl).subscribe();
    httpMock.expectNone(apiUrl);

    broadcast.inProgress$.next(InteractionStatus.None);
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.headers.get('Authorization')).toBe('Bearer fresh-token');
    expect(msal.activeAccount).toBe(account);
    req.flush([]);
  });

  it('falls back to the stored token when silent acquisition fails', () => {
    msal.accounts = [account];
    msal.acquireTokenSilentResult = throwError(() => new Error('interaction_required'));
    localStorage.setItem(tokenKey, 'stored-token');

    http.get(apiUrl).subscribe();

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.headers.get('Authorization')).toBe('Bearer stored-token');
    req.flush([]);
  });

  it('sends without a token and does not call MSAL when nobody is signed in', () => {
    http.get(apiUrl).subscribe();

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    expect(msal.acquireTokenSilent).not.toHaveBeenCalled();
    req.flush([]);
  });

  it('never attaches the token to other origins', () => {
    msal.accounts = [account];
    msal.acquireTokenSilentResult = of({ accessToken: 'fresh-token' });
    const external = 'https://example.com/data.json';

    http.get(external).subscribe();

    const req = httpMock.expectOne(external);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    expect(msal.acquireTokenSilent).not.toHaveBeenCalled();
    req.flush({});
  });

  it('does not attach the token to a path that only shares the API prefix', () => {
    msal.accounts = [account];
    msal.acquireTokenSilentResult = of({ accessToken: 'fresh-token' });
    const lookalike = `${environment.apiBaseUrl}-admin/users`;

    http.get(lookalike).subscribe();

    const req = httpMock.expectOne(lookalike);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    expect(msal.acquireTokenSilent).not.toHaveBeenCalled();
    req.flush({});
  });
});
