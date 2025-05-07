import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(
    private http: HttpClient,
  ) { }

  getListPermission(): Observable<any> {


    return this.http.get(`${environment.apiBaseUrl}/user/get-permissions`);
  }

  checkPermission(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/user/check-permission`);
  }

  getUsersCompany(page: number, size: number , search?: string): Observable<any> {
    let params: any = {
      page: page,
      size: size
    };

    if (search) params.search = search;

    return this.http.get(`${environment.apiBaseUrl}/user/users-company`, { params });
  }

  updateUserRole(user: any): Observable<any> {
    const header = new HttpHeaders({
      'Content-Type': `application/json`,
    });

    const body = {
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles
    }

    return this.http.put(`${environment.apiBaseUrl}/user/update-user/${user.azureB2CId}`, body, { headers: header });
  }
}
