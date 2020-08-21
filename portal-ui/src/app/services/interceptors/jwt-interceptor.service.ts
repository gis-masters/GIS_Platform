import { NGXLogger } from 'ngx-logger';
import { Injectable } from '@angular/core';
import { Observable, throwError, defer } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { GeoUtil } from '../util/GeoUtil';
import { AuthService } from '../auth.service';
import { getEnvironment, Environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {
  constructor(private logger: NGXLogger,
              private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return defer(getEnvironment).pipe(
      flatMap((environment: Environment) => {
        if (this.authService.authenticated) {
          request = request.clone({
            url: GeoUtil.replaceUrl(request.url, environment.server)
          });
        }

        return next.handle(request).pipe(
          catchError((errorResponse: HttpErrorResponse) => {
            if (errorResponse.status === 401) {
                this.authService.logout();
            }

            return throwError(errorResponse);
          }));
      })
    );
  }
}
