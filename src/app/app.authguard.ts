import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthMSService } from './service/authMS.service';
import { rolesKey } from './providers/user-info.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private msalService: MsalService,
    private authService: AuthMSService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.msalService.instance.getActiveAccount()) {
      const pathRole = route.data['role'];
      if (pathRole && pathRole === 'Admin') {
        const roles = localStorage.getItem('malmeapp_roles');
        if (roles) {
          const listRole = JSON.parse(roles);
          if (listRole.includes(pathRole)) {
            return true;
          } else {
            this.router.navigate(['/'])
            return false;
          }
        }
      } else {
        return true;
      }
    }
    this.authService.login();
    return false;
  }
}
