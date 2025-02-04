import { Coordinate } from 'ol/coordinate';
import { SimpleGeometry } from 'ol/geom';

import { Projection } from '../../data/projections/projections.models';
import { UnitsOfAreaMeasurement } from '../../util/open-layers.util';

const textAlignTypes = new Set(['left', 'center', 'right', 'justify']);

export type LabelType = 'label' | 'line' | 'turningPoints';

export type Distance = {
  distance: { value: number; units: string };
  center: Coordinate;
  azimuth: number;
  isLabelInPolygon: boolean;
};

export type FeatureLengthData = {
  geometry: SimpleGeometry;
  projection: Projection;
  precision?: number;
  isMeasure?: boolean;
};

export type FeatureAreaData = {
  geometry: SimpleGeometry;
  units: UnitsOfAreaMeasurement;
  projection?: Projection | string;
  precision?: number;
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

export type AnnotationsType =
  | 'length'
  | 'area'
  | 'turningPoints'
  | 'distances'
  | 'annotations'
  | 'turningPointsSettings';

export type AnnotationsFontProperties = {
  area: FontProperties;
  length: FontProperties;
  turningPoints: FontProperties;
  distances: FontProperties;
  annotations: FontProperties;
};

export function isTextAlignTypes(value: unknown): value is TextAlignTypes {
  return typeof value === 'string' && textAlignTypes.has(value);
}

export type CircleProperties = {
  fillColor: string;
  strokeColor: string;
  radius: string;
};
