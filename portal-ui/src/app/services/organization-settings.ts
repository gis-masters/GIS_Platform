import { AxiosError } from 'axios';
import { boundMethod } from 'autobind-decorator';

import { getOrganizationKnownSettingsUrl, getOrganizationSettingsUrl } from './server-urls.service';
import { organizationSettings, OrgSettings } from '../stores/OrganizationSettings.store';
import { PropertyType, Schema } from './data/schema/schema.models';
import { Toast } from '../components/Toast/Toast';
import { http } from './http.service';

class OrganizationSettingsService {
  private static _instance: OrganizationSettingsService;
  private promise: Promise<OrgSettings>;

  private resolve: (value?: OrgSettings) => void;
  private reject: () => void;

  private constructor() {
    this.promise = new Promise(this.promiseHandler);
  }

  @boundMethod
  private promiseHandler(resolve: (value: OrgSettings) => void, reject: () => void) {
    this.resolve = resolve;
    this.reject = reject;
  }

  async fetch() {
    try {
      const settings = await http.get<OrgSettings>(await getOrganizationSettingsUrl());
      organizationSettings.setSettings(settings);

      const availableSettings = await http.get<Record<string, string>>(await getOrganizationKnownSettingsUrl());
      organizationSettings.setAvailableSettings(availableSettings);
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

  async setOrganizationSettings(settings: OrgSettings): Promise<void> {
    await http.patch<OrgSettings>(await getOrganizationSettingsUrl(), settings);
    await this.fetch();
  }

  orgSchema(settings: Record<string, boolean>, systemManagement: boolean): Schema {
    const settingsKeys = Object.keys(settings);

    return {
      properties: settingsKeys.map(item => {
        if (organizationSettings.availableOrgsSettings[item]) {
          return {
            name: item,
            title: organizationSettings.availableOrgsSettings[item],
            propertyType: PropertyType.BOOL,
            hidden: systemManagement ? false : !organizationSettings.orgSettings?.system[item]
          };
        }
      })
    };
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const organizationSettingsService = OrganizationSettingsService.instance;
