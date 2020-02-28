import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { tokenStorageService, JwtToken } from './token-storage.service';
import { serverProperties } from './server-properties.service';
import { HttpQueue } from './util/HttpQueue';

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

@Injectable({providedIn: 'root'})
export class AuthService {
  private _authenticated = false;

  constructor(private httpq: HttpQueue,
              private router: Router) {
    if (tokenStorageService.getToken()) {
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
    const url = await serverProperties.authServerUrl;

    return this.httpq.post<JwtToken>(url, params.toString(), options);
  }

  validateAuth(redirectTo: string) {
    if (this._authenticated) {
      this.router.navigateByUrl(redirectTo);
    }
  }

  logout() {
     tokenStorageService.signOut();

    this._authenticated = false;
    this.router.navigate(['/']);
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

    return this.httpq.post(url + '/init', payload);
  }

  get authenticated(): boolean {
    return this._authenticated;
  }

  set authenticated(value: boolean) {
    this._authenticated = value;
  }
}
