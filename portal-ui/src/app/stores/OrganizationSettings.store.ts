import { action, computed, makeObservable, observable } from 'mobx';

import { isProjection, Projection } from '../services/data/projection/projection.models';
import { Schema } from '../services/data/schema/schema.models';
import { isStringArray } from '../services/util/typeGuards/isStringArray';
import { currentUser } from './CurrentUser.store';

export interface Settings {
  createLibraryItem: boolean;
  createProject: boolean;
  dataManagement: boolean;
  downloadFiles: boolean;
  downloadXml: boolean;
  editProjectLayer: boolean;
  reestrs: boolean;
  sedDialog: boolean;
  taskManagement: boolean;
  favorites_epsg: Projection[] | string[];
  default_epsg: string;
  tags: string | string[];
}

export interface OrgSettings {
  id: number;
  name?: string;
  system?: Settings;
  settings?: Settings;
  organization?: Settings;
}

export class OrganizationSettings {
  private static _instance: OrganizationSettings;

  @observable settingsError?: boolean;
  @observable orgSettings?: OrgSettings;
  @observable systemSettings?: OrgSettings[];
  @observable schema?: Schema;

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
      const tags = settings?.organization?.tags;
      if (tags?.length && settings?.organization) {
        settings.organization.tags = tags;
      }
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
    return this.allowedToUse(this.orgSettings?.system?.createProject, this.orgSettings?.organization?.createProject);
  }

  @computed
  get dataManagement(): boolean {
    return this.allowedToUse(this.orgSettings?.system?.dataManagement, this.orgSettings?.organization?.dataManagement);
  }

  @computed
  get editProjectLayer(): boolean {
    return this.allowedToUse(
      this.orgSettings?.system?.editProjectLayer,
      this.orgSettings?.organization?.editProjectLayer
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
      this.orgSettings?.system?.createLibraryItem,
      this.orgSettings?.organization?.createLibraryItem
    );
  }

  @computed
  get downloadFiles(): boolean {
    return this.allowedToUse(this.orgSettings?.system?.downloadFiles, this.orgSettings?.organization?.downloadFiles);
  }

  @computed
  get downloadXml(): boolean {
    return this.allowedToUse(this.orgSettings?.system?.downloadXml, this.orgSettings?.organization?.downloadXml);
  }

  @computed
  get SEDDialog(): boolean {
    return Boolean(this.orgSettings?.system?.sedDialog && this.orgSettings?.organization?.sedDialog);
  }

  @computed
  get orgDefaultProjection(): Projection | undefined {
    const defaultProjection = organizationSettings.orgSettings?.organization?.default_epsg;

    return this.orgFavoriteProjections?.find(({ title }) => title === defaultProjection);
  }

  @computed
  get orgFavoriteProjections(): Projection[] {
    const projection = this.orgSettings?.organization?.favorites_epsg;

    if (isStringArray(projection)) {
      return projection.map(item => {
        try {
          const parsedItem = JSON.parse(item) as unknown;

          if (!isProjection(parsedItem)) {
            throw new Error('Ошибка при получении предпочитаемых систем координат');
          }

          return parsedItem;
        } catch {
          throw new Error('Ошибка при получении предпочитаемых систем координат');
        }
      });
    }

    return [];
  }

  private allowedToUse(systemSetting?: boolean, orgSetting?: boolean): boolean {
    const setting = systemSetting && orgSetting;

    return Boolean(currentUser.isAdmin || setting);
  }
}

export const organizationSettings = OrganizationSettings.instance;
