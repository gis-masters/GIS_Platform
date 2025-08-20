import { action, computed, makeObservable, observable } from 'mobx';

import { Settings } from '../../server-types/common-contracts';
import { OccupiedStorage } from '../services/auth/organizations/organizations.models';
import { Projection } from '../services/data/projections/projections.models';
import { Schema } from '../services/data/schema/schema.models';

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
  static get instance(): OrganizationSettings {
    return this._instance || (this._instance = new this());
  }

  @observable settingsError?: boolean;
  @observable orgSettings?: CompositeSettings;
  @observable systemSettings?: CompositeSettings[];
  @observable schema?: Schema;
  @observable occupiedStorage?: OccupiedStorage;

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

  @action
  setOccupiedStorage(occupiedStorage: OccupiedStorage): void {
    this.occupiedStorage = occupiedStorage;
  }

  @computed
  get occupiedStorageInfo(): OccupiedStorage | undefined {
    return this.occupiedStorage;
  }

  @computed
  get systemSettingsInfo(): CompositeSettings[] | undefined {
    return this.systemSettings;
  }

  @computed
  get createProject(): boolean {
    return this.allowedToUse(
      !!this.orgSettings?.system?.createProject,
      !!this.orgSettings?.organization?.createProject
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
  get viewDocumentLibrary(): boolean {
    return this.allowedToUse(
      !!this.orgSettings?.system?.viewDocumentLibrary,
      !!this.orgSettings?.organization?.viewDocumentLibrary
    );
  }

  @computed
  get showPermissions(): boolean {
    return this.allowedToUse(
      !!this.orgSettings?.system?.showPermissions,
      !!this.orgSettings?.organization?.showPermissions
    );
  }

  @computed
  get viewBugReport(): boolean {
    return this.allowedToUse(
      !!this.orgSettings?.system?.viewBugReport,
      !!this.orgSettings?.organization?.viewBugReport
    );
  }

  @computed
  get viewServicesCalculator(): boolean {
    return this.allowedToUse(
      !!this.orgSettings?.system?.viewServicesCalculator,
      !!this.orgSettings?.organization?.viewServicesCalculator
    );
  }

  @computed
  get importShp(): boolean {
    return this.allowedToUse(!!this.orgSettings?.system?.importShp, !!this.orgSettings?.organization?.importShp);
  }

  @computed
  get downloadGml(): boolean {
    return this.allowedToUse(!!this.orgSettings?.system?.downloadGml, !!this.orgSettings?.organization?.downloadGml);
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
  get reestrs(): boolean {
    return this.allowedToUse(!!this.orgSettings?.system?.reestrs, !!this.orgSettings?.organization?.reestrs);
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

    return Boolean(setting);
  }
}

export const organizationSettings = OrganizationSettings.instance;
