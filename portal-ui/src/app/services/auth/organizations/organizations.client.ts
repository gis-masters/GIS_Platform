import { boundClass } from 'autobind-decorator';

import { CompositeSettings } from '../../../stores/OrganizationSettings.store';
import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { OccupiedStorage, Organization } from './organizations.models';

@boundClass
class OrganizationsClient extends Client {
  private static _instance: OrganizationsClient;
  static get instance(): OrganizationsClient {
    return this._instance || (this._instance = new this());
  }

  private getOrganizationsUrl(): string {
    return this.getBaseUrl() + '/organizations';
  }

  private getOrganizationsOccupiedStorage(): string {
    return this.getDataUrl() + '/storage/occupied';
  }

  private getOrganizationUrl(orgId: number): string {
    return this.getOrganizationsUrl() + `/${orgId}`;
  }

  private getOrganizationsSettingsUrl(): string {
    return this.getOrganizationsUrl() + '/settings';
  }

  getOrganizationsSettingsSchemaUrl(): string {
    return this.getOrganizationsSettingsUrl() + '/schema';
  }

  async getOrganizationSettings(): Promise<CompositeSettings> {
    return http.get<CompositeSettings>(this.getOrganizationsSettingsUrl());
  }

  async getOrganization(orgId: number): Promise<Organization> {
    return http.get<Organization>(this.getOrganizationUrl(orgId));
  }

  async updateOrganization(orgId: number, data: Partial<Organization>): Promise<Organization> {
    return http.patch<Organization>(this.getOrganizationUrl(orgId), data);
  }

  async setOrganizationSettings(settings: CompositeSettings): Promise<void> {
    return http.patch(this.getOrganizationsSettingsUrl(), settings);
  }

  async deleteOrganization(orgId: number): Promise<void> {
    return http.delete(this.getOrganizationUrl(orgId));
  }

  async getOrganizationOccupiedStorage(): Promise<OccupiedStorage> {
    return http.get<OccupiedStorage>(this.getOrganizationsOccupiedStorage());
  }
}

export const organizationsClient = OrganizationsClient.instance;
