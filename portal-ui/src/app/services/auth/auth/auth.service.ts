import { AxiosError } from 'axios';

import { getEnvironment } from '../../environment';
import { http } from '../../api/http.service';

import { _reqAuthenticate, _reqChangePassword, _reqLogout, _reqRegistration, _reqRestorePassword } from './auth.client';
import { AuthCredentials, AuthenticationResult, RegData } from './auth.models';

http.axios.interceptors.request.use(config => {
  if (authService.token) {
    config.headers.Authorization = 'Bearer ' + authService.token;
  }

  return config;
});

http.axios.interceptors.response.use(
  value => value,
  (e: AxiosError) => {
    throw e.toJSON ? { ...e.toJSON(), response: e.response } : e;
  }
);

const TOKEN_KEY = 'crgAuthToken';

class AuthService {
  private static _instance: AuthService;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  token?: string;

  private constructor() {
    this.token = localStorage.getItem(TOKEN_KEY);
  }

  async authenticate(credentials: AuthCredentials): Promise<AuthenticationResult> {
    try {
      const result = await _reqAuthenticate(credentials);

      if (Array.isArray(result)) {
        return { ok: false, organizations: result };
      }

      const environment = await getEnvironment();
      const sameOrigin =
        (!environment.server.host || environment.server.host === location.hostname) &&
        (!environment.server.port || environment.server.port === location.port) &&
        (!environment.server.wsPort || environment.server.wsPort === location.port);

      if (!sameOrigin) {
        this.token = result;
        localStorage.setItem(TOKEN_KEY, this.token);
      } else {
        delete this.token;
        localStorage.removeItem(TOKEN_KEY);
      }

      return { ok: true };
    } catch (error) {
      return (error as AxiosError).response?.status === 401
        ? { ok: false, wrongPassword: true }
        : { ok: false, userDisabled: true };
    }
  }

  async logout() {
    await _reqLogout();
    localStorage.removeItem(TOKEN_KEY);
    location.href = '/';
  }

  // TODO: Создание новой орг в модуле аутентификации???
  async registration(regData: RegData): Promise<void> {
    await _reqRegistration(regData);
  }

  async restorePassword(email: string) {
    await _reqRestorePassword(email, location.origin);
  }

  async changePassword(token: string, password: string) {
    await _reqChangePassword(token, password);
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      await _reqChangePassword(token);

      return false;
    } catch (error) {
      const err = error as AxiosError;

      return Number(err.status) === 404;
    }
  }
}

export const authService = AuthService.instance;

// for autotests
if (typeof window !== 'undefined') {
  Object.assign(window, { authService });
}
