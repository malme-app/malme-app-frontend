import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { UserInfoService } from './user-info.service';
import { testProviders } from '../../testing/test-helpers';
import { environment } from 'src/environments/environment';

describe('UserInfoService', () => {
  let service: UserInfoService;
  let httpMock: HttpTestingController;
  const syncUrl = `${environment.apiBaseUrl}/user/sync-b2c`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: testProviders() });
    service = TestBed.inject(UserInfoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sends sync-b2c only once even when called from several places', () => {
    service.syncSystemProfile();
    service.syncSystemProfile();

    httpMock.expectOne(syncUrl).flush({});
    httpMock.expectNone(syncUrl);
  });

  it('replays the finished loading state to pages created after the sync', () => {
    service.syncSystemProfile();
    httpMock.expectOne(syncUrl).flush({});

    let latest: boolean | undefined;
    service.loadingSubject.subscribe((value) => (latest = value));

    expect(latest).toBeFalse();
    expect(service.profileLoadFailed).toBeFalse();
  });

  it('marks the profile as failed when sync-b2c fails', () => {
    service.syncSystemProfile();
    httpMock.expectOne(syncUrl).flush({}, { status: 500, statusText: 'Server Error' });

    expect(service.profileLoadFailed).toBeTrue();
  });

  it('retries sync-b2c after a failure and clears the failed flag on success', () => {
    service.syncSystemProfile();
    httpMock.expectOne(syncUrl).flush({}, { status: 500, statusText: 'Server Error' });

    service.syncSystemProfile();
    httpMock.expectOne(syncUrl).flush({});

    expect(service.profileLoadFailed).toBeFalse();
  });
});
