import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AccountInfo, InteractionStatus } from '@azure/msal-browser';
import { HeaderComponent } from './header.component';
import { HeaderService } from '../service/header.service';
import {
  MsalBroadcastServiceStub,
  MsalServiceStub,
  TEST_IMPORTS,
  testProviders
} from '../../testing/test-helpers';
import { environment } from 'src/environments/environment';

describe('HeaderComponent', () => {
  const account = { homeAccountId: 'home', username: 'user@example.com' } as AccountInfo;

  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let msal: MsalServiceStub;
  let broadcast: MsalBroadcastServiceStub;
  let httpMock: HttpTestingController;

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';
  const spinner = () => (fixture.nativeElement as HTMLElement).querySelector('mat-spinner');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: TEST_IMPORTS,
      declarations: [HeaderComponent],
      providers: testProviders()
    });
    TestBed.inject(HeaderService).show();
    msal = TestBed.inject(MsalService) as unknown as MsalServiceStub;
    broadcast = TestBed.inject(MsalBroadcastService) as unknown as MsalBroadcastServiceStub;
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('shows a spinner, not Login/Signup, while MSAL is handling the redirect', () => {
    broadcast.inProgress$.next(InteractionStatus.HandleRedirect);
    fixture.detectChanges();

    expect(spinner()).not.toBeNull();
    expect(text()).not.toContain('Login');
  });

  it('keeps the spinner while a signed-in user profile loads, then shows the user', () => {
    msal.accounts = [account];
    fixture.detectChanges();

    expect(spinner()).not.toBeNull();
    expect(text()).not.toContain('Login');

    httpMock.expectOne(`${environment.apiBaseUrl}/user/sync-b2c`).flush({});
    httpMock.expectOne(`${environment.apiBaseUrl}/user/check-permission`).flush({ roles: [] });
    httpMock.expectOne(`${environment.apiBaseUrl}/user/profile`).flush({
      id: 1,
      azureB2CId: 'uid',
      firstName: '太郎',
      lastName: '山田',
      email: 'user@example.com',
      roles: ['Member'],
      company: null
    });
    fixture.detectChanges();

    expect(spinner()).toBeNull();
    expect(text()).toContain('山田');
    expect(text()).not.toContain('Login');
  });

  it('offers Login again when the profile sync fails', () => {
    msal.accounts = [account];
    fixture.detectChanges();

    httpMock
      .expectOne(`${environment.apiBaseUrl}/user/sync-b2c`)
      .flush({}, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(spinner()).toBeNull();
    expect(text()).toContain('Login');
  });

  it('shows Login/Signup when nobody is signed in', () => {
    fixture.detectChanges();

    expect(spinner()).toBeNull();
    expect(text()).toContain('Login');
    expect(text()).toContain('Signup');
  });
});
