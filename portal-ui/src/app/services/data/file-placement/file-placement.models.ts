export enum FilePlacementMode {
  FULL = 'full',
  GEOSERVER = 'geoserver',
  GIS = 'gis-service'
}

export interface GmlPlacementModel {
  wsUiId: string;
  fileId: string;
  projectId: number;
  invertedCoordinates?: boolean;
}

export interface PlacementModelForFilesWithCrs {
  wsUiId: string;
  fileId: string;
  projectId: number;
  crs: string;
  mode?: FilePlacementMode;
}

export interface ImportFeaturesFromShapeFileModel {
  datasetId: string;
  tableName: string;
  fileType: string;
}
