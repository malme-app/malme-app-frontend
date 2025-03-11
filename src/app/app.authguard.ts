import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthMSService } from './service/authMS.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private msalService: MsalService, 
    private authService: AuthMSService,
  ) { }

  canActivate(): boolean {
    if (this.msalService.instance.getActiveAccount()) {
      return true;
    }
    this.authService.login();
    return false;
  }
}
