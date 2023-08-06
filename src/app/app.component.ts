import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'structuralengine-platform';
  isLoggedIn = false;
  userProfile: KeycloakProfile | null = null;

  constructor(
    private router: Router,
    private readonly keycloak: KeycloakService
  ) {}

  async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
    }
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout(window.origin);
  }

  signup() {
    this.keycloak.register();
  }

  goMypage() {
    this.router.navigate(['/mypage']);
  }
}
