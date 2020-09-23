import axios, { AxiosError } from 'axios';

import { serverProperties } from './server-properties.service';
import { usersService } from './crg/users.service';
import { services } from './services';
import { http } from './http.service';

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

interface AuthenticationResult {
  ok: boolean;
  userDisabled?: boolean;
  wrongPassword?: boolean;
}

axios.interceptors.request.use(config => {
  config.headers.Authorization = 'Bearer ' + authService.token;

  return config;
});

axios.interceptors.response.use(
  value => value,
  async (e: AxiosError) => {
    const err = e.toJSON ? { ...e.toJSON(), response: e.response } : e;

    if (
      e.response &&
      e.response.status === 401 &&
      !(e.config && e.config.url === (await serverProperties.authServerUrl)) &&
      !(e.config && e.config.url === (await serverProperties.usersUrl) + '/current')
    ) {
      await authService.logout();
    }

    throw err;
  }
);

const TOKEN_KEY = 'crgAuthToken';

class AuthService {
  private static _instance: AuthService;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  token: string;

  private constructor() {
    this.token = localStorage.getItem(TOKEN_KEY);
  }

  async authenticate(credentials: AuthCredentials): Promise<AuthenticationResult> {
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    params.append('grant_type', 'password');

    const headers = {
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
    };

    const options = { withCredentials: true, headers };
    const url = await serverProperties.authServerUrl;
    try {
      this.token = await http.post(url, params.toString(), options);
      localStorage.setItem(TOKEN_KEY, this.token);
      await usersService.fetchCurrent();

      return { ok: true };
    } catch (e) {
      if (e.response && e.response.status === 401) {
        return { ok: false, wrongPassword: true };
      } else {
        return { ok: false, userDisabled: true };
      }
    }
  }

  async logout() {
    const baseUrl = await serverProperties.baseUrl;
    await http.post(baseUrl + '/perform_logout', {}, { withCredentials: true });
    this.token = '';
    localStorage.removeItem(TOKEN_KEY);
    usersService.dropCurrent();
    services.ngZone.run(() => {
      services.router.navigate(['/']);
    });
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

    return http.post(url + '/init', payload);
  }
}

export const authService = AuthService.instance;
