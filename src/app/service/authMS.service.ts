import { Inject, Injectable } from '@angular/core';
import {
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalService,
  MsalBroadcastService
} from '@azure/msal-angular';
import {
  InteractionStatus,
  EventMessage,
  EventType,
  AccountInfo,
  AuthenticationResult,
  PopupRequest,
  PromptValue,
  RedirectRequest,
  SsoSilentRequest,
  IdTokenClaims
} from '@azure/msal-browser';
import { filter, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tokenKey, UserInfoService } from '../providers/user-info.service';

type IdTokenClaimsWithPolicyId = IdTokenClaims & {
  acr?: string;
  tfp?: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthMSService {
  public readonly _destroying$ = new Subject<void>();
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private user : UserInfoService
  ) {
    
  }

  initMSAL() {
    this.authService.instance.enableAccountStorageEvents();
      this.msalBroadcastService.msalSubject$
        .pipe(
          filter(
            (msg: EventMessage) =>
              msg.eventType === EventType.ACCOUNT_ADDED ||
              msg.eventType === EventType.ACCOUNT_REMOVED
          )
        )
        .subscribe((result: EventMessage) => {
          if (this.authService.instance.getAllAccounts().length === 0) {
            window.location.pathname = "/";
          } else {
          }
        });

      this.msalBroadcastService.inProgress$
        .pipe(
          filter((status: InteractionStatus) => status === InteractionStatus.None),
          takeUntil(this._destroying$)
        )
        .subscribe(() => {
          this.checkAndSetActiveAccount();
          if (this.authService.instance.getAllAccounts().length > 0) {
            // const listClaims = this.getClaims(this.authService.instance.getActiveAccount()?.idTokenClaims as Record<string, any>);
            // const clientId = environment.msalConfig.auth.clientId;
            // this.user.setB2cProfile({
            //   uid: listClaims.find(item => item.claim === "sub")?.value,
            //   email: (listClaims.find(item => item.claim === "emails")?.value as string)[0],
            //   name: listClaims.find(item => item.claim === "name")?.value,
            //   firstName: listClaims.find(item => item.claim === "given_name")?.value,
            //   lastName: listClaims.find(item => item.claim === "family_name")?.value,
            // });
            this.user.syncSystemProfile();
            this.user.getAcessToken();
            this.user.setUserProfile();
          } else {
            this.login();
          }
        })

      this.msalBroadcastService.msalSubject$
        .pipe(
          filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS
            || msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
            || msg.eventType === EventType.SSO_SILENT_SUCCESS),
          takeUntil(this._destroying$)
        )
        .subscribe((result: EventMessage) => {

          let payload = result.payload as AuthenticationResult;
          let idtoken = payload.idTokenClaims as IdTokenClaimsWithPolicyId;

          if (idtoken.acr === environment.b2cPolicies.names.signUpSignIn || idtoken.tfp === environment.b2cPolicies.names.signUpSignIn) {
            this.authService.instance.setActiveAccount(payload.account);
          }

          if (idtoken.acr === environment.b2cPolicies.names.resetPassword || idtoken.tfp === environment.b2cPolicies.names.resetPassword) {
            let signUpSignInFlowRequest: RedirectRequest | PopupRequest = {
              authority: environment.b2cPolicies.authorities.signUpSignIn.authority,
              scopes: [...environment.apiConfig.scopes],
              prompt: PromptValue.LOGIN 
            };

            this.login(signUpSignInFlowRequest);
          }

          return result;
        });

      this.msalBroadcastService.msalSubject$
        .pipe(
          filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_FAILURE || msg.eventType === EventType.ACQUIRE_TOKEN_FAILURE),
          takeUntil(this._destroying$)
        )
        .subscribe((result: EventMessage) => {
          if (result.error && result.error.message.indexOf('AADB2C90118') > -1) {
            let resetPasswordFlowRequest: RedirectRequest | PopupRequest = {
              authority: environment.b2cPolicies.authorities.resetPassword.authority,
              scopes: [],
            };

            this.login(resetPasswordFlowRequest);
          };
        });
  }

  getClaims(claims: Record<string, any>) {
    const listClaims: { id: number; claim: string; value: unknown }[] = [];
    if (claims) {
      Object.entries(claims).forEach((claim: [string, unknown], index: number) => {
        listClaims.push({ id: index, claim: claim[0], value: claim[1] });
      });
    }
    return listClaims;
  }

  checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  async login(userFlowRequest?: RedirectRequest | PopupRequest) {
    // this.keycloak.login();
    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) =>
            status === InteractionStatus.None || status === InteractionStatus.HandleRedirect
        )
      )
      .subscribe(async () => {
        if (this.msalGuardConfig.authRequest) {
          await this.authService.loginRedirect({
            ...this.msalGuardConfig.authRequest
          } as RedirectRequest);

          // this.user.getAuthorizeCode()

          // await this.authService.acquireTokenRedirect({
          //   ...this.msalGuardConfig.authRequest
          // } as RedirectRequest);
        } else {
          await this.authService.loginRedirect();
        }
      });
  }

  async logout() {
    await this.authService.instance
      .handleRedirectPromise()
      .then((tokenResponse) => {
        if (!tokenResponse) {
          this.user.systemProfile = null;
          this.user.b2cProfile = null;
          localStorage.removeItem(tokenKey);
          this.authService.logoutRedirect();
        }
        // else {
        //   // Do something with the tokenResponse
        // }
      })
      .catch((err) => {
        // Handle error
        console.error(err);
      });
  }
}
