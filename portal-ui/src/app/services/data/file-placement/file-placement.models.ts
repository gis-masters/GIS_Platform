export type FilePlacementMode = 'full' | 'geoserver' | 'gis-service';

export interface GmlPlacementModel {
  wsUiId: string;
  fileId: string;
  projectId: number;
  invertedCoordinates?: boolean;
}

export interface DfxPlacementModel {
  wsUiId: string;
  fileId: string;
  projectId: number;
  crs: string;
}

export interface ImportFeaturesFromShapeFileModel {
  datasetId: string;
  tableName: string;
  fileType: string;
}
