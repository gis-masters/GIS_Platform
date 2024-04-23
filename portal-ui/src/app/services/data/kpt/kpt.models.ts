import { UploadFileInfo } from '../../../components/LibraryMassKptLoad/LibraryMassKptLoad';
import { LibraryRecord } from '../library/library.models';
import { PropertySchema } from '../schema/schema.models';

export interface KptTaskInfo {
  id: number;
  folder: boolean;
  content: Record<string, string>;
}

export interface KptRequestInfo {
  clientId: string;
}

export interface UploadKptData {
  file: UploadFileInfo;
  data: LibraryRecord;
  libraryTableName: string;
  properties: PropertySchema[];
}

type Status = 'error' | 'success';

export interface UploadKptReturnType {
  status: Status;
  libraryRecord?: LibraryRecord;
}
