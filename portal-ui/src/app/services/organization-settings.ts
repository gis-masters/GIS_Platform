import { AxiosError } from 'axios';
import { boundMethod } from 'autobind-decorator';

import { OrganizationSettings, organizationSettings, Settings } from '../stores/OrganizationSettings.store';
import { getOrganizationSettingsUrl } from './server-urls.service';
import { Toast } from '../components/Toast/Toast';
import { http } from './http.service';

class OrganizationSettingsService {
  private static _instance: OrganizationSettingsService;
  private promise: Promise<Settings> = new Promise(this.promiseHandler);

  private resolve: (value?: Settings) => void;
  private reject: () => void;

  private constructor() {}

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

  async getOrganizationSettings(): Promise<OrganizationSettings> {
    await this.promise;

    return organizationSettings;
  }

  async setOrganizationSettings(settings: Settings): Promise<void> {
    await http.put<Settings>(await getOrganizationSettingsUrl(), settings);

    organizationSettings.setSettings(settings);
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const organizationSettingsService = OrganizationSettingsService.instance;
