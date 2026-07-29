import { type FileInfo } from '../../services/data/files/files.models';
import { type Library, type LibraryRecord } from '../../services/data/library/library.models';
import { type Projection } from '../../services/data/projections/projections.models';
import { type Dataset, type VectorTable } from '../../services/data/vectorData/vectorData.models';
import { type CrgLayer, CrgLayerType } from '../../services/gis/layers/layers.models';

export interface Datasource {
  dataset?: Dataset;
  vectorTable?: VectorTable;
  libraryRecord?: LibraryRecord;
  library?: Library;
  file?: FileInfo;
}

export interface LayerFormValue extends CrgLayer {
  datasource?: Datasource;
  projection?: Projection;
  layerType?: string;
  nspdLayer?: string;
}

export const layerTypeOptions: { title: string; value: CrgLayerType }[] = [
  { title: 'Векторный', value: CrgLayerType.VECTOR },
  { title: 'Файловый', value: CrgLayerType.RASTER },
  { title: 'Внешний (веб-сервис ArcGis)', value: CrgLayerType.EXTERNAL },
  { title: 'НСПД', value: CrgLayerType.EXTERNAL_NSPD }
];
