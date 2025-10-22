import { type FileInfo } from '../../app/services/data/files/files.models';
import { type VectorTable } from '../../app/services/data/vectorData/vectorData.models';
import { type NewWfsFeature } from '../../app/services/geoserver/wfs/wfs.models';

export enum UploadedFileStatus {
  PENDING = 'pending',
  ERROR = 'error',
  SUCCESS = 'success'
}

export interface UploadedFile {
  title: string;
  size: number;
  url: string;
  feature: NewWfsFeature;
  file: File;
  uploaded?: FileInfo;
  status: UploadedFileStatus | null;
}

export interface UploadResultType {
  handled: number;
  succeeded: number;
  withError: number;
}

export interface UpLayersListItemData {
  data: VectorTable;
}
