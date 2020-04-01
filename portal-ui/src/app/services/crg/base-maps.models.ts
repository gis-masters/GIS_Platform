export interface CrgProjectBaseMap {
  id: number;
  title: string;
  position: number;
  baseMapId: number;
}

export enum SourceType {
  OSM = 'OSM',
  XYZ = 'XYZ',
  WMTS = 'WMTS'
}

export interface CrgBaseMap {
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
