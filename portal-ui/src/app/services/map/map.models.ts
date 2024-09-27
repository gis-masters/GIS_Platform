import { Coordinate } from 'ol/coordinate';

import { Projection } from '../data/projections/projections.models';
import { GeometryType } from '../geoserver/wfs/wfs.models';

export enum MapSelectionTypes {
  ADD,
  REMOVE,
  REPLACE
}

export enum MapMode {
  DEFAULT,
  SELECTION,
  MEASURE,
  ADDING_LABEL,
  DRAW,
  PICK
}

export enum MapAction {
  MOVE,
  PROKOL,
  SELECT_WITH_MODIFICATORS,
  SELECT,
  MEASUREMENT,
  DRAW,
  PICK,
  ADD_LABEL
}

export enum FilterBySelectionMode {
  ONLY_SELECTED = 'selected',
  ONLY_NOT_SELECTED = 'notSelected',
  DISABLED = 'disabled'
}

export type LabelType = 'label' | 'line' | 'turningPoints';

export interface MapPosition {
  zoom: number;
  center: Coordinate;
}

export type Distance = {
  distance: { value: number; units: string };
  center: Coordinate;
  azimuth: number;
  isLabelInPolygon: boolean;
};

export type CreateFeaturesData = {
  coordinates: Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][];
  geometryType: GeometryType;
  currentLayerProjection?: Projection;
  olProjection?: Projection;
};
