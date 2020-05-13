import { localStorageService } from './local-storage.service';

export interface JwtToken {
  token_type: string;
  access_token: string;
  refresh_token: string;
  scope: string;
  expires_in: number;
}

class TokenStorageService {
  private static _instance: TokenStorageService;

  private ACCESS_TOKEN_KEY = 'accessToken';
  private REFRESH_TOKEN_KEY = 'refreshToken';
  private JWT_TOKEN = 'jwtToken';

  signOut() {
    localStorageService.cleanUp();
  }

  saveToken(jwtToken: JwtToken) {
    this._save(this.JWT_TOKEN, JSON.stringify(jwtToken));
    this._save(this.ACCESS_TOKEN_KEY, jwtToken.access_token);
    this._save(this.REFRESH_TOKEN_KEY, jwtToken.refresh_token);
  }

  getToken(): JwtToken {
    return JSON.parse(localStorageService.getByKey(this.JWT_TOKEN));
  }

  getAccessToken(): string {
    return localStorageService.getByKey(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string {
    return localStorageService.getByKey(this.REFRESH_TOKEN_KEY);
  }

  private _save(key: string, token: string) {
    localStorageService.clearByKey(key);
    localStorageService.saveByKey(key, token);
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() { }

}

export const tokenStorageService = TokenStorageService.instance;
