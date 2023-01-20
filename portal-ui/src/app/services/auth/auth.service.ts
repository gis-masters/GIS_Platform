import { AxiosError } from 'axios';

import {
  getAuthUrl,
  getChangePasswordUrl,
  getLogoutUrl,
  getOrganizationsUrl,
  getRestorePasswordUrl
} from '../server-urls.service';
import { communicationService } from '../communication.service';
import { getEnvironment } from '../environment';
import { services } from '../services';
import { http } from '../http.service';
import { Mime } from '../util/Mime';

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
  enabled?: boolean;
}

export interface AuthenticationResult {
  ok: boolean;
  userDisabled?: boolean;
  wrongPassword?: boolean;
}

http.axios.interceptors.request.use((config: { headers: Record<string, string> }) => {
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
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    params.append('grant_type', 'password');

    const headers = {
      'Content-Type': Mime.FORM_URLENCODED
    };

    const options = { withCredentials: true, isAuthenticate: true, headers };
    const authUrl = await getAuthUrl();
    try {
      const environment = await getEnvironment();
      const sameOrigin =
        (!environment.server.host || environment.server.host === location.hostname) &&
        (!environment.server.port || environment.server.port === location.port) &&
        (!environment.server.wsPort || environment.server.wsPort === location.port);

      const token = await http.post<string>(authUrl, params.toString(), options);
      if (!sameOrigin) {
        this.token = token;
        localStorage.setItem(TOKEN_KEY, token);
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
    await http.post(await getLogoutUrl(), {}, { withCredentials: true });
    this.token = '';
    localStorage.removeItem(TOKEN_KEY);
    http.cache.clear();
    services.ngZone.run(() => {
      void services.router.navigate(['/']);
    });
    communicationService.logout.emit();
  }

  // TODO: Создание новой орг в модуле аутентификации???
  async registration(regData: RegData): Promise<void> {
    const url = await getOrganizationsUrl();
    const payload = {
      name: regData.company,
      phone: regData.contactPhone,
      owner: {
        name: regData.firstName,
        surname: regData.lastName,
        email: regData.email,
        password: regData.password
      }
    };

    return http.post(url + '/init', payload);
  }

  async restorePassword(email: string, originHost: string) {
    const url = await getRestorePasswordUrl();

    return http.post(url, { email, originHost });
  }

  async changePassword(password: string, token: string) {
    const url = await getChangePasswordUrl();

    return http.post(url, { password, token });
  }

  async checkIsTokenExpired(token: string) {
    const params = { token };

    return http.get(await getChangePasswordUrl(), { params });
  }
}

export const authService = AuthService.instance;

// for autotests
Object.assign(window, { authService });
