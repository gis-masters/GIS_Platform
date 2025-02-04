import { AxiosError } from 'axios';

import { http } from '../../api/http.service';
import { environment } from '../../environment';
import { authClient } from './auth.client';
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
    this.token = localStorage.getItem(TOKEN_KEY) || undefined;
  }

  async authenticate(credentials: AuthCredentials): Promise<AuthenticationResult> {
    try {
      const result = await authClient.authenticate(credentials);

      if (Array.isArray(result)) {
        return { ok: false, organizations: result };
      }

      const sameOrigin =
        (!environment.server.host || environment.server.host === location.hostname) &&
        (!environment.server.port || environment.server.port === location.port) &&
        (!environment.server.wsPort || environment.server.wsPort === location.port);

      if (sameOrigin) {
        delete this.token;
        localStorage.removeItem(TOKEN_KEY);
      } else {
        this.token = result;
        localStorage.setItem(TOKEN_KEY, this.token);
      }

      return { ok: true };
    } catch (error) {
      return (error as AxiosError).response?.status === 401
        ? { ok: false, wrongPassword: true }
        : { ok: false, userDisabled: true };
    }
  }

  async logout(url = '/') {
    await authClient.logout();
    localStorage.removeItem(TOKEN_KEY);
    location.href = url;
  }

  // TODO: Создание новой орг в модуле аутентификации???
  async registration(regData: RegData): Promise<void> {
    await authClient.registration(regData);
  }

  async restorePassword(email: string) {
    await authClient.restorePassword(email, location.origin);
  }

  async changePassword(token: string, password: string) {
    await authClient.changePassword(token, password);
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      await authClient.changePassword(token);

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
