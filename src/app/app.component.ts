import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { UserInfoService } from './providers/user-info.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
<<<<<<< Updated upstream
export class AppComponent {
  title = 'structuralengine-platform';
=======
export class AppComponent implements OnInit, AfterViewInit {
  title = 'malmeApp';
>>>>>>> Stashed changes

  constructor(
    private router: Router,
    private readonly keycloak: KeycloakService,
    public userInfo: UserInfoService
  ) {}

  ngOnInit() {
    console.log('AppComponent initializing');
    this.userInfo.initializeProfile();
  }

  ngAfterViewInit() {
    console.log('AppComponent ngAfterViewInit');
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout(environment.myURL); //(window.origin);
  }

  signup() {
    this.keycloak.register();
  }

  goMypage() {
    this.router.navigate(['/mypage']);
  }
}
