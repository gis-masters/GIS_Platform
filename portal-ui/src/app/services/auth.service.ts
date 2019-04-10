import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {TokenStorageService} from './token-storage.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ServerPropertiesService} from './server-properties.service';

@Injectable({providedIn: 'root'})
export class AuthService {

  private _authenticated = false;

  constructor(private http: HttpClient,
              private router: Router,
              private tokenStorage: TokenStorageService,
              private serverProperties: ServerPropertiesService,
              private logger: NGXLogger) {
    logger.debug('AuthService start');

    if (tokenStorage.getAccessToken()) {
      this._authenticated = true;
    }
  }

  authenticate(credentials) {
    this.logger.info('Try auth: ', credentials);

    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    params.append('grant_type', 'password');

    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
    });

    const options = {withCredentials: true, headers: headers};

    return this.http.post(this.serverProperties.authServerUrl, params.toString(), options);
  }

  validateAuth() {
    if (this.router.isActive('/login', false)) {
      if (this._authenticated) {
        this.router.navigateByUrl('/workspace');
      }
    } else {
      if (!this._authenticated) {
        this.router.navigate(['/']);
      }
    }
  }

  logout() {
    this.tokenStorage.signOut();

    this._authenticated = false;
    this.router.navigate(['/']);
  }

  registration(regData: RegData) {
    // this.logger.info('Try register new organization: ', regData);

    const payload = {
      email: regData.email,
      name: regData.company,
      password: regData.password,
      phone: regData.contactPhone,
      userName: regData.firstName,
      userSurName: regData.lastName
    };

    return this.http.post(this.serverProperties.organizationsUrl, payload);
  }

  get authenticated(): boolean {
    return this._authenticated;
  }

  set authenticated(value: boolean) {
    this._authenticated = value;
  }
}

export interface RegData {
  company: string;
  contactPhone: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  password_: string;
}
