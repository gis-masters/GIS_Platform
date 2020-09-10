import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Cookies from 'js-cookie';

import { serverProperties } from './server-properties.service';
import { usersService } from './crg/users.service';
import { services } from './services';

export interface AuthCredentials {
  username: string;
  password: string;
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

class AuthService {
  private static _instance: AuthService;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private _authenticated = false;

  private COOKIE_NAME = 'crgAuthCookie';

  constructor() {
    if (Cookies.get(this.COOKIE_NAME)) {
      this._authenticated = true;
    }
  }

  async authenticate(credentials: AuthCredentials): Promise<void> {
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    params.append('grant_type', 'password');

    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
    });

    const options = { withCredentials: true, headers: headers };
    const url = await serverProperties.authServerUrl;

    return services.httpq.post(url, params.toString(), options);
  }

  validateAuth(redirectTo: string) {
    if (this._authenticated) {
      services.router.navigateByUrl(redirectTo);
    }
  }

  async logout() {
    const url = await serverProperties.baseUrl;
    services.httpq.post(url + '/perform_logout', {});

    this._authenticated = false;
    services.router.navigate([ '/' ]);
    usersService.dropCurrent();
  }

  // TODO: Создание новой орг в модуле аутентификации???
  async registration(regData: RegData): Promise<{}> {
    const payload = {
      name: regData.company,
      phone: regData.contactPhone,
      owner: {
        name: regData.firstName,
        surName: regData.lastName,
        email: regData.email,
        password: regData.password
      }
    };
    const url = await serverProperties.organizationsUrl;

    return services.httpq.post(url + '/init', payload);
  }

  get authenticated(): boolean {
    return this._authenticated;
  }

  set authenticated(value: boolean) {
    this._authenticated = value;
  }
}

export const authService = AuthService.instance;
