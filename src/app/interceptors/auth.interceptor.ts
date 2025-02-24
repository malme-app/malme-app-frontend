import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { UserInfoService } from '../providers/user-info.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private userInfoService: UserInfoService
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
          return this.userInfoService.getAcessToken().pipe(
            switchMap((newToken) => {
              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                }
              });
              return next.handle(request);
            }),
            catchError(() => throwError(() => error))
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