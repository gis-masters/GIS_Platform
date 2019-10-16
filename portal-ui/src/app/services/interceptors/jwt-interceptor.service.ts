import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
import {Observable, throwError, defer} from 'rxjs';
import {catchError, flatMap} from 'rxjs/operators';

import {GeoUtil} from '../util/GeoUtil';
import {AuthService} from '../auth.service';
import {TokenStorageService} from '../token-storage.service';
import { getEnvironment, Environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {
  constructor(private logger: NGXLogger,
              private tokenStorage: TokenStorageService,
              private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return defer(getEnvironment).pipe(
      flatMap((environment: Environment) => {
        if (this.authService.authenticated) {
          const accessToken = this.tokenStorage.getAccessToken();
          if (!accessToken) {
            this.logger.warn('user authenticated but token empty!', accessToken);
          }

          request = request.clone({
            url: GeoUtil.replaceUrl(request.url, environment.server),
            setHeaders: {
              Authorization: 'Bearer ' + accessToken
            }
          });
        }

        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              const refreshToken = this.tokenStorage.getRefreshToken();
              if (refreshToken) {
                // TODO: попробывать получить аксесс токен по refreshToken (вместо логаута)
                this.authService.logout();
              } else {
                this.authService.logout();
              }
            }

            return throwError(error);
          }));
      })
    );
  }
}
