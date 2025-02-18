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
    console.log(this.b2cProfile, 'profile')
  }

  public syncSystemProfile() {
    // Synchronize Keycloak profile with one from backend API
    return this.http.post(`${environment.apiBaseUrl}/user`, {}).subscribe({
      next: (data) => {
        this.systemProfile = data as SystemProfile;
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
      scopes: ['openid', 'profile', 'https://malmeapp.onmicrosoft.com/malmeapp/User.Read']
    };
    // const request = {
    //   scopes: environment.apiConfig.scopes
    // };
    this.authService.acquireTokenSilent(request).subscribe({
      next: (result) => {
        console.log('Access Token:', result);
        this.getUserInfo(result.accessToken);
        this.syncSystemProfile()
        // this.updateUserInfo();
      },
      error: (err) => {
        console.error('Token error:', err);
        this.authService.acquireTokenRedirect(request);
      }
    });
  }

  getUserInfo(accessToken: string) {
    const accessTokenNew = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IjlNU21iUkFsNU85eldJSUN0X3lVb3A3SHRIZDNlMDBTRnpvZnZtNTRJdmciLCJhbGciOiJSUzI1NiIsIng1dCI6ImltaTBZMnowZFlLeEJ0dEFxS19UdDVoWUJUayIsImtpZCI6ImltaTBZMnowZFlLeEJ0dEFxS19UdDVoWUJUayJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC80ZTVjMzljYS0xYjA4LTRmZDEtODY1NC01OTNmOTIxZDYyYmEvIiwiaWF0IjoxNzM5MzQwNTQ5LCJuYmYiOjE3MzkzNDA1NDksImV4cCI6MTczOTM0NDQ0OSwiYWlvIjoiazJRQUFqZTFWcDZmejJyVkg1YjIxZ1F2S2djQSIsImFwcF9kaXNwbGF5bmFtZSI6IldlYmRhbl9GcmFtZVdlYiIsImFwcGlkIjoiNmU1ZGQ3NTAtOTRmYi00OGUwLWE5YTktNTM5OTczYTkwMmE5IiwiYXBwaWRhY3IiOiIxIiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNGU1YzM5Y2EtMWIwOC00ZmQxLTg2NTQtNTkzZjkyMWQ2MmJhLyIsImlkdHlwIjoiYXBwIiwib2lkIjoiYzRkOTdlOGMtODMwNy00MGY5LThmYzQtODZmMWU2MzcwMWQxIiwicmgiOiIxLkFUOEF5amxjVGdnYjBVLUdWRmtfa2gxaXVnTUFBQUFBQUFBQXdBQUFBQUFBQUFBX0FBQV9BQS4iLCJyb2xlcyI6WyJVc2VyLlJlYWRXcml0ZS5BbGwiLCJVc2VyLUxpZmVDeWNsZUluZm8uUmVhZFdyaXRlLkFsbCIsIlVzZXIuUmVhZC5BbGwiXSwic3ViIjoiYzRkOTdlOGMtODMwNy00MGY5LThmYzQtODZmMWU2MzcwMWQxIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkFTIiwidGlkIjoiNGU1YzM5Y2EtMWIwOC00ZmQxLTg2NTQtNTkzZjkyMWQ2MmJhIiwidXRpIjoiUXpXTWxwcmZQMENfM2E0Ykxxb0RBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiMDk5N2ExZDAtMGQxZC00YWNiLWI0MDgtZDVjYTczMTIxZTkwIl0sInhtc19pZHJlbCI6IjcgMjQiLCJ4bXNfdGNkdCI6MTcwNTczOTE0OH0.VILdIRZxYKU1PUBNgMkCxgoy32NY7GV93VSvzw0yU5yzzEnhv77xI_XLV0zVaPjgE_evUToDbo00_LWQAphYvO7PElOhJhGz_3eitgql_-qhibiLAJ1SPpKBM8meJXGX-6-eZPJrKwlzv9yBu7K5E3xNd9ywySdq45QU_dZ6WiSRsqcjIiRbmmklpFqrgN1Ljq-84HcqfZwj-uUdNTcjQLhzGRsk8OJjyX0y_Qva7XFqi_t9SmnY-DPFzxPo0nIms3mxJVZ1iqZqBO_5xUfCBr79LuRcnlPTzRCEoHF86yoaW26pyD7QfmAGANn5-pe7-qUXlsF9kmVq8oqnKZF-QA"
    const graphUrl = 'https://graph.microsoft.com/v1.0/users/b3101c9e-93f2-45fb-885a-de57c4973244?$select=displayName,email,companyName,department,jobTitle,mobilePhone';
    // const graphUrl = 'https://graph.microsoft.com/v1.0/me';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessTokenNew}`,
      'Content-Type': 'application/json'
    });

    this.http.get(graphUrl, { headers }).subscribe({
      next: (res: any) => {
        console.log('User Info:', res);
      },
      error: (err: any) => {
        console.log('Error fetching user info:', err);
      }
    });
  }

  updateUserInfo() {
    const accessTokenNew = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IjlNU21iUkFsNU85eldJSUN0X3lVb3A3SHRIZDNlMDBTRnpvZnZtNTRJdmciLCJhbGciOiJSUzI1NiIsIng1dCI6ImltaTBZMnowZFlLeEJ0dEFxS19UdDVoWUJUayIsImtpZCI6ImltaTBZMnowZFlLeEJ0dEFxS19UdDVoWUJUayJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC80ZTVjMzljYS0xYjA4LTRmZDEtODY1NC01OTNmOTIxZDYyYmEvIiwiaWF0IjoxNzM5MzQwNTQ5LCJuYmYiOjE3MzkzNDA1NDksImV4cCI6MTczOTM0NDQ0OSwiYWlvIjoiazJRQUFqZTFWcDZmejJyVkg1YjIxZ1F2S2djQSIsImFwcF9kaXNwbGF5bmFtZSI6IldlYmRhbl9GcmFtZVdlYiIsImFwcGlkIjoiNmU1ZGQ3NTAtOTRmYi00OGUwLWE5YTktNTM5OTczYTkwMmE5IiwiYXBwaWRhY3IiOiIxIiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNGU1YzM5Y2EtMWIwOC00ZmQxLTg2NTQtNTkzZjkyMWQ2MmJhLyIsImlkdHlwIjoiYXBwIiwib2lkIjoiYzRkOTdlOGMtODMwNy00MGY5LThmYzQtODZmMWU2MzcwMWQxIiwicmgiOiIxLkFUOEF5amxjVGdnYjBVLUdWRmtfa2gxaXVnTUFBQUFBQUFBQXdBQUFBQUFBQUFBX0FBQV9BQS4iLCJyb2xlcyI6WyJVc2VyLlJlYWRXcml0ZS5BbGwiLCJVc2VyLUxpZmVDeWNsZUluZm8uUmVhZFdyaXRlLkFsbCIsIlVzZXIuUmVhZC5BbGwiXSwic3ViIjoiYzRkOTdlOGMtODMwNy00MGY5LThmYzQtODZmMWU2MzcwMWQxIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkFTIiwidGlkIjoiNGU1YzM5Y2EtMWIwOC00ZmQxLTg2NTQtNTkzZjkyMWQ2MmJhIiwidXRpIjoiUXpXTWxwcmZQMENfM2E0Ykxxb0RBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiMDk5N2ExZDAtMGQxZC00YWNiLWI0MDgtZDVjYTczMTIxZTkwIl0sInhtc19pZHJlbCI6IjcgMjQiLCJ4bXNfdGNkdCI6MTcwNTczOTE0OH0.VILdIRZxYKU1PUBNgMkCxgoy32NY7GV93VSvzw0yU5yzzEnhv77xI_XLV0zVaPjgE_evUToDbo00_LWQAphYvO7PElOhJhGz_3eitgql_-qhibiLAJ1SPpKBM8meJXGX-6-eZPJrKwlzv9yBu7K5E3xNd9ywySdq45QU_dZ6WiSRsqcjIiRbmmklpFqrgN1Ljq-84HcqfZwj-uUdNTcjQLhzGRsk8OJjyX0y_Qva7XFqi_t9SmnY-DPFzxPo0nIms3mxJVZ1iqZqBO_5xUfCBr79LuRcnlPTzRCEoHF86yoaW26pyD7QfmAGANn5-pe7-qUXlsF9kmVq8oqnKZF-QA"
    const graphUrl = 'https://graph.microsoft.com/v1.0/users/b3101c9e-93f2-45fb-885a-de57c4973244';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessTokenNew}`,
      'Content-Type': 'application/json'
    });

    const body = {
      jobTitle: 'Developer',
      companyName: 'Harmony-AT'
    }
    this.http.patch(graphUrl, body, { headers }).subscribe({
      next: (res: any) => {
        console.log('User Info:', res);
      },
      error: (err: any) => {
        console.log('Error fetching user info:', err);
      }
    });
  }
}
