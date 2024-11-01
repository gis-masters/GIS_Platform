import { Coordinate } from 'ol/coordinate';
import { SimpleGeometry } from 'ol/geom';

import { Projection } from '../data/projections/projections.models';
import { WfsFeature } from '../geoserver/wfs/wfs.models';

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

export type CreateLabelsFeaturesData = {
  feature?: WfsFeature;
  currentLayerProjection?: Projection;
};

export type FeatureLengthData = {
  geometry: SimpleGeometry;
  projection: Projection;
  precision?: number;
  isMeasure?: boolean;
};

export type PointWithAngle = { angle: number; point: Coordinate; isLabelInPolygon: boolean };

export type LabelStyleOffsets = {
  offsetX: number;
  offsetY: number;
};

export type LabelPosition = {
  vertical: 'top' | 'center' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
};

export type PointOnBisectorData = {
  bx: number;
  by: number;
};

export enum LabelsStyleTypes {
  AREA = 'area',
  LENGTH = 'length',
  TURNING_POINTS = 'turningPoints',
  DISTANCES = 'distances'
}

export type TextAlignTypes = 'left' | 'center' | 'right' | 'justify';

export type TextStyleProperties = {
  fontSize?: number;
  fontColor?: string;
  isBold?: boolean;
  isItalic?: boolean;
  rotation?: number;
  textAlign?: TextAlignTypes;
};

export type FontProperties = {
  fontSize: number;
  fontColor: string;
  isBold: boolean;
  isItalic: boolean;
  textAlign: TextAlignTypes;
};

export type TextProperties = {
  fontSize: number;
  bold: string;
  italic: string;
  fontColor: string;
  textAlign: TextAlignTypes;
};

export type FeatureFontStringData = { fontColor: number[]; textAlign: TextAlignTypes; font?: string };
