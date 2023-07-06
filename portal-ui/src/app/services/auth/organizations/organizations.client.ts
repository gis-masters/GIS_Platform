import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { OrgSettings } from '../../../stores/OrganizationSettings.store';

@boundClass
class OrganizationsClient extends Client {
  private static _instance: OrganizationsClient;

  static get instance(): OrganizationsClient {
    return this._instance || (this._instance = new this());
  }

  private getOrganizationsUrl(): string {
    return this.getBaseUrl() + '/organizations';
  }

  private getOrganizationUrl(orgId: number): string {
    return this.getOrganizationsUrl() + `/${orgId}`;
  }

  private getOrganizationsSettingsUrl(): string {
    return this.getOrganizationsUrl() + '/settings';
  }

  private getOrganizationsKnownSettingsUrl(): string {
    return this.getOrganizationsUrl() + '/known-settings';
  }

  async getOrganizationSettings(): Promise<OrgSettings> {
    return http.get<OrgSettings>(this.getOrganizationsSettingsUrl());
  }

  async getOrganizationKnownSettings(): Promise<Record<string, string>> {
    return http.get<Record<string, string>>(this.getOrganizationsKnownSettingsUrl());
  }

  async setOrganizationSettings(settings: OrgSettings): Promise<void> {
    return http.patch(this.getOrganizationsSettingsUrl(), settings);
  }

  async deleteOrganization(orgId: number): Promise<void> {
    return http.delete(this.getOrganizationUrl(orgId));
  }
}

export const organizationsClient = OrganizationsClient.instance;
