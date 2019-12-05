import {Injectable} from '@angular/core';
import {LocalStorageService} from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  private ACCESS_TOKEN_KEY = 'accessToken';
  private REFRESH_TOKEN_KEY = 'refreshToken';
  private JWT_TOKEN = 'jwtToken';

  constructor(private storageService: LocalStorageService) {
  }

  signOut() {
    this.storageService.cleanUp();
  }

  saveToken(jwtToken: JwtToken) {
    this._save(this.JWT_TOKEN, JSON.stringify(jwtToken));
    this._save(this.ACCESS_TOKEN_KEY, jwtToken.access_token);
    this._save(this.REFRESH_TOKEN_KEY, jwtToken.refresh_token);
  }

  getToken(): JwtToken {
    return JSON.parse(this.storageService.getByKey(this.JWT_TOKEN));
  }

  getAccessToken(): string {
    return this.storageService.getByKey(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string {
    return this.storageService.getByKey(this.REFRESH_TOKEN_KEY);
  }

  private _save(key: string, token: string) {
    this.storageService.clearByKey(key);
    this.storageService.saveByKey(key, token);
  }

}

export interface JwtToken {
  token_type: string;
  access_token: string;
  refresh_token: string;
  scope: string;
  expires_in: number;
}
