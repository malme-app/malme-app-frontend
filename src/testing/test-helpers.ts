import { EnvironmentProviders, Provider } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AccountInfo, EventMessage, InteractionStatus, InteractionType } from '@azure/msal-browser';
import { BehaviorSubject, Observable, Subject, of, throwError } from 'rxjs';

/** The modules AppModule gives its declared components. */
export const TEST_IMPORTS = [
  NoopAnimationsModule,
  FormsModule,
  ReactiveFormsModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTableModule
];

/** Controllable stand-in for MsalService. */
export class MsalServiceStub {
  accounts: AccountInfo[] = [];
  activeAccount: AccountInfo | null = null;
  acquireTokenSilentResult: Observable<{ accessToken: string }> = throwError(
    () => new Error('acquireTokenSilent not stubbed')
  );

  instance = {
    getAllAccounts: () => this.accounts,
    getActiveAccount: () => this.activeAccount,
    setActiveAccount: (account: AccountInfo | null) => {
      this.activeAccount = account;
    },
    enableAccountStorageEvents: () => undefined,
    handleRedirectPromise: () => Promise.resolve(null)
  };

  acquireTokenSilent = jasmine
    .createSpy('acquireTokenSilent')
    .and.callFake(() => this.acquireTokenSilentResult);

  loginRedirect = jasmine.createSpy('loginRedirect').and.returnValue(of(undefined));
}

/** Controllable stand-in for MsalBroadcastService. */
export class MsalBroadcastServiceStub {
  inProgress$ = new BehaviorSubject<InteractionStatus>(InteractionStatus.None);
  msalSubject$ = new Subject<EventMessage>();
}

export function testProviders(): (Provider | EnvironmentProviders)[] {
  return [
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting(),
    provideRouter([]),
    { provide: MsalService, useClass: MsalServiceStub },
    { provide: MsalBroadcastService, useClass: MsalBroadcastServiceStub },
    {
      provide: MSAL_GUARD_CONFIG,
      useValue: { interactionType: InteractionType.Redirect, authRequest: { scopes: [] } }
    },
    { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
    { provide: MAT_DIALOG_DATA, useValue: { title: '', message: '', acceptBtn: '', cancelBtn: '' } }
  ];
}
