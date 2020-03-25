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
  id: number;
  name: string;
  title: string;
  thumbnail: string;
  position: number;

  source: BaseMapSource;
  tileGrid?: BaseMapTileGrid;
}

export interface BaseMapSource {
  type: SourceType;
  url: string;
  layerName?: string;
  style?: string;
  projection?: string;
  format?: string;
}

export interface BaseMapTileGrid {
  size: number;
  resolution: number;
  matrixIds: number;
}
