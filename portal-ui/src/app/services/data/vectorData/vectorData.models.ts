import { SelectSchemaControl } from '../../../components/SelectSchemaControl/SelectSchemaControl';
import { projectionsStore } from '../../../stores/Projections.store';
import { CrgLayer } from '../../gis/layers/layers.models';
import { CrgProject } from '../../gis/projects/projects.models';
import { Role } from '../../permissions/permissions.models';
import { getProjectionCode } from '../projections/projections.util';
import { PropertyType, Schema, SimpleSchema } from '../schema/schema.models';
import { OldSchema } from '../schema/schemaOld.models';

export enum DataEntityType {
  DATASET = 'SCHEMA',
  TABLE = 'TABLE',
  LIBRARY = 'LIBRARY'
}

interface DataEntity {
  id: number;
  title: string;
  identifier: string;
  details?: string;
  type: DataEntityType;
  createdAt?: string;
  itemsCount?: number;
  role: Role;
}

export interface Dataset extends DataEntity {
  type: DataEntityType.DATASET;
}

export interface TablesData {
  datasetIdentifier: string;
  datasetTitle: string;
  tableName: string;
  tableTitle: string;
}

export type NewDataset = Pick<Dataset, 'title' | 'details'>;

export interface VectorTable extends DataEntity {
  type: DataEntityType.TABLE;
  crs: string;
  schema: Schema;
  dataset: string;
  documentType?: string;
  status?: string;
  fias?: string;
  docApproveDate?: string;
  docTerminationDate?: string;
  isPublic?: boolean;
}

export type NewVectorTable = Pick<VectorTable, 'title' | 'crs'> & { schemaId: string };
export type RawVectorTable = Omit<VectorTable, 'schema'> & { schema: OldSchema };

const title = 'Наименование';

export const datasetSchema: SimpleSchema = {
  properties: [
    {
      name: 'title',
      title,
      propertyType: PropertyType.STRING
    },
    {
      name: 'details',
      title: 'Описание',
      propertyType: PropertyType.STRING
    }
  ]
};

const statusOptions = [
  { title: 'Проектный', value: 'Проектный' },
  { title: 'Утвержденный', value: 'Утвержденный' },
  { title: 'Архивный', value: 'Архивный' }
];

const vectorTableSchemaBase: SimpleSchema = {
  properties: [
    {
      name: 'details',
      title: 'Описание',
      propertyType: PropertyType.STRING
    },
    {
      name: 'documentType',
      title: 'Тип документа',
      propertyType: PropertyType.CHOICE,
      options: [
        {
          title: 'Генеральный план',
          value: 'GP'
        },
        {
          title: 'СТП  муниципальных районов',
          value: 'STPMO'
        },
        {
          title: 'СТП  субъектов Российской Федерации',
          value: 'STPRF'
        },
        {
          title: 'Правила землепользования и застройки',
          value: 'PZZ'
        },
        {
          title: 'Программа комплексного развития',
          value: 'PKR'
        },
        {
          title: 'Проект планировки территории; Проект межевания территории',
          value: 'PPTPMT'
        }
      ]
    },
    {
      name: 'status',
      title: 'Статус слоя',
      propertyType: PropertyType.CHOICE,
      options: statusOptions
    },
    {
      name: 'fias',
      title: 'Территориальная принадлежность',
      propertyType: PropertyType.FIAS,
      searchMode: 'oktmo'
    },
    {
      name: 'docApproveDate',
      title: 'Дата утверждения векторного документа',
      propertyType: PropertyType.DATETIME
    },
    {
      name: 'docTerminationDate',
      title: 'Дата прекращения действия векторного документа',
      propertyType: PropertyType.DATETIME
    },
    {
      name: 'isPublic',
      title: 'Публичный',
      propertyType: PropertyType.BOOL
    },
    {
      name: 'readyForFts',
      title: 'Полнотекстовый поиск',
      defaultValue: true,
      propertyType: PropertyType.BOOL
    },
    {
      name: 'schemaId',
      title: 'Схема',
      propertyType: PropertyType.STRING,
      readOnly: true
    }
  ]
};

export const vectorTableSchema: SimpleSchema = {
  properties: [
    {
      name: 'title',
      title,
      propertyType: PropertyType.STRING
    },
    {
      name: 'crs',
      title: 'Координатная система',
      readOnly: true,
      propertyType: PropertyType.CHOICE,
      options: projectionsStore.favoriteProjections.map(projection => ({
        title: projection.title,
        value: getProjectionCode(projection)
      }))
    },
    ...vectorTableSchemaBase.properties
  ]
};

export const emptyVectorTableSchema: SimpleSchema = {
  properties: [
    {
      name: 'title',
      title,
      required: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'crs',
      title: 'Координатная система',
      required: true,
      propertyType: PropertyType.CHOICE,
      defaultValue: projectionsStore.defaultProjection
        ? getProjectionCode(projectionsStore.defaultProjection)
        : undefined,
      options: projectionsStore.favoriteProjections.map(projection => ({
        title: projection.title,
        value: getProjectionCode(projection)
      }))
    },
    {
      name: 'schemaId',
      title: 'Схема',
      required: true,
      propertyType: PropertyType.CUSTOM,
      onlyWithGeometry: true,
      ControlComponent: SelectSchemaControl
    },
    ...vectorTableSchemaBase.properties
  ]
};

export interface VectorTableConnection {
  layer: CrgLayer;
  project: CrgProject;
}
