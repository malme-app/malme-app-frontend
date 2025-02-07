import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { UserInfoService } from '../providers/user-info.service';
import { environment } from 'src/environments/environment';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { HeaderService } from '../service/header.service';
import { AuthMSService } from '../service/authMS.service';
import { filter, Subject, takeUntil } from 'rxjs';
import {
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalService,
  MsalBroadcastService
} from '@azure/msal-angular';
import {
  RedirectRequest,
  PopupRequest,
  InteractionStatus,
  EventType,
  EventMessage,
  AuthenticationResult,
  PromptValue,
  IdTokenClaims
} from '@azure/msal-browser';

type IdTokenClaimsWithPolicyId = IdTokenClaims & {
  acr?: string;
  tfp?: string;
};
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  private readonly _destroying$ = new Subject<void>();
  constructor(
    private router: Router,
    // private readonly keycloak: KeycloakService,
    public userInfo: UserInfoService,
    public header: HeaderService,
    public authMs: AuthMSService,
  ) {}

  ngOnInit() {
    console.log('AppComponent initializing');
    this.userInfo.initializeProfile();
    this.authMs.initMSAL();
  }

  ngAfterViewInit() {
    console.log('AppComponent ngAfterViewInit');
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

  async login() {
    this.authMs.login()
  }

  async logout() {
    this.authMs.logout();
  }

  signup() {
    // this.keycloak.register();
  }

  goMypage() {
    this.router.navigate(['/']);
  }

}
