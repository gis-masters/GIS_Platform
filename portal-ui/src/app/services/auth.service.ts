import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

import { TokenStorageService, JwtToken } from './token-storage.service';
import { ServerPropertiesService } from './server-properties.service';
import { HttpQueue } from './util/HttpQueue';

export interface AuthCredentials {
  username: string;
  password: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private _authenticated = false;

  constructor(private httpq: HttpQueue,
              private router: Router,
              private tokenStorage: TokenStorageService,
              private serverProperties: ServerPropertiesService,
              private logger: NGXLogger) {
    const jwtToken = this.tokenStorage.getToken();
    if (jwtToken) {
      this._authenticated = true;
    }
  }

  async authenticate(credentials: AuthCredentials): Promise<JwtToken> {
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    params.append('grant_type', 'password');

    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
    });

    const options = {withCredentials: true, headers: headers};
    const url = await this.serverProperties.authServerUrl;

    return this.httpq.post<JwtToken>(url, params.toString(), options);
  }

  validateAuth(redirectTo: string) {
    if (this._authenticated) {
      this.router.navigateByUrl(redirectTo);
    }
  }

  logout() {
    this.tokenStorage.signOut();

    this._authenticated = false;
    this.router.navigate(['/']);
  }

  // TODO: Создание новой орг в модуле аутентификации???
  async registration(regData: RegData): Promise<{}> {
    const payload = {
      email: regData.email,
      name: regData.company,
      password: regData.password,
      phone: regData.contactPhone,
      userName: regData.firstName,
      userSurName: regData.lastName
    };
    const url = await this.serverProperties.organizationsUrl;

    return this.httpq.post(url, payload);
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
