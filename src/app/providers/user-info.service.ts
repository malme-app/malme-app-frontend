import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { map, Observable, switchMap } from 'rxjs';

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
  companyName: string;
  departmentName: string;
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

interface Company {
  id: number;
  status: number;
  companyName: string;
  departmentName: string;
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

  public syncSystemProfile() {
    this.getAcessToken().subscribe({
      next: (token) => {
        const header = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
        });
        console.log(Date.now(), 'time')
        // setTimeout(() => {
          this.http.post(`${environment.apiBaseUrl}/user/sync-b2c`, {}, { headers: header }).subscribe({
            next: (res) => {
              console.log('synced profile successfully', res)
            },
            error: (err) => {
              console.log('error', err);
            }
          });
        // }, 5000)

      },
      error: (err) => {
        console.error('error:', err);
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

  getSystemProfile(): void {
    this.getAcessToken().subscribe({
      next: (token) => {
        const header = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
        });
        this.http.get(`${environment.apiBaseUrl}/user/profile`, { headers: header }).subscribe({
          next: (res: any) => {
            const group: Company = {
              id: res.company.id,
              status: res.company.status,
              companyName: res.company.companyName,
              departmentName: res.company.departmentName,
              bankName: res.company.bankName,
              bankBranchName: res.company.bankBranchName,
              bankAccountType: res.company.bankAccountType,
              bankAccountNumber: res.company.bankAccountNumber,
              licenses: res.company.licenses,
            }
            this.systemProfile = {
              id: res.id,
              uid: res.azureB2CId,
              roles: res.roles,
              email: res.email,
              group: group,
            } as SystemProfile
            console.log(this.systemProfile, 'system profile');

          },
          error: (err) => {
            console.log(err);
          }
        })
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getAcessToken(): Observable<string> {
    const request = { scopes: environment.apiConfig.scopes };
    return new Observable<string>((observer) => {
      this.authService.acquireTokenSilent(request).subscribe({
        next: (result) => {
          observer.next(result.accessToken);
          observer.complete();
        },
        error: (err) => {
          console.error('Token error:', err);
          observer.error(err);
        }
      });
    });
  }

}
