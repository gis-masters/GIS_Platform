import { type DataFromGpkgPlacementModel, type GpkgTile } from '../../../../server-types/common-contracts';

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

export type GpkgRasterLayerPlacement = Pick<
  GpkgTile,
  'gpkgLayerTableName' | 'libraryIdentifier' | 'documentId' | 'field'
>;

export interface GpkgPlacementModel extends Omit<
  DataFromGpkgPlacementModel,
  'layersPlacement' | 'datasetIdentifier' | 'layerGroupId'
> {
  datasetIdentifier?: string;
  layerGroupId?: number;
  layersPlacement: {
    vectorLayers: string[];
    rasterLayers: GpkgRasterLayerPlacement[];
  };
}
