import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserInfoService } from '../providers/user-info.service';
import { Router } from '@angular/router';
import { HeaderService } from '../service/header.service';
import { AuthMSService } from '../service/authMS.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    public userInfo: UserInfoService,
    public header: HeaderService,
    public authMs: AuthMSService,
  ) {}

  ngOnInit() {
    console.log('AppComponent initializing');
    this.authMs.initMSAL();
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
