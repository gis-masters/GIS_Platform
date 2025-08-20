import { action, computed, makeObservable, observable } from 'mobx';
import { Feature, Polygon } from '@turf/turf';
import { cloneDeep, isEqual } from 'lodash';

import { defaultOlProjectionCode, Projection } from '../../../data/projections/projections.models';
import { getProjectionByCode } from '../../../data/projections/projections.service';
import { GeometryType, WfsFeature, WfsGeometry } from '../../../geoserver/wfs/wfs.models';
import { isGeometryValid } from '../../../geoserver/wfs/wfs.util';
import { CrgVectorableLayer } from '../../../gis/layers/layers.models';
import { services } from '../../../services';
import { transformGeometry } from '../../../util/coordinates-transform.util';
import { selectedFeaturesStore } from '../selected-features/SelectedFeatures.store';
import { EditFeaturesData } from './EditFeature.models';

class EditFeatureStore {
  private static _instance: EditFeatureStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable geometryErrorMessage: string | null = null;

  @observable pristine: boolean = true;
  @observable pristineFromGeometryFix: boolean = true;
  @observable editFeaturesData?: EditFeaturesData;

  @observable currentProjection?: Projection;
  @observable olProjection?: Projection;

  // Зона слоя допустимая для добавления объектов без предупреждения
  @observable layerExtent?: Feature<Polygon>;
  // Признак нарушения границ зоны layerExtent какой-либо из точек геометрии
  @observable hasGeometryWarning: boolean = false;

  @observable geometryPool: WfsGeometry[] = [];

  constructor() {
    makeObservable(this);
  }

  @computed
  get dirty() {
    return !this.pristine;
  }

  @computed
  get geometry(): WfsGeometry | undefined {
    return this.firstFeature?.geometry;
  }

  @computed
  get isGeometryValid(): boolean {
    if (this.geometry) {
      return Boolean(isGeometryValid(this.geometry));
    }

    return false;
  }

  @computed.struct
  get isGeometryChanged(): boolean {
    if (this.isGeometryValid && !isEqual(this.geometry, this.currentGeometry)) {
      this.addGeometryToPool(cloneDeep(this.geometry));
      this.setPristine(false);

      return true;
    }

    return false;
  }

  @computed
  get geometryType(): GeometryType | undefined {
    return this.firstFeature?.geometry?.type;
  }

  @computed
  get firstFeature(): WfsFeature | undefined {
    return this.editFeaturesData?.features[0];
  }

  @computed
  public get currentGeometry(): WfsGeometry | undefined {
    return this.geometryPool.length > 0 ? this.geometryPool.at(-1) : undefined;
  }

  @action
  async initFeature(feature: WfsFeature, projection: Projection): Promise<void> {
    this.olProjection = await getProjectionByCode(defaultOlProjectionCode);

    if (feature && feature.geometry) {
      this.setCurrentProjection(projection);
      this.setGeometry(feature.geometry);
    } else {
      services.logger.warn('Не корректная фича');
    }
  }

  @action
  public addGeometryToPool(geometry: WfsGeometry | undefined): void {
    if (geometry && !isEqual(geometry, this.currentGeometry)) {
      this.geometryPool.push(cloneDeep(geometry));
    }
  }

  @action
  public clearGeometryPool(): void {
    this.geometryPool = [];
  }

  @action
  setCurrentProjection(projection: Projection): void {
    this.currentProjection = projection;
  }

  @action
  setLayerExtent(extent: Feature<Polygon>): void {
    this.layerExtent = extent;
  }

  @action
  setGeometryWarning(value: boolean): void {
    this.hasGeometryWarning = value;
  }

  @action.bound
  setGeometry(geometry: WfsGeometry): void {
    if (!this.currentProjection) {
      throw new Error('Отсутствует текущая проекция');
    }

    if (this.firstFeature) {
      this.firstFeature.geometry = geometry;
      this.addGeometryToPool(geometry);
    }
  }

  @action.bound
  setCurrentProjectionAndTransformGeometry(proj: Projection): void {
    if (!this.geometry || !this.currentProjection) {
      throw new Error('Отсутствует геометрия или текущая проекция');
    }

    if (this.firstFeature) {
      this.firstFeature.geometry = transformGeometry(this.geometry, this.currentProjection, proj);
      this.currentProjection = proj;
    }
  }

  @action
  setLayer(layer: CrgVectorableLayer): void {
    if (this.editFeaturesData) {
      this.editFeaturesData.layer = layer;
    }
  }

  @action
  setPristine(pristine: boolean) {
    this.pristine = pristine;
  }

  @action
  setGeometryErrorMessage(geometryErrorMessage: string | null) {
    this.geometryErrorMessage = geometryErrorMessage;
  }

  @action
  setPristineFromGeometryFix(pristineFromGeometryFix: boolean) {
    this.pristineFromGeometryFix = pristineFromGeometryFix;
  }

  @action
  setEditFeaturesData(editFeaturesData: EditFeaturesData | undefined) {
    if (editFeaturesData === undefined) {
      this.editFeaturesData = undefined;
      this.clear();
    } else {
      this.editFeaturesData = cloneDeep(editFeaturesData);

      // Обновляем фичу в списке выделенных
      editFeatureStore.editFeaturesData?.features.forEach(feature => {
        selectedFeaturesStore.updateFeature(feature);
      });

      this.setGeometryErrorMessage(null);
    }
  }

  @action
  clear() {
    this.setPristine(false);
    this.setGeometryErrorMessage(null);
    this.setPristineFromGeometryFix(false);
    this.clearGeometryPool();
  }
}

export const editFeatureStore = EditFeatureStore.instance;
