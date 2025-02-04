import { FileInfo } from '../../app/services/data/files/files.models';
import { NewWfsFeature } from '../../app/services/geoserver/wfs/wfs.models';

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
