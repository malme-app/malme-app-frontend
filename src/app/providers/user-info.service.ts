import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Firestore, getFirestore } from '@angular/fire/firestore';

interface Profile {
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
  public deduct_points = 0;
  public new_points = 0;
  public old_points = 0;
  public profile: Profile | null = null;

  constructor(
    private readonly keycloak: KeycloakService,
    private db: Firestore
  ) {
    this.db = getFirestore();
    this.initializeProfile();
  }

  async initializeProfile() {
    const isLoggedIn = await this.keycloak.isLoggedIn();
    if (isLoggedIn) {
      const keycloakProfile = await this.keycloak.loadUserProfile();
      this.setProfile({
        uid: keycloakProfile.id as string,
        email: keycloakProfile.email as string,
        username: keycloakProfile.username as string,
        firstName: keycloakProfile.firstName as string,
        lastName: keycloakProfile.lastName as string,
      });
    } else {
      this.setProfile(null);
    }
  }

  setProfile(profile: Profile | null) {
    this.profile = profile;
  }
}
