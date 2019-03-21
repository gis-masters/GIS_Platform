import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  private ACCESS_TOKEN_KEY = 'accessToken';
  private REFRESH_TOKEN_KEY = 'refreshToken';

  constructor() {
  }

  signOut() {
    this.cleanUp();
  }

  saveToken(authModel: AuthModel) {
    this.cleanUp();

    window.localStorage.setItem(this.ACCESS_TOKEN_KEY, authModel.access_token);
    window.localStorage.setItem(this.REFRESH_TOKEN_KEY, authModel.refresh_token);
  }

  getAccessToken(): string {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private cleanUp() {
    window.localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    window.localStorage.clear();
  }
}

export interface AuthModel {
  access_token: string;
  expires_in: number;
  jti: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}
