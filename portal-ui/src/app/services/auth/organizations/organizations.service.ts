import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { Toast } from '../../../components/Toast/Toast';
import { CompositeSettings, organizationSettings } from '../../../stores/OrganizationSettings.store';
import { schemaService } from '../../data/schema/schema.service';
import { organizationsClient } from './organizations.client';

class OrganizationsService {
  private static _instance: OrganizationsService;

  async loadSettings() {
    try {
      const settings = await organizationsClient.getOrganizationSettings();
      organizationSettings.setSettings(settings);

      const settingSchema = await schemaService.getSchemaAtUrl(organizationsClient.getOrganizationsSettingsSchemaUrl());

      organizationSettings.setSchema(settingSchema);
    } catch (error) {
      organizationSettings.setSettingsError(true);
      const err = error as AxiosError<{ status: string; message: string }>;
      Toast.error({
        message: 'Ошибка получения настроек приложения',
        details: `Error: ${err?.response?.data?.message}. Status: ${err?.response?.data?.status}`
      });
    }
  }

  async setOrganizationSettings(settings: CompositeSettings): Promise<void> {
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

  static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const organizationsService = OrganizationsService.instance;
