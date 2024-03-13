// data-service/src/main/java/ru/mycrg/data_service/dto/ExportRequestModel.java
export interface ExportRequest {
  resources: ExportResourceModel[];
  format: 'GML' | 'ESRI Shapefile';
  epsg: string;
  invertedCoordinates?: boolean;
  wsUiId?: string;
  docSchema?: string;
}

export interface ExportResourceModel {
  dataset: string;
  table: string;
}
