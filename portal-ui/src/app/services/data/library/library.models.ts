import { SelectSchemaControl } from '../../../components/SelectSchemaControl/SelectSchemaControl';
import { Role } from '../../permissions/permissions.models';
import { PropertyType, Schema, SimpleSchema } from '../schema/schema.models';
import { OldSchema } from '../schema/schemaOld.models';
import { DataEntityType } from '../vectorData/vectorData.models';

export enum ContentTypeTypes {
  FOLDER = 'FOLDER'
}

export interface Library {
  id: number;
  title: string;
  details?: string;
  readyForFts: boolean;
  createdAt: string;
  type: DataEntityType.LIBRARY;
  table_name: string;
  versioned: boolean;
  schema: Schema;
  role?: Role;
}

export interface LibraryRaw extends Omit<Library, 'schema'> {
  schema: OldSchema;
}

export type LibraryNew = Pick<Library, 'details' | 'versioned' | 'readyForFts'> & { schemaId: string };

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
    },
    {
      name: 'readyForFts',
      title: 'Полнотекстовый поиск',
      defaultValue: true,
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
  path: string;
  content_type_id?: string;
  oktmo?: string;
  native_crs?: string;

  role?: Role;
}

export interface LibraryRecord extends LibraryRecordRaw {
  libraryTableName: string;
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
