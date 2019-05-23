import {Injectable} from '@angular/core';
import {LocalStorageService} from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  private ACCESS_TOKEN_KEY = 'accessToken';
  private REFRESH_TOKEN_KEY = 'refreshToken';
  private AUTH_MODEL = 'authModel';

  constructor(private storageService: LocalStorageService) {
  }

  signOut() {
    this.storageService.cleanUp();
  }

  saveAuthModel(authModel: AuthModel) {
    authModel.created_in = Date.now();

    this.storageService.saveByKey(this.AUTH_MODEL, JSON.stringify(authModel));
  }

  getAuthModel(): AuthModel {
    return JSON.parse(this.storageService.getByKey(this.AUTH_MODEL));
  }

  saveAccessToken(token: string) {
    this.saveToken(this.ACCESS_TOKEN_KEY, token);
  }

  saveRefreshToken(token: string) {
    this.saveToken(this.REFRESH_TOKEN_KEY, token);
  }

  getAccessToken(): string {
    return this.storageService.getByKey(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string {
    return this.storageService.getByKey(this.REFRESH_TOKEN_KEY);
  }

  private saveToken(key: string, token: string) {
    this.storageService.clearByKey(key);
    this.storageService.saveByKey(key, token);
  }

}

export interface AuthModel {
  access_token: string;
  expires_in: number;
  created_in?: number;
  jti: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}
