import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserInfoService } from '../providers/user-info.service';
import { Router } from '@angular/router';
import { HeaderService } from '../service/header.service';
import { AuthMSService } from '../service/authMS.service';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { takeUntil } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit, AfterViewInit {
  private interactionDone = false;
  private hasAccount = false;

  constructor(
    private router: Router,
    public userInfo: UserInfoService,
    public header: HeaderService,
    public authMs: AuthMSService,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
  ) {}

  /**
   * True while MSAL is still handling login, or while a signed-in user's profile is
   * loading. The header shows a spinner then, not Login/Signup.
   */
  get authPending(): boolean {
    if (!this.interactionDone) {
      return true;
    }
    return this.hasAccount && !this.userInfo.profileLoadFailed;
  }

  ngOnInit() {
    console.log('AppComponent initializing');
    this.authMs.initMSAL();
    this.msalBroadcastService.inProgress$
      .pipe(takeUntil(this.authMs._destroying$))
      .subscribe((status: InteractionStatus) => {
        this.interactionDone = status === InteractionStatus.None;
        this.hasAccount = this.msalService.instance.getAllAccounts().length > 0;
      });
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
  }

  goMypage() {
    this.router.navigate(['/']);
  }

  navigateMalmePage() {
    window.open('https://malme.app');
  }
}
