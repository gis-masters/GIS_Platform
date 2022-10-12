import { observable, action, computed, makeObservable } from 'mobx';

import { currentUser } from './CurrentUser.store';

export interface Settings {
  createProject: boolean;
  dataManagement: boolean;
  editProjectLayer: boolean;
  createLibraryItem: boolean;
  downloadFiles: boolean;
  downloadXml: boolean;
}

const emptySettings: Settings = {
  createProject: false,
  dataManagement: false,
  editProjectLayer: false,
  createLibraryItem: false,
  downloadFiles: false,
  downloadXml: false
};

export class OrganizationSettings implements Settings {
  private static _instance: OrganizationSettings;

  @observable settingsError: boolean;
  @observable settings: Settings = emptySettings;

  public static get instance(): OrganizationSettings {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    makeObservable(this);
  }

  @action
  setSettings(settings?: Settings): void {
    this.settings = settings;
    this.setSettingsError(false);
  }

  @action
  setSettingsError(isError: boolean): void {
    this.settingsError = isError;
  }

  @computed
  get createProject(): boolean {
    return currentUser.isAdmin || this.settings.createProject;
  }

  @computed
  get dataManagement(): boolean {
    return currentUser.isAdmin || this.settings.dataManagement;
  }

  @computed
  get editProjectLayer(): boolean {
    return currentUser.isAdmin || this.settings.editProjectLayer;
  }

  @computed
  get createLibraryItem(): boolean {
    return currentUser.isAdmin || this.settings.createLibraryItem;
  }

  @computed
  get downloadFiles(): boolean {
    return currentUser.isAdmin || this.settings.downloadFiles;
  }

  @computed
  get downloadXml(): boolean {
    return currentUser.isAdmin || this.settings.downloadXml;
  }
}

export const organizationSettings = OrganizationSettings.instance;
