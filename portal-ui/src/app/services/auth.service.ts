import axios, { AxiosError } from 'axios';

import { getAuthUrl, getLogoutUrl, getOrganizationsUrl, getUserUrl } from './server-urls.service';
import { communicationService } from './communication.service';
import { usersService } from './crg/users.service';
import { getEnvironment } from './environment';
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
  if (authService.token) {
    config.headers.Authorization = 'Bearer ' + authService.token;
  }

  return config;
});

axios.interceptors.response.use(
  value => value,
  async (e: AxiosError) => {
    const err = e.toJSON ? { ...e.toJSON(), response: e.response } : e;

    if (
      e.response?.status === 401 &&
      !(e.config?.url === (await getAuthUrl())) &&
      !(e.config?.url === (await getUserUrl('current')))
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
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
    };

    const options = { withCredentials: true, headers };
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

      await usersService.fetchCurrentUser();

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
    await http.post(await getLogoutUrl(), {}, { withCredentials: true });
    this.token = '';
    localStorage.removeItem(TOKEN_KEY);
    services.ngZone.run(() => {
      services.router.navigate(['/']);
    });
    communicationService.logout.emit();
  }

  // TODO: Создание новой орг в модуле аутентификации???
  async registration(regData: RegData): Promise<{}> {
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
}

export const authService = AuthService.instance;
