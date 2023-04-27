import { action, makeObservable, observable, reaction } from 'mobx';

import { Pages, route } from './Route.store';
import { CrgLayer, CrgVectorLayer } from '../services/gis/layers/layers.models';
import { FilterQuery } from '../services/util/filterObjects';

export enum FilterBySelection {
  ONLY_SELECTED = 'selected',
  ONLY_NOT_SELECTED = 'notSelected',
  DISABLED = 'disabled'
}

const defaultValues: Partial<AttributesTableStore> = {};

class AttributesTableStore {
  @observable filter: { [tableName: string]: FilterQuery } = {};
  @observable filterDisabled: { [tableName: string]: true } = {};

  private static _instance: AttributesTableStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    makeObservable(this);

    this.reset();

    reaction(
      () => route.data && route.data.page,
      page => {
        if (page !== Pages.MAP) {
          this.reset();
        }
      }
    );
  }

  isLayerFilterExist(layer: CrgLayer): boolean {
    return !!this.filter[layer.tableName];
  }

  isLayerFiltered(layer: CrgLayer) {
    return !!this.filter[layer.tableName] && this.isLayerFilterEnabled(layer);
  }

  isLayerFilterEnabled(layerOrTableName: CrgLayer | string): boolean {
    const tableName = typeof layerOrTableName === 'string' ? layerOrTableName : layerOrTableName.tableName;

    return !this.filterDisabled[tableName];
  }

  getLayerFilter(layerOrTableName: CrgVectorLayer | string, considerEnabledness = false): FilterQuery {
    const tableName = typeof layerOrTableName === 'string' ? layerOrTableName : layerOrTableName.tableName;

    if (considerEnabledness && !this.isLayerFilterEnabled(tableName)) {
      return {};
    }

    return attributesTableStore.filter[tableName] || {};
  }

  @action
  updateFilter(layer: CrgVectorLayer, filter?: FilterQuery) {
    if (filter) {
      this.filter[layer.tableName] = filter;
    } else {
      delete this.filter[layer.tableName];
    }
  }

  @action
  private reset() {
    Object.assign(this, defaultValues);
  }

  @action
  setFilterEnablednessForLayer(layer: CrgVectorLayer, enabled: boolean) {
    if (enabled) {
      delete this.filterDisabled[layer.tableName];
    } else {
      this.filterDisabled[layer.tableName] = true;
    }
  }
}

export const attributesTableStore = AttributesTableStore.instance;

// for autotests
if (typeof window !== undefined) {
  Object.assign(window, { attributesTableStore });
}
