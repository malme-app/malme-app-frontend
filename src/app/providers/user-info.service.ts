import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

interface KeycloakProfile {
  uid: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  public keycloakProfile: KeycloakProfile | null = null;

  constructor(private readonly keycloak: KeycloakService) {
    this.initializeProfile();
  }

  async initializeProfile() {
    const isLoggedIn = await this.keycloak.isLoggedIn();
    if (isLoggedIn) {
      const keycloakProfile = await this.keycloak.loadUserProfile();
      this.keycloakProfile = {
        uid: keycloakProfile.id as string,
        email: keycloakProfile.email as string,
        username: keycloakProfile.username as string,
        firstName: keycloakProfile.firstName as string,
        lastName: keycloakProfile.lastName as string,
      };
    } else {
      this.keycloakProfile = null;
    }
  }
}
