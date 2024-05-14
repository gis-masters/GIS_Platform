import { action, computed, makeObservable, observable } from 'mobx';
import { isEqual } from 'lodash';
import { Coordinate } from 'ol/coordinate';

import { Projection } from '../services/data/projection/projection.models';
import { transformGeometry } from '../services/data/projection/projection.util';
import { GeometryType, WfsGeometry } from '../services/geoserver/wfs/wfs.models';
import { isGeometryValid } from '../services/geoserver/wfs/wfs.util';

// TODO: пофиксить ошибки типизации
export class EditFeatureGeometryStore {
  @observable geometry?: WfsGeometry;
  @observable currentProjection: Projection;
  @observable nativeProjection: Projection;
  @observable private virginGeometry?: WfsGeometry;

  constructor() {
    makeObservable(this);
  }

  @computed
  get resultGeometry(): WfsGeometry<Coordinate> | undefined {
    if (!this.currentProjection) {
      return;
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
  get geometryType(): GeometryType {
    return this.geometry && this.geometry.type;
  }

  @computed
  private get virginGeometryInCurrentProjection(): WfsGeometry | undefined {
    return transformGeometry(this.virginGeometry, this.nativeProjection, this.currentProjection);
  }

  @action
  initGeometry(geometry: WfsGeometry, proj: Projection): void {
    this.setNativeProjection(proj);
    this.virginGeometry = geometry;
    this.setGeometry(geometry);
  }

  @action.bound
  setGeometry(geometry: WfsGeometry): void {
    this.geometry = transformGeometry(geometry, this.nativeProjection, this.currentProjection);
  }

  @action
  setProjection(proj: Projection): void {
    this.geometry = transformGeometry(this.resultGeometry, this.nativeProjection, proj);
    this.currentProjection = proj;
  }

  @action
  private setNativeProjection(proj: Projection) {
    this.nativeProjection = proj;
    this.setProjection(proj);
  }
}
