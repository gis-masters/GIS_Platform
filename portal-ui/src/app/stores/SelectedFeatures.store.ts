import { action, computed, makeObservable, observable, reaction } from 'mobx';
import sift from 'sift';

import { extractFeatureIdsFromAttributesFilter } from '../components/Attributes/Attributes.utils';
import { flags } from '../services/common/feature-flags/feature-flags.service';
import { extractResourceIdFromFeatureId } from '../services/geoserver/featureType/featureType.util';
import { type WfsFeature } from '../services/geoserver/wfs/wfs.models';
import { type CrgLayer } from '../services/gis/layers/layers.models';
import { prepareLike } from '../services/util/filters/filterObjects';
import { attributesTableStore } from './AttributesTable.store';
import { currentProject } from './CurrentProject.store';
import { Pages, route } from './Route.store';

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
  get featuresByResourceId(): Record<string, WfsFeature[]> {
    const result: Record<string, WfsFeature[]> = {};

    for (const feature of this.features) {
      const resourceId = extractResourceIdFromFeatureId(feature.id);
      if (!result[resourceId]) {
        result[resourceId] = [];
      }

      result[resourceId].push(feature);
    }

    return result;
  }

  @computed
  get filtersByLayersFeatures(): WfsFeature[] {
    const filtersByLayers: {
      [resourceId: string]: {
        tester?(properties: WfsFeature['properties']): boolean;
        ids: string[];
        negativeIds: boolean;
      };
    } = {};

    return this.features.filter(feature => {
      const resourceId = extractResourceIdFromFeatureId(feature.id);

      if (!filtersByLayers[resourceId]) {
        const vectorLayer = currentProject.vectorableLayers.find(layer => layer.resourceId === resourceId);
        filtersByLayers[resourceId] = vectorLayer
          ? this.prepareLayerFilter(vectorLayer)
          : { ids: [], negativeIds: false };
      }

      const { negativeIds, ids, tester } = filtersByLayers[resourceId];

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
    if (!layer.resourceId) {
      throw new Error(`Слой ${layer.title} не имеет resourceId`);
    }

    const [ids, filter, negativeIds] = extractFeatureIdsFromAttributesFilter(
      attributesTableStore.getLayerFilter(layer.resourceId, true),
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
