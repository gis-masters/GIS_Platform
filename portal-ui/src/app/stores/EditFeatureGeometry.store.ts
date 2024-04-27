import { action, computed, makeObservable, observable } from 'mobx';
import { isEqual } from 'lodash';
import { Coordinate } from 'ol/coordinate';

import { Epsg } from '../services/data/epsg/epsg.models';
import { transformGeometry } from '../services/data/epsg/epsg.util';
import { GeometryType, WfsGeometry } from '../services/geoserver/wfs/wfs.models';
import { isGeometryValid } from '../services/geoserver/wfs/wfs.util';

// TODO: пофиксить ошибки типизации
export class EditFeatureGeometryStore {
  @observable geometry?: WfsGeometry;
  @observable currentEpsg: Epsg;
  @observable nativeEpsg: Epsg;
  @observable private virginGeometry?: WfsGeometry;

  constructor() {
    makeObservable(this);
  }

  @computed
  get resultGeometry(): WfsGeometry<Coordinate> | undefined {
    if (!this.currentEpsg) {
      return;
    }

    return transformGeometry(
      this.geometry,
      this.currentEpsg,
      this.nativeEpsg,
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
    return transformGeometry(this.virginGeometry, this.nativeEpsg, this.currentEpsg);
  }

  @action
  initGeometry(geometry: WfsGeometry, epsg: Epsg): void {
    this.setNativeEpsg(epsg);
    this.virginGeometry = geometry;
    this.setGeometry(geometry);
  }

  @action.bound
  setGeometry(geometry: WfsGeometry): void {
    this.geometry = transformGeometry(geometry, this.nativeEpsg, this.currentEpsg);
  }

  @action
  setEpsg(epsg: Epsg): void {
    this.geometry = transformGeometry(this.resultGeometry, this.nativeEpsg, epsg);
    this.currentEpsg = epsg;
  }

  @action
  private setNativeEpsg(epsg: Epsg) {
    this.nativeEpsg = epsg;
    this.setEpsg(epsg);
  }
}
