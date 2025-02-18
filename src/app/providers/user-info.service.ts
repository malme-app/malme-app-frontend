import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

interface KeycloakProfile {
  uid: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface Group {
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
  group: Group | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  public keycloakProfile: KeycloakProfile | null = null;
  public systemProfile: SystemProfile | null = null;
  public b2cProfile: any | null = null;

  constructor(
    private router: Router,
    //private readonly keycloak: KeycloakService,
    private http: HttpClient,
    private authService: MsalService,
  ) { }

  public setKeycloakProfile(param: any) {
    // this.keycloakProfile = { ...this.keycloakProfile, ...param };
  }

  public setB2cProfile(param: any) {
    this.b2cProfile = { ...this.b2cProfile, ...param };
    console.log(this.b2cProfile, 'b2c profile')
  }

  public syncSystemProfile(idToken?: string) {
    const header = new HttpHeaders({
      'Authorization': `Bearer ${idToken}`,
    });
    // Synchronize Keycloak profile with one from backend API
    return this.http.post(`${environment.apiBaseUrl}/user/sync-b2c`, {}, { headers: header }).subscribe({
      next: (data : any) => {
        console.log(data)
        this.systemProfile = {
          id : data.id,
          uid: data.azureB2CId,
          roles : data.roles,
          email: data.email,
          group: {
            id: data.company.id,
            status: data.company.status,
            name: data.company.companyName,
            department: data.company.departmentName
          },
        } as SystemProfile
      },
      error: (error) => {
        console.log('ERROR', error);
      }
    });
  }

  public async syncKeycloakProfile() {
    // const keycloakProfile = await this.keycloak.loadUserProfile();
    // this.setKeycloakProfile({
    //   uid: keycloakProfile.id as string,
    //   email: keycloakProfile.email as string,
    //   username: keycloakProfile.username as string,
    //   firstName: keycloakProfile.firstName as string,
    //   lastName: keycloakProfile.lastName as string
    // });
  }

  public async initializeProfile() {
    // const isLoggedIn = await this.keycloak.isLoggedIn();
    // if (isLoggedIn) {
    //   this.syncSystemProfile();
    //   this.syncKeycloakProfile();
    // } else {
    //   window.location.href = environment.myURL;
    //   this.keycloakProfile = null;
    // }
  }

  getAccessToken() {
    const request = {
      scopes: environment.apiConfig.scopes
    };
    this.authService.acquireTokenSilent(request).subscribe({
      next: (result) => {
        console.log('Access Token:', result);
        this.syncSystemProfile(result.idToken)
      },
      error: (err) => {
        console.error('Token error:', err);
        this.authService.acquireTokenRedirect(request);
      }
    });
  }

}
