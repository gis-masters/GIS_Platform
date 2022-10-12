import { AxiosError } from 'axios';
import { boundMethod } from 'autobind-decorator';

import { http } from './http.service';

import { Toast } from '../components/Toast/Toast';
import { getOrganizationSettingsUrl } from './server-urls.service';
import { organizationSettings, Settings } from '../stores/OrganizationSettings.store';

class OrganizationSettingsService {
  private static _instance: OrganizationSettingsService;
  private promise: Promise<Settings>;

  private resolve: (value?: Settings) => void;
  private reject: () => void;

  private constructor() {
    this.promise = new Promise(this.promiseHandler);
  }

  @boundMethod
  private promiseHandler(resolve: (value: Settings) => void, reject: () => void) {
    this.resolve = resolve;
    this.reject = reject;
  }

  async fetch() {
    try {
      const settings = await http.get<Settings>(await getOrganizationSettingsUrl());
      organizationSettings.setSettings(settings);
      this.resolve();
    } catch (error) {
      organizationSettings.setSettingsError(true);
      const err = error as AxiosError<{ status: string; message: string }>;
      Toast.error({
        message: 'Ошибка получения настроек приложения',
        details: `Error: ${err?.response?.data?.message}. Status: ${err?.response?.data?.status}`
      });
      this.reject();
    }
  }

  async setOrganizationSettings(settings: Settings): Promise<void> {
    await http.patch<Settings>(await getOrganizationSettingsUrl(), settings);

    organizationSettings.setSettings(settings);
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const organizationSettingsService = OrganizationSettingsService.instance;
