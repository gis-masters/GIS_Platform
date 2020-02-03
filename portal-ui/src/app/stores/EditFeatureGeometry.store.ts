import { observable, computed, action } from 'mobx';
import { isEqual } from 'lodash';
import { Coordinate } from 'ol/coordinate';
import GeometryType from 'ol/geom/GeometryType';

import {
  WfsGeometryEdited,
  WfsGeometry,
  WfsPointGeometry,
  WfsMultiLineStringGeometry,
  WfsMultiPolygonGeometry,
  CoordinateEdited
} from '../services/geoserver/wfs-models';

import {
  isGeometryValid,
  isCoordinateValid,
  normalizeCoordinates
} from '../services/geoserver/wfs.service';

import {
  CrgProjection,
  TransformFunction,
  defaultProjection
} from '../services/geoserver/projections-transform.service';

type Coord = Coordinate | CoordinateEdited;

export class EditFeatureGeometryStore {
  @observable geometry?: WfsGeometryEdited;
  @observable private virginGeometry?: WfsGeometry;
  @observable currentProjection: CrgProjection;

  @computed
  get resultGeometry (): WfsGeometry | undefined {
    if (!this.currentProjection) {
      return;
    }

    return this.transformGeometry(
                          this.geometry,
                          this.currentProjection.from,
                          this.virginGeometryInCurrentProjection,
                          this.virginGeometry);
  }

  @computed
  private get virginGeometryInCurrentProjection(): WfsGeometry | undefined {
    return this.transformGeometry(this.virginGeometry, this.currentProjection.to);
  }

  @computed
  get isValid (): boolean {
    return this.resultGeometry && isGeometryValid(this.resultGeometry);
  }

  @computed
  get isChanged (): boolean {
    return this.isValid && !isEqual(this.resultGeometry, this.virginGeometry);
  }

  constructor () {
    this.setProjection(defaultProjection);
  }

  @action
  setGeometry (geometry: WfsGeometry) {
    this.virginGeometry = geometry;
    this.geometry = this.transformGeometry(geometry, this.currentProjection.to);
  }

  @action
  setProjection (projection: CrgProjection) {
    this.geometry = this.transformGeometry(this.resultGeometry, projection.to);
    this.currentProjection = projection;
  }

  private transformGeometry (
            geometry: WfsGeometryEdited,
            transformFunction: TransformFunction,
            originGeometry?: WfsGeometry,
            transformedOriginGeometry?: WfsGeometry
          ): WfsGeometry | undefined {
    if (!geometry) {
      return;
    }

    const { type: geometryType, coordinates } = geometry;

    if (geometryType === GeometryType.POINT) {
      const newCoordinates = this.transformCoordinate(
                                coordinates as Coordinate,
                                transformFunction,
                                originGeometry && originGeometry.coordinates as Coordinate,
                                transformedOriginGeometry && transformedOriginGeometry.coordinates as Coordinate);

      return {
        ...geometry,
        coordinates: newCoordinates
      } as WfsPointGeometry;
    }

    if (geometryType === GeometryType.MULTI_LINE_STRING) {
      const newCoordinates = this.transformSuperGroup(
                                coordinates as Coordinate[][],
                                transformFunction,
                                originGeometry && originGeometry.coordinates as Coordinate[][],
                                transformedOriginGeometry && transformedOriginGeometry.coordinates as Coordinate[][]);

      return {
        ...geometry,
        coordinates: newCoordinates
      } as WfsMultiLineStringGeometry;
    }

    if (geometryType === GeometryType.MULTI_POLYGON) {
      const newCoordinates = this.transformMultiSuperGroup(
                                coordinates as Coordinate[][][],
                                transformFunction,
                                originGeometry && originGeometry.coordinates as Coordinate[][][],
                                transformedOriginGeometry && transformedOriginGeometry.coordinates as Coordinate[][][]);

      return {
        ...geometry,
        coordinates: newCoordinates
      } as WfsMultiPolygonGeometry;
    }
  }

  private transformCoordinate (
            coordEdited: Coord,
            transformFunction: TransformFunction,
            origin?: Coord,
            transformedOrigin?: Coord
          ): Coord {
    const coord = normalizeCoordinates(coordEdited) as Coordinate;

    if (isEqual(coord, origin)) {
      return transformedOrigin;
    }

    return isCoordinateValid(coord) ? transformFunction(coord) : coordEdited;
  }

  private transformGroup (
            group: Coord[],
            transformFunction: TransformFunction,
            origin?: Coord[],
            transformedOrigin?: Coord[]
          ): Coord[] {
    return group.map((coord, i) => this.transformCoordinate(
                                      coord,
                                      transformFunction,
                                      origin && origin.length >= i - 1 && origin[i],
                                      transformedOrigin && transformedOrigin.length >= i - 1 && transformedOrigin[i]));
  }

  private transformSuperGroup (
            superGroup: Coord[][],
            transformFunction: TransformFunction,
            origin?: Coord[][],
            transformedOrigin?: Coord[][]
          ): Coord[][] {
    return superGroup.map((group, i) => this.transformGroup(
                                      group,
                                      transformFunction,
                                      origin && origin.length >= i - 1 && origin[i],
                                      transformedOrigin && transformedOrigin.length >= i - 1 && transformedOrigin[i]));
  }

  private transformMultiSuperGroup (
            superGroups: Coord[][][],
            transformFunction: TransformFunction,
            origin?: Coord[][][],
            transformedOrigin?: Coord[][][]
          ): Coord[][][] {
    return superGroups.map((superGroup, i) => this.transformSuperGroup(
                                      superGroup,
                                      transformFunction,
                                      origin && origin.length >= i - 1 && origin[i],
                                      transformedOrigin && transformedOrigin.length >= i - 1 && transformedOrigin[i]));
  }
}
