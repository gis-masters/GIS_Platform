import { action, computed, makeObservable, observable, reaction } from 'mobx';
import sift from 'sift';

import { extractFeatureIdsFromAttributesFilter } from '../../../../components/Attributes/Attributes.utils';
import { attributesTableStore } from '../../../../stores/AttributesTable.store';
import { currentProject } from '../../../../stores/CurrentProject.store';
import { Pages, route } from '../../../../stores/Route.store';
import { flags } from '../../../feature-flags';
import { extractTableNameFromFeatureId } from '../../../geoserver/featureType/featureType.util';
import { WfsFeature } from '../../../geoserver/wfs/wfs.models';
import { CrgLayer } from '../../../gis/layers/layers.models';
import { prepareLike } from '../../../util/filters/filterObjects';

const defaultValues: Partial<SelectedFeaturesStore> = {
  features: [],
  active: false
};

class SelectedFeaturesStore {
  private static _instance: SelectedFeaturesStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable active: boolean = false;
  @observable features: WfsFeature[] = [];
  @observable activeFeature: WfsFeature | null = null;

  private readonly SELECTING_FEATURES_LIMIT = 500;

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

  @action
  clearActiveFeature() {
    this.activeFeature = null;
  }

  @action
  setActiveFeature(activeFeature: WfsFeature) {
    this.activeFeature = activeFeature;
  }

  @computed
  get featuresByTableName(): Record<string, WfsFeature[]> {
    const result: Record<string, WfsFeature[]> = {};

    for (const feature of this.features) {
      const tableName = extractTableNameFromFeatureId(feature.id);
      if (!result[tableName]) {
        result[tableName] = [];
      }

      result[tableName].push(feature);
    }

    return result;
  }

  @computed
  get filtersByLayersFeatures(): WfsFeature[] {
    const filtersByLayers: {
      [tableName: string]: {
        tester?: (properties: WfsFeature['properties']) => boolean;
        ids: string[];
        negativeIds: boolean;
      };
    } = {};

    return this.features.filter(feature => {
      const tableName = extractTableNameFromFeatureId(feature.id);

      if (!filtersByLayers[tableName]) {
        const layer = currentProject.getLayerByTableNameFromAllVectorableLayers(tableName);

        filtersByLayers[tableName] = this.prepareLayerFilter(layer);
      }

      const { negativeIds, ids, tester } = filtersByLayers[tableName];

      return !negativeIds && (!tester || tester(feature.properties)) && (!ids.length || ids.includes(feature.id));
    });
  }

  @computed
  get limitReached(): boolean {
    return this.features.length >= this.limit;
  }

  @action
  setActive(status: boolean) {
    this.active = status;
  }

  @action
  updateFeature(updatedFeature: WfsFeature) {
    const findFeature = this.features.find(feature => feature.id === updatedFeature.id);
    if (findFeature) {
      findFeature.properties = updatedFeature.properties;
      findFeature.geometry = updatedFeature.geometry;
    }
  }

  @action
  setFeatures(features: WfsFeature[]) {
    this.features = features;
  }

  @action
  private reset() {
    Object.assign(this, defaultValues);
  }

  isFeatureHighlighted(id: string | undefined): boolean {
    return !!id && id === this.activeFeature?.id;
  }

  get limit(): number {
    return flags.selectingFeaturesLimit ? Number(flags.selectingFeaturesLimit) : this.SELECTING_FEATURES_LIMIT;
  }

  private prepareLayerFilter(layer: CrgLayer) {
    if (!layer.tableName) {
      throw new Error(`Слой ${layer.title} не имеет tableName`);
    }

    const [ids, filter, negativeIds] = extractFeatureIdsFromAttributesFilter(
      attributesTableStore.getLayerFilter(layer.tableName, true),
      layer
    );

    return {
      tester: Object.keys(filter).length ? sift(prepareLike(filter)) : undefined,
      ids,
      negativeIds
    };
  }
}

export const selectedFeaturesStore = SelectedFeaturesStore.instance;
