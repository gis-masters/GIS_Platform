import { action, computed, makeObservable, observable } from 'mobx';
import { Feature, Polygon } from '@turf/turf';
import { isEqual } from 'lodash';

import { Projection } from '../../../data/projections/projections.models';
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

  @observable pristine: boolean = true;
  @observable editFeaturesData?: EditFeaturesData;

  @observable currentProjection?: Projection;
  @observable nativeProjection?: Projection;

  // Зона слоя допустимая для добавления объектов без предупреждения
  @observable layerExtent?: Feature<Polygon>;
  // Признак нарушения границ зоны layerExtent какой-либо из точек геометрии
  @observable hasGeometryWarning: boolean = false;

  @observable private virginGeometry?: WfsGeometry;

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
  get resultGeometry(): WfsGeometry | undefined {
    const feature = this.firstFeature;
    if (!feature) {
      services.logger.info('resultGeometry Отсутствует фича');

      return;
    }

    const geometry = feature.geometry;
    if (!this.currentProjection) {
      services.logger.info('resultGeometry Отсутствует текущая проекция');

      return;
    } else if (!geometry) {
      services.logger.info('resultGeometry Отсутствует геометрия');

      return;
    } else if (!this.nativeProjection) {
      services.logger.info('resultGeometry Отсутствует нативная проекция');

      return;
    }

    return transformGeometry(
      geometry,
      this.currentProjection,
      this.nativeProjection,
      this.virginGeometryInCurrentProjection,
      this.virginGeometry
    );
  }

  @computed
  get isGeometryValid(): boolean {
    return Boolean(this.resultGeometry && isGeometryValid(this.resultGeometry));
  }

  @computed
  get isGeometryChanged(): boolean {
    return this.isGeometryValid && !isEqual(this.resultGeometry, this.virginGeometry);
  }

  @computed
  get geometryType(): GeometryType | undefined {
    return this.firstFeature?.geometry?.type;
  }

  @action
  initFeature(feature: WfsFeature, projection: Projection): void {
    if (feature && feature.geometry) {
      this.nativeProjection = projection;
      this.currentProjection = projection;
      this.virginGeometry = feature.geometry;

      this.setGeometry(feature.geometry);
    } else {
      services.logger.warn('Не корректная фича');
    }
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
    if (!this.nativeProjection || !this.currentProjection) {
      throw new Error('Отсутствует проекция');
    }

    if (this.firstFeature) {
      this.firstFeature.geometry = transformGeometry(geometry, this.nativeProjection, this.currentProjection);
    }
  }

  @action.bound
  setCurrentProjectionAndTransformGeometry(proj: Projection): void {
    if (!this.resultGeometry || !this.nativeProjection) {
      throw new Error('Отсутствует геометрия или базовая проекция');
    }

    if (this.firstFeature) {
      this.firstFeature.geometry = transformGeometry(this.resultGeometry, this.nativeProjection, proj);
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
  setEditFeaturesData(editFeaturesData: EditFeaturesData | undefined) {
    if (editFeaturesData === undefined) {
      this.setPristine(false);
    }

    this.editFeaturesData = editFeaturesData;

    // Обновляем фичу в списке выделенных
    editFeatureStore.editFeaturesData?.features.forEach(feature => {
      selectedFeaturesStore.updateFeature(feature);
    });
  }

  @computed
  private get virginGeometryInCurrentProjection(): WfsGeometry | undefined {
    if (!this.virginGeometry || !this.nativeProjection || !this.currentProjection) {
      throw new Error('Отсутствует проекция или начальная геометрия');
    }

    return transformGeometry(this.virginGeometry, this.nativeProjection, this.currentProjection);
  }

  @computed
  private get firstFeature(): WfsFeature | undefined {
    return this.editFeaturesData?.features[0];
  }
}

export const editFeatureStore = EditFeatureStore.instance;
