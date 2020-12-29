import { Injectable } from '@angular/core';
import { Observable, throwError, defer, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { replaceUrl } from '../server-urls.service';
import { authService } from '../auth.service';

//TODO: kill me
@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(async () => {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + authService.token
        },
        url: await replaceUrl(request.url)
      });

      return next.handle(request).pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          if (errorResponse.status === 401) {
            authService.logout();
          }

          return throwError(errorResponse);
        })
      );
    });
  }
}
