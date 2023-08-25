import { Role } from '../permissions/permissions.models';
import { DataEntity, DataEntityType } from '../vectorData/vectorData.models';

export enum ContentTypeTypes {
  FOLDER = 'FOLDER'
}

export interface DocumentLibrary extends Omit<DataEntity, 'identifier'> {
  type: DataEntityType.LIBRARY;
  table_name: string;
  schemaId: string;
  role: Role;
  versioned: boolean;
}

export interface LibraryRecordRaw extends Record<string, unknown> {
  id: number;

  type?: string;
  title?: string;
  details?: string;
  created_at?: string;
  inner_path?: string;
  parent?: string;
  path?: string;
  content_type_id?: string;
  oktmo?: string;
  native_crs?: string;

  role?: Role;
}

export interface LibraryRecord extends LibraryRecordRaw {
  libraryTableName: string;
  schemaId: string;
}

export interface DocumentVersion {
  content: LibraryRecordRaw;
  updatedBy: number;
  updatedTime: string;
}

export interface DocumentVersionExtended extends DocumentVersion {
  updatedByUser: string;
  document: LibraryRecord;
}

export type LibraryRecordNew = Omit<LibraryRecord, 'id' | 'role'>;
