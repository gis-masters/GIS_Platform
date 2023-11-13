import { SelectSchemaControl } from '../../../components/SelectSchemaControl/SelectSchemaControl';
import { Role } from '../permissions/permissions.models';
import { PropertyType, SimpleSchema } from '../schema/schema.models';
import { DataEntity, DataEntityType } from '../vectorData/vectorData.models';

export enum ContentTypeTypes {
  FOLDER = 'FOLDER'
}

export interface Library extends Omit<DataEntity, 'identifier'> {
  type: DataEntityType.LIBRARY;
  table_name: string;
  schemaId: string;
  role: Role;
  versioned: boolean;
}

export type LibraryNew = Pick<Library, 'schemaId' | 'details' | 'versioned'>;

export const librarySchema: SimpleSchema = {
  properties: [
    {
      name: 'schemaId',
      title: 'Схема',
      required: true,
      propertyType: PropertyType.CUSTOM,
      onlyWithGeometry: false,
      ControlComponent: SelectSchemaControl
    },
    {
      name: 'details',
      title: 'Описание',
      propertyType: PropertyType.STRING
    },
    {
      name: 'versioned',
      title: 'Версионирование',
      propertyType: PropertyType.BOOL
    }
  ]
};

export interface LibraryRecordRaw extends Record<string, unknown> {
  id: number;

  type?: string;
  title?: string;
  details?: string;
  created_at?: string;
  is_deleted?: boolean;
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
