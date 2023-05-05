import { SchemasSelect } from '../../../components/SchemasSelect/SchemasSelect';
import { viewedProjections } from '../../geoserver/projections.service';
import { CrgProject } from '../../gis/projects/projects.models';
import { PropertyType, SimpleSchema } from '../schema/schema.models';
import { CrgLayer } from '../../gis/layers/layers.models';
import { Role } from '../permissions/permissions.models';

export enum DataEntityType {
  DATASET = 'SCHEMA',
  TABLE = 'TABLE',
  LIBRARY = 'LIBRARY'
}

export interface DataEntity {
  id?: number;
  title: string;
  identifier: string;
  details?: string;
  type: DataEntityType;
  createdAt?: string;
  itemsCount?: number;
  schemaId?: string;
  role?: Role;
}

export interface Dataset extends DataEntity {
  type: DataEntityType.DATASET;
  role: Role;
  id?: number;
}

export type NewDataset = Pick<Dataset, 'title' | 'details'>;

export interface VectorTable extends DataEntity {
  type: DataEntityType.TABLE;
  crs: string;
  schemaId: string;
  dataset: string;
  role: Role;
  id?: number;
  documentType?: string;
  status?: string;
  fias?: string;
  docApproveDate?: string;
  docTerminationDate?: string;
  isPublic?: boolean;
}

export type NewVectorTable = Pick<VectorTable, 'title' | 'crs' | 'schemaId'>;

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
      options: viewedProjections.map(({ id, title }) => ({ title: title, value: id }))
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
      options: viewedProjections.map(({ id, title }) => ({ title: title, value: id }))
    },
    {
      name: 'schemaId',
      title: 'Схема',
      required: true,
      propertyType: PropertyType.CUSTOM,
      ControlComponent: SchemasSelect
    },
    ...vectorTableSchemaBase.properties
  ]
};

export interface VectorTableConnection {
  layer: CrgLayer;
  project: CrgProject;
}
