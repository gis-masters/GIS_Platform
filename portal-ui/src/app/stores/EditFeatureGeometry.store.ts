import { observable, computed, action } from 'mobx';
import { isEqual } from 'lodash';
import { Coordinate } from 'ol/coordinate';

import { GeometryType, WfsGeometry } from '../services/geoserver/wfs.models';
import { isGeometryValid } from '../services/geoserver/wfs.service';
import { CrgProjection, transformGeometry } from '../services/geoserver/projections.service';

export class EditFeatureGeometryStore {
  @observable geometry?: WfsGeometry;
  @observable currentProjection: CrgProjection;
  @observable nativeProjection: CrgProjection;
  @observable private virginGeometry?: WfsGeometry;

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
    return this.resultGeometry && isGeometryValid(this.resultGeometry);
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
  initGeometry(geometry: WfsGeometry, projection: CrgProjection): void {
    this.setNativeProjection(projection);
    this.virginGeometry = geometry;
    this.setGeometry(geometry);
  }

  @action.bound
  setGeometry(geometry: WfsGeometry): void {
    this.geometry = transformGeometry(geometry, this.nativeProjection, this.currentProjection);
  }

  @action
  setProjection(projection: CrgProjection): void {
    this.geometry = transformGeometry(this.resultGeometry, this.nativeProjection, projection);
    this.currentProjection = projection;
  }

  @action
  private setNativeProjection(projection: CrgProjection) {
    this.nativeProjection = projection;
    this.setProjection(projection);
  }
}
