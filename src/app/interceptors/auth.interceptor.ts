import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { catchError, filter, Observable, of, switchMap, take, throwError, timer } from 'rxjs';
import { UserInfoService } from '../providers/user-info.service';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { AuthMSService } from '../service/authMS.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private userInfoService: UserInfoService,
    private authService: AuthMSService,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only our own API gets the access token.
    if (!request.url.startsWith(environment.apiBaseUrl)) {
      return next.handle(request);
    }

    return this.resolveToken().pipe(
      switchMap((token) => {
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        return next.handle(request);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return timer(3500).pipe(
            switchMap(() => {
              return this.userInfoService.getAcessToken().pipe(
                switchMap((newToken) => {
                  request = request.clone({
                    setHeaders: {
                      Authorization: `Bearer ${newToken}`
                    }
                  });
                  return next.handle(request);
                }),
                catchError(() => {
                  this.authService.login();
                  return throwError(() => error);
                })
              );
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Waits until MSAL has finished any login/redirect handling, then acquires a token
   * silently (MSAL serves it from its cache when still valid). Without this, the first
   * requests after login went out with no or an expired stored token and got a 401.
   */
  private resolveToken(): Observable<string | null> {
    return this.msalBroadcastService.inProgress$.pipe(
      filter((status) => status === InteractionStatus.None),
      take(1),
      switchMap(() => {
        if (this.msalService.instance.getAllAccounts().length === 0) {
          return of(this.userInfoService.getToken());
        }
        this.authService.checkAndSetActiveAccount();
        return this.userInfoService
          .getAcessToken()
          .pipe(catchError(() => of(this.userInfoService.getToken())));
      })
    );
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
