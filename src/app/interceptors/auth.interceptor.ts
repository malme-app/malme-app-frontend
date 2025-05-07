import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError, timer } from 'rxjs';
import { UserInfoService } from '../providers/user-info.service';
import { MsalService } from '@azure/msal-angular';
import { AuthMSService } from '../service/authMS.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private userInfoService: UserInfoService,
    private authService: AuthMSService,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.userInfoService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return timer(3500).pipe(
            switchMap(() => {
              return this.userInfoService.getAcessToken().pipe(
                switchMap((newToken) => {
                  request = request.clone({
                    setHeaders: {
                      Authorization: `Bearer ${newToken}`,
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
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
