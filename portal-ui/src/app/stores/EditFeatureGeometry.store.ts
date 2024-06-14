import { action, computed, makeObservable, observable } from 'mobx';
import { isEqual } from 'lodash';
import { Coordinate } from 'ol/coordinate';

import { Projection } from '../services/data/projections/projections.models';
import { transformGeometry } from '../services/data/projections/projections.util';
import { GeometryType, WfsGeometry } from '../services/geoserver/wfs/wfs.models';
import { isGeometryValid } from '../services/geoserver/wfs/wfs.util';

export class EditFeatureGeometryStore {
  @observable geometry?: WfsGeometry;
  @observable currentProjection?: Projection;
  @observable nativeProjection?: Projection;
  @observable private virginGeometry?: WfsGeometry;

  constructor() {
    makeObservable(this);
  }

  @computed
  get resultGeometry(): WfsGeometry<Coordinate> | undefined {
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
  initGeometry(geometry: WfsGeometry, projection: Projection): void {
    this.nativeProjection = projection;
    this.currentProjection = projection;
    this.virginGeometry = geometry;
    this.setGeometry(geometry);
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
}
