import { type FileInfo } from '../../services/data/files/files.models';
import { type Library, type LibraryRecord } from '../../services/data/library/library.models';
import { type Dataset, type VectorTable } from '../../services/data/vectorData/vectorData.models';

export interface Datasource {
  dataset?: Dataset;
  vectorTable?: VectorTable;
  libraryRecord?: LibraryRecord;
  library?: Library;
  file?: FileInfo;
}
