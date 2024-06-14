import { action, computed, makeObservable, observable } from 'mobx';

import { isProjection, Projection } from '../services/data/projections/projections.models';
import { isStringArray } from '../services/util/typeGuards/isStringArray';
import { organizationSettings } from './OrganizationSettings.store';

class ProjectionsStore {
  @observable olProjection?: Projection;
  private static _instance: ProjectionsStore;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  constructor() {
    makeObservable(this);
  }

  @computed
  get defaultProjection(): Projection | undefined {
    let defaultProjection = organizationSettings.orgSettings?.organization?.default_epsg;
    defaultProjection = isStringArray(defaultProjection) ? defaultProjection[0] : defaultProjection;

    return this.favoriteProjections?.find(({ title }) => title === defaultProjection);
  }

  @computed
  get favoriteProjections(): Projection[] {
    const projection = organizationSettings.orgSettings?.organization?.favorites_epsg;

    if (isStringArray(projection)) {
      return projection.map(item => {
        try {
          const parsedItem = JSON.parse(item) as unknown;

          if (!isProjection(parsedItem)) {
            throw new Error('Система координат не является проекцией');
          }

          return parsedItem;
        } catch {
          throw new Error(`Не удалось "прочитать" систему координат + ${item}`);
        }
      });
    }

    return [];
  }

  @action
  setOlProjection(projection: Projection): void {
    this.olProjection = projection;
  }
}

export const projectionsStore = ProjectionsStore.instance;
