import { observable, action, computed } from 'mobx';

import { currentUser } from './CurrentUser.store';

export interface Settings {
  createProjectEnabled: boolean;
  dataManagementEnabled: boolean;
  editProjectLayersEnabled: boolean;
  createLibraryItemsEnabled: boolean;
  fileDownloadEnabled: boolean;
  downloadXmlGeometryEnabled: boolean;
}

const emptySettings: Settings = {
  createProjectEnabled: false,
  dataManagementEnabled: false,
  editProjectLayersEnabled: false,
  createLibraryItemsEnabled: false,
  fileDownloadEnabled: false,
  downloadXmlGeometryEnabled: false
};

export class OrganizationSettings implements Settings {
  private static _instance: OrganizationSettings;

  @observable settingsError: boolean;
  @observable settings: Settings = emptySettings;

  public static get instance(): OrganizationSettings {
    return this._instance || (this._instance = new this());
  }

  private constructor() {}

  @action
  setSettings(settings?: Settings): void {
    this.settings = settings;
    this.setSettingsError(false);
  }

  @action
  setSettingsError(emptySettings: boolean): void {
    this.settingsError = emptySettings;
  }

  @computed
  get createProjectEnabled(): boolean {
    return currentUser.isAdmin || this.settings.createProjectEnabled;
  }

  @computed
  get dataManagementEnabled(): boolean {
    return currentUser.isAdmin || this.settings.dataManagementEnabled;
  }

  @computed
  get editProjectLayersEnabled(): boolean {
    return currentUser.isAdmin || this.settings.editProjectLayersEnabled;
  }

  @computed
  get createLibraryItemsEnabled(): boolean {
    return currentUser.isAdmin || this.settings.createLibraryItemsEnabled;
  }

  @computed
  get fileDownloadEnabled(): boolean {
    return currentUser.isAdmin || this.settings.fileDownloadEnabled;
  }

  @computed
  get downloadXmlGeometryEnabled(): boolean {
    return currentUser.isAdmin || this.settings.downloadXmlGeometryEnabled;
  }
}

export const organizationSettings = OrganizationSettings.instance;
