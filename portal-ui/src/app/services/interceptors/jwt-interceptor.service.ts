import { Injectable } from '@angular/core';
import { Observable, throwError, defer } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { getEnvironment, Environment } from '../environment';
import { authService } from '../auth.service';
import { GeoUtil } from '../util/GeoUtil';

//TODO: kill me
@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return defer(getEnvironment).pipe(
      flatMap((environment: Environment) => {
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + authService.token
          },
          url: GeoUtil.replaceUrl(request.url, environment.server)
        });

        return next.handle(request).pipe(
          catchError((errorResponse: HttpErrorResponse) => {
            if (errorResponse.status === 401) {
              authService.logout();
            }

            return throwError(errorResponse);
          })
        );
      })
    );
  }
}
