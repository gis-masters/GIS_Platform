import { action, computed, makeObservable, observable } from 'mobx';
import { Feature, Polygon } from '@turf/turf';
import { isEqual } from 'lodash';

import { Toast } from '../../../../components/Toast/Toast';
import { Projection } from '../../../data/projections/projections.models';
import { GeometryType, WfsFeature, WfsGeometry } from '../../../geoserver/wfs/wfs.models';
import { isGeometryValid } from '../../../geoserver/wfs/wfs.util';
import { CrgVectorableLayer } from '../../../gis/layers/layers.models';
import { transformGeometry } from '../../../util/coordinates-transform.util';
import { EditFeaturesData } from './EditFeature.models';

class EditFeatureStore {
  private static _instance: EditFeatureStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable geometry?: WfsGeometry;
  @observable hasGeometryWarning: boolean = false;

  @observable currentProjection?: Projection;
  @observable nativeProjection?: Projection;
  @observable previousProjection?: Projection;
  @observable defaultProjection?: Projection;

  @observable layer?: CrgVectorableLayer;
  @observable layerExtent?: Feature<Polygon>;

  @observable editFeaturesData?: EditFeaturesData;

  // Некий агрегатор, впитывающий в себя изменения ангулар формы и изменения геометрии
  @observable private featuresEdited?: boolean;
  @observable private virginGeometry?: WfsGeometry;

  constructor() {
    makeObservable(this);
  }

  @computed
  get pristine() {
    return this.editFeaturesData === undefined ? true : !this.featuresEdited ?? true;
  }

  @computed
  get dirty() {
    return !this.pristine;
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

  @action
  setFeaturesEdited(edited: boolean) {
    this.featuresEdited = edited;
  }

  @action
  setEditFeaturesData(editFeaturesData: EditFeaturesData) {
    this.editFeaturesData = editFeaturesData;
  }

  @action
  reset() {
    this.editFeaturesData = undefined;
    this.featuresEdited = false;
  }
}

export const editFeatureStore = EditFeatureStore.instance;
