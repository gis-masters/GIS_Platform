import { AxiosError } from 'axios';
import { boundMethod } from 'autobind-decorator';

import { organizationSettings, OrgSettings } from '../../../stores/OrganizationSettings.store';
import { PropertySchema, PropertyType, SimpleSchema } from '../../data/schema/schema.models';
import { Toast } from '../../../components/Toast/Toast';

import { organizationsClient } from './organizations.client';
import { notFalsyFilter } from '../../util/NotFalsyFilter';

class OrganizationsService {
  private static _instance: OrganizationsService;

  async loadSettings() {
    try {
      const settings = await organizationsClient.getOrganizationSettings();
      organizationSettings.setSettings(settings);

      const availableSettings = await organizationsClient.getOrganizationKnownSettings();
      organizationSettings.setAvailableSettings(availableSettings);
    } catch (error) {
      organizationSettings.setSettingsError(true);
      const err = error as AxiosError<{ status: string; message: string }>;
      Toast.error({
        message: 'Ошибка получения настроек приложения',
        details: `Error: ${err?.response?.data?.message}. Status: ${err?.response?.data?.status}`
      });
    }
  }

  async setOrganizationSettings(settings: OrgSettings): Promise<void> {
    await organizationsClient.setOrganizationSettings(settings);
    await this.loadSettings();
  }

  async deleteOrganization(orgId: number): Promise<void> {
    await organizationsClient.deleteOrganization(orgId);
    await this.loadSettings();
  }

  @boundMethod
  async __clearAllTestOrganizations(): Promise<void> {
    if (organizationSettings.systemSettings) {
      for (const org of organizationSettings.systemSettings) {
        if (org.name?.startsWith('Hogwarts') || org.name?.startsWith('Другая организация')) {
          try {
            await this.deleteOrganization(org.id);
            // eslint-disable-next-line no-console
            console.log(`Тестовая организация "${org.name}" удалена`);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.log(`Ошибка удаления тестовой организации "${org.name}"`, error);
          }
        }
      }
    }
  }

  orgSchema(settings: Record<string, boolean>, systemManagement: boolean): SimpleSchema {
    const settingsKeys = Object.keys(settings);

    return {
      properties: settingsKeys
        .map((item): PropertySchema | undefined => {
          if (organizationSettings.availableOrgsSettings?.[item]) {
            return {
              name: item,
              title: organizationSettings.availableOrgsSettings[item],
              propertyType: PropertyType.BOOL,
              hidden: systemManagement ? false : !organizationSettings.orgSettings?.system?.[item]
            };
          }
        })
        .filter(notFalsyFilter)
    };
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const organizationsService = OrganizationsService.instance;
