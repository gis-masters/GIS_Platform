import { Role } from '../permissions/permissions.models';
import { DataEntity, DataEntityType } from '../vectorData/vectorData.models';

export enum ContentTypeTypes {
  FOLDER = 'FOLDER'
}

export interface DocumentLibrary extends Omit<DataEntity, 'identifier'> {
  type: DataEntityType.LIBRARY;
  table_name: string;
  role: Role;
}

export interface LibraryRecord {
  [key: string]: unknown;

  id?: number;
  type?: string;
  title?: string;
  details?: string;
  created_at?: string;
  inner_path?: string;
  parent?: string;
  path?: string;
  content_type_id?: string;
  oktmo?: string;
  intents?: string;
  native_crs?: string;

  libraryTableName: string;
  schemaId: string;

  role?: Role;
}

export type LibraryRecordRaw = Omit<LibraryRecord, 'libraryName' | 'schemaId'>;
