export enum SourceType {
  OSM = 'OSM',
  XYZ = 'XYZ',
  WMTS = 'WMTS',
  WMTS_P = 'WMTS_P'
}

export interface Basemap {
  id?: number;
  name?: string;

  title: string;
  type: SourceType;
  thumbnailUrn: string;

  position?: number;
  url?: string;
  layerName?: string;
  style?: string;
  projection?: string;
  format?: string;

  size?: number;
  resolution?: number;
  matrixIds?: number;
}
