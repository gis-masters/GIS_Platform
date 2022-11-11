import { observable, action, computed, makeObservable } from 'mobx';

import { currentUser } from './CurrentUser.store';

export interface OrgSettings {
  id: string;
  name?: string;
  system?: Record<string, boolean>;
  organization?: Record<string, boolean>;
}

export class OrganizationSettings {
  private static _instance: OrganizationSettings;

  @observable settingsError: boolean;
  @observable orgSettings: OrgSettings;
  @observable systemSettings: OrgSettings[];
  @observable availableOrgsSettings: Record<string, string>;

  static get instance(): OrganizationSettings {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    makeObservable(this);
  }

  @action
  setSettings(settings?: OrgSettings | OrgSettings[]): void {
    if (Array.isArray(settings)) {
      this.systemSettings = settings;
    } else {
      this.orgSettings = settings;
    }
    this.setSettingsError(false);
  }

  @action
  setAvailableSettings(settings?: Record<string, string>): void {
    this.availableOrgsSettings = settings;
    this.setSettingsError(false);
  }

  @action
  setSettingsError(isError: boolean): void {
    this.settingsError = isError;
  }

  @computed
  get createProject(): boolean {
    return this.allowedToUse(this.orgSettings.system?.createProject, this.orgSettings.organization?.createProject);
  }

  @computed
  get dataManagement(): boolean {
    return this.allowedToUse(this.orgSettings.system?.dataManagement, this.orgSettings.organization?.dataManagement);
  }

  @computed
  get editProjectLayer(): boolean {
    return this.allowedToUse(
      this.orgSettings.system?.editProjectLayer,
      this.orgSettings.organization?.editProjectLayer
    );
  }

  @computed
  get createLibraryItem(): boolean {
    return this.allowedToUse(
      this.orgSettings.system?.createLibraryItem,
      this.orgSettings.organization?.createLibraryItem
    );
  }

  @computed
  get downloadFiles(): boolean {
    return this.allowedToUse(this.orgSettings.system?.downloadFiles, this.orgSettings.organization?.downloadFiles);
  }

  @computed
  get downloadXml(): boolean {
    return this.allowedToUse(this.orgSettings.system?.downloadXml, this.orgSettings.organization?.downloadXml);
  }

  @computed
  get SEDDialog(): boolean {
    return this.allowedToUse(this.orgSettings.system?.sedDialog, this.orgSettings.organization?.sedDialog);
  }

  private allowedToUse(systemSetting: boolean, orgSetting: boolean): boolean {
    const setting = systemSetting ? orgSetting : systemSetting;

    return currentUser.isAdmin || setting;
  }
}

export const organizationSettings = OrganizationSettings.instance;
