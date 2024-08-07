import { BBOX } from '../featureType/featureType.model';

export interface CoverageTransparentColorEntry {
  string: Record<string, string>;
}

export interface CoverageTransparentColor {
  coverage: {
    parameters: {
      entry: CoverageTransparentColorEntry | Record<string, string>[];
    };
  };
}

export interface GeoserverCoverage {
  name: string;
  nativeName: string;
  namespace: {
    name: string;
    href: string;
  };
  title: string;
  nativeCRS: {
    '@class': string;
    $: string;
  };
  srs: string;
  nativeBoundingBox: BBOX;
  latLonBoundingBox: BBOX;
  projectionPolicy: string;
  enabled: boolean;
  store: {
    '@class': string;
    name: string;
    href: string;
  };
  serviceConfiguration: boolean;
  grid: {
    '@dimension': string;
    range: {
      low: string;
      high: string;
    };
    transform: {
      scaleX: number;
      scaleY: number;
      shearX: number;
      shearY: number;
      translateX: number;
      translateY: number;
    };
    crs: string;
  };
}
