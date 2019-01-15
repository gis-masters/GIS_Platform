import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {GeoUtil} from './util/GeoUtil';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';
import {TokenStorageService} from './token-storage.service';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  constructor(private logger: NGXLogger,
              private tokenStorage: TokenStorageService,
              private authService: AuthService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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

    return next.handle(request);
  }
}
