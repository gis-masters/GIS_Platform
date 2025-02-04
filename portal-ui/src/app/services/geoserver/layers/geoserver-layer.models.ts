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
