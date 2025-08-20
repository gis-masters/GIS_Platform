import { action, computed, makeObservable, observable } from 'mobx';

import { Projection } from '../services/data/projections/projections.models';
import { mapToProjections } from '../services/util/projectionMapper';
import { organizationSettings } from './OrganizationSettings.store';

class ProjectionsStore {
  private static _instance: ProjectionsStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable olProjection?: Projection;

  constructor() {
    makeObservable(this);
  }

  @computed
  get defaultProjection(): Projection | undefined {
    const defaultProjectionTitle = organizationSettings.orgSettings?.organization?.default_epsg;

    return this.favoriteProjections?.find(({ title }) => title === defaultProjectionTitle);
  }

  @computed
  get favoriteProjections(): Projection[] {
    return mapToProjections(organizationSettings.orgSettings?.organization?.favorites_epsg);
  }

  @action
  setOlProjection(projection: Projection): void {
    this.olProjection = projection;
  }
}

export const projectionsStore = ProjectionsStore.instance;
