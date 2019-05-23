import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {ProjectsService} from './gis/projects.service';
import {TokenStorageService} from './token-storage.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ServerPropertiesService} from './server-properties.service';

@Injectable({providedIn: 'root'})
export class AuthService {

  private _authenticated = false;

  constructor(private http: HttpClient,
              private router: Router,
              private tokenStorage: TokenStorageService,
              private projectService: ProjectsService,
              private serverProperties: ServerPropertiesService,
              private logger: NGXLogger) {
    logger.debug('AuthService start');

    const authModel = this.tokenStorage.getAuthModel();
    if (authModel) {
      if (authModel.created_in + (authModel.expires_in * 1000) > Date.now()) {
        this._authenticated = true;
      } else {
        // TODO: try use refresh token
        this.logger.info('Token expired');
      }
    }
  }

  authenticate(credentials) {
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
    this.projectService.clearCache();

    this.tokenStorage.signOut();

    this._authenticated = false;
    this.router.navigate(['/']);
  }

  // TODO: Создание новой орг в модуле аутентификации???
  registration(regData: RegData) {
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
