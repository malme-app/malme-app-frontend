import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { UserInfoService } from '../providers/user-info.service';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { HeaderService } from '../service/header.service';
import { AuthMSService } from '../service/authMS.service';
import { Subject } from 'rxjs';

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
    this.authMs.initMSAL();
    this.userInfo.initializeProfile();
  }

  ngAfterViewInit() {
    console.log('AppComponent ngAfterViewInit');
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

  navigateMalmePage() {
    window.open('https://malme.app');
  }
}
