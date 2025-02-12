import { action, computed, makeObservable, observable } from 'mobx';
import { Feature, Polygon } from '@turf/turf';
import { isEqual } from 'lodash';

import { Toast } from '../components/Toast/Toast';
import { Projection } from '../services/data/projections/projections.models';
import { GeometryType, WfsFeature, WfsGeometry } from '../services/geoserver/wfs/wfs.models';
import { isGeometryValid } from '../services/geoserver/wfs/wfs.util';
import { CrgVectorableLayer } from '../services/gis/layers/layers.models';
import { transformGeometry } from '../services/util/coordinates-transform.util';

class EditFeatureStore {
  private static _instance: EditFeatureStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable feature?: WfsFeature;

  @observable geometry?: WfsGeometry;
  @observable hasGeometryWarning: boolean = false;

  @observable currentProjection?: Projection;
  @observable nativeProjection?: Projection;
  @observable previousProjection?: Projection;
  @observable defaultProjection?: Projection;

  @observable layer?: CrgVectorableLayer;
  @observable layerExtent?: Feature<Polygon>;

  @observable private virginGeometry?: WfsGeometry;

  constructor() {
    makeObservable(this);
  }

  @computed
  get resultGeometry(): WfsGeometry | undefined {
    if (!this.currentProjection || !this.geometry || !this.nativeProjection) {
      throw new Error('Отсутствует проекция, невозможно получить координаты');
    }

    return transformGeometry(
      this.geometry,
      this.currentProjection,
      this.nativeProjection,
      this.virginGeometryInCurrentProjection,
      this.virginGeometry
    );
  }

  @computed
  get isValid(): boolean {
    return Boolean(this.resultGeometry && isGeometryValid(this.resultGeometry));
  }

  @computed
  get isChanged(): boolean {
    return this.isValid && !isEqual(this.resultGeometry, this.virginGeometry);
  }

  @computed
  get geometryType(): GeometryType | undefined {
    return this.geometry?.type;
  }

  @computed
  private get virginGeometryInCurrentProjection(): WfsGeometry | undefined {
    if (!this.virginGeometry || !this.nativeProjection || !this.currentProjection) {
      throw new Error('Отсутствует проекция или начальная геометрия');
    }

    return transformGeometry(this.virginGeometry, this.nativeProjection, this.currentProjection);
  }

  @action
  initFeature(feature: WfsFeature, projection: Projection | undefined): void {
    if (feature.geometry && projection) {
      this.setFeature(feature);
      this.initGeometry(feature.geometry, projection);
    } else {
      Toast.error('Не удалось получить проекцию или геометрию объекта');
    }
  }

  @action
  initGeometry(geometry: WfsGeometry, projection: Projection): void {
    this.nativeProjection = projection;
    this.currentProjection = projection;
    this.virginGeometry = geometry;
    this.setGeometry(geometry);
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

    this.geometry = transformGeometry(geometry, this.nativeProjection, this.currentProjection);
  }

  @action.bound
  setFeature(feature: WfsFeature | undefined): void {
    this.feature = feature;
  }

  @action.bound
  setProjection(proj: Projection): void {
    if (!this.resultGeometry || !this.nativeProjection) {
      throw new Error('Отсутствует геометрия или базовая проекция');
    }

    this.geometry = transformGeometry(this.resultGeometry, this.nativeProjection, proj);
    this.currentProjection = proj;
  }

  @action
  setLayer(layer: CrgVectorableLayer): void {
    this.layer = layer;
  }
}

export const editFeatureStore = EditFeatureStore.instance;
