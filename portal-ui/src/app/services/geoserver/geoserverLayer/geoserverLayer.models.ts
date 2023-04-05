import { BBOX } from '@fiz/geoserver-types/BBOX';

import { CrgLayerType } from '../../gis/layers/layers.models';

export interface GeoserverLayerInfo {
  name: string;
  type: CrgLayerType;
  defaultStyle: {
    name: string;
    href: string;
  };
  resource: {
    '@class': string;
    name: string;
    href: string;
  };
  attribution: {
    logoWidth: number;
    logoHeight: number;
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
