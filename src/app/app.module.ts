import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopComponent } from './top/top.component';
import { DashboardComponent } from './mypage/dashboard/dashboard.component';
import { ProfileComponent } from './mypage/profile/profile.component';
import { InvoiceComponent } from './mypage/invoice/invoice.component';
import { InviteComponent } from './mypage/invite/invite.component';
import { PlanComponent } from './mypage/plan/plan.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AuthGuard } from './app.authguard';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InvitationComponent } from './invitation/invitation.component';
import { Dxlogin2023Component } from './dxlogin2023/dxlogin2023.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { MsalInterceptorConfiguration, MsalGuardConfiguration, MsalModule, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalGuard, MsalInterceptor, MsalService, MsalRedirectComponent } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication, BrowserCacheLocation, InteractionType } from '@azure/msal-browser';
import { LogLevel as LogLevelMasl } from "@azure/msal-browser";
import { httpInterceptorProviders } from './interceptors/auth.interceptor';

// function initializeKeycloak(keycloak: KeycloakService) {
//   return () =>
//     keycloak
//       .init({
//         config: {
//           url: environment.keycloakUrl,
//           realm: environment.keycloakRealm,
//           clientId: environment.keycloakClientId
//         },
//         initOptions: {
//           onLoad: 'check-sso'
//         },
//         enableBearerInterceptor: true,
//         bearerPrefix: 'Bearer',
//         bearerExcludedUrls: []
//       })
//       .catch((error) => {
//         console.log('error =', error);
//         window.alert('ログインに失敗しました');
//       });
// }

export function loggerCallback(logLevel: LogLevelMasl, message: string) {
  // console.log(message);
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.msalConfig.auth.clientId,
      authority: environment.b2cPolicies.authorities.signUpSignIn.authority,
      redirectUri: environment.msalConfig.auth.redirectUri,
      postLogoutRedirectUri: environment.msalConfig.auth.postLogoutRedirectUri,
      knownAuthorities: [environment.b2cPolicies.authorityDomain]
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage
    },
    system: {
      allowNativeBroker: false, // Disables WAM Broker
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevelMasl.Verbose,
        piiLoggingEnabled: false
      }
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(environment.apiConfig.uri, environment.apiConfig.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [...environment.apiConfig.scopes],
    },
    loginFailedRoute: "/login-failed",
  };
}

@NgModule({
  declarations: [
    AppComponent,
    TopComponent,
    DashboardComponent,
    ProfileComponent,
    InvoiceComponent,
    InviteComponent,
    PlanComponent,
    InvitationComponent,
    Dxlogin2023Component,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // KeycloakAngularModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MsalModule
  ],
  providers: [
    // AuthGuard,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeKeycloak,
    //   multi: true,
    //   deps: [KeycloakService]
    // },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule {}
