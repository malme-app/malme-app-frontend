import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';

interface KeycloakProfile {
  uid: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface Organization {
  id: number;
  status: number;
  name: string;
  department: string;
  type: number;
  zipcode: string;
  address: string;
  tel: string;
  bankName: string;
  bankBranchName: string;
  bankAccountType: string;
  bankAccountNumber: string;
  licenses: number;
}

interface SystemProfile {
  id: number;
  uid: string;
  email: string;
  roles: string[];
  organization: Organization | null;
}

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  public keycloakProfile: KeycloakProfile | null = null;
  public systemProfile: SystemProfile | null = null;

  constructor(
    private readonly keycloak: KeycloakService,
    private http: HttpClient,
  ) {
    this.initializeProfile();
  }

  public syncSystemProfile() {
    // Synchronize Keycloak profile with one from backend API
    return this.http
      .post(`${environment.apiBaseUrl}/user`, {})
      .subscribe({
        next: (data) => this.systemProfile = data as SystemProfile,
        error: (error) => console.error("ERROR: ", error)
      });
  }

  async initializeProfile() {
    const isLoggedIn = await this.keycloak.isLoggedIn();
    if (isLoggedIn) {
      this.syncSystemProfile();
      // Load Keycloak profile
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
