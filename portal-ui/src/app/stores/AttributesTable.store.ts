import { action, makeObservable, observable, reaction } from 'mobx';

import { FILTER_BY_SELECTION } from '../components/Attributes/Attributes.models';
import { CrgLayer, CrgVectorLayer } from '../services/gis/layers/layers.models';
import { modifyFieldFilterValue } from '../services/util/filters/filters';
import { FilterQuery } from '../services/util/filters/filters.models';
import { Pages, route } from './Route.store';

const errorMessage = 'Отсутствует имя таблицы';
const defaultValues: Partial<AttributesTableStore> = {};

class AttributesTableStore {
  private static _instance: AttributesTableStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable filter: Record<string, FilterQuery> = {};
  @observable filterDisabled: Record<string, true> = {};

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
    if (!layer.tableName) {
      throw new Error(errorMessage);
    }

    return !!this.filter[layer.tableName];
  }

  isLayerFiltered(layer: CrgLayer): boolean {
    return this.isLayerFilterExist(layer) && this.isLayerFilterEnabled(layer.tableName);
  }

  isLayerFilterEnabled(tableName: string | undefined): boolean {
    if (!tableName) {
      throw new Error(errorMessage);
    }

    return !this.filterDisabled[tableName];
  }

  getLayerFilter(tableName: string, considerEnabledness = false): FilterQuery {
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

  @action
  dropFilterBySelections(layerTableName: string): void {
    modifyFieldFilterValue(this.filter[layerTableName], FILTER_BY_SELECTION);
  }
}

export const attributesTableStore = AttributesTableStore.instance;

// for autotests
if (typeof window !== 'undefined') {
  Object.assign(window, { attributesTableStore });
}
