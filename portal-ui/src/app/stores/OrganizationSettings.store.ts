import { action, computed, makeObservable, observable } from 'mobx';

import { Settings } from '../../server-types/common-contracts';
import { Projection } from '../services/data/projections/projections.models';
import { Schema } from '../services/data/schema/schema.models';
import { currentUser } from './CurrentUser.store';

export interface OrgSettings extends Settings {
  favorites_epsg: Projection[] | string[];
  default_epsg: string;
}

export interface CompositeSettings {
  id: number;
  name?: string;
  system?: OrgSettings;
  settings?: OrgSettings;
  organization?: OrgSettings;
}

export class OrganizationSettings {
  private static _instance: OrganizationSettings;

  @observable settingsError?: boolean;
  @observable orgSettings?: CompositeSettings;
  @observable systemSettings?: CompositeSettings[];
  @observable schema?: Schema;

  static get instance(): OrganizationSettings {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    makeObservable(this);
  }

  @action
  setSettings(settings?: CompositeSettings | CompositeSettings[]): void {
    if (Array.isArray(settings)) {
      this.systemSettings = settings;
    } else {
      this.orgSettings = settings;
    }

    this.setSettingsError(false);
  }

  @action
  setSchema(schema?: Schema): void {
    this.schema = schema;
    this.setSettingsError(false);
  }

  @action
  setSettingsError(isError: boolean): void {
    this.settingsError = isError;
  }

  @computed
  get createProject(): boolean {
    return this.allowedToUse(
      !!this.orgSettings?.system?.createProject,
      !!this.orgSettings?.organization?.createProject
    );
  }

  @computed
  get dataManagement(): boolean {
    return this.allowedToUse(
      !!this.orgSettings?.system?.dataManagement,
      !!this.orgSettings?.organization?.dataManagement
    );
  }

  @computed
  get editProjectLayer(): boolean {
    return this.allowedToUse(
      !!this.orgSettings?.system?.editProjectLayer,
      !!this.orgSettings?.organization?.editProjectLayer
    );
  }

  @computed
  get taskManagement(): boolean {
    return this.allowedToUse(
      !!this.orgSettings?.system?.taskManagement,
      !!this.orgSettings?.organization?.taskManagement
    );
  }

  @computed
  get createLibraryItem(): boolean {
    return this.allowedToUse(
      !!this.orgSettings?.system?.createLibraryItem,
      !!this.orgSettings?.organization?.createLibraryItem
    );
  }

  @computed
  get downloadFiles(): boolean {
    return this.allowedToUse(
      !!this.orgSettings?.system?.downloadFiles,
      !!this.orgSettings?.organization?.downloadFiles
    );
  }

  @computed
  get downloadXml(): boolean {
    return this.allowedToUse(!!this.orgSettings?.system?.downloadXml, !!this.orgSettings?.organization?.downloadXml);
  }

  @computed
  get sedDialog(): boolean {
    return Boolean(this.orgSettings?.system?.sedDialog && this.orgSettings?.organization?.sedDialog);
  }

  private allowedToUse(systemSetting?: boolean, orgSetting?: boolean): boolean {
    const setting = systemSetting && orgSetting;

    return Boolean(currentUser.isAdmin || setting);
  }
}

export const organizationSettings = OrganizationSettings.instance;
