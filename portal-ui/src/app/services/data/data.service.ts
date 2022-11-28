import {
  getDatasetsUrl,
  getDatasetTableRecordsUrl,
  getDatasetTableRecordUrl,
  getDatasetTablesUrl,
  getDatasetTableUrl,
  getDatasetUrl,
  getRecordsCopyUrl,
  getTableConnectionsUrl
} from '../server-urls.service';
import { PropertyType, Schema } from './schema.models';
import { CoordinateEdited, WfsFeature } from '../geoserver/wfs.models';
import { communicationService } from '../communication.service';
import { CrgLayer, CrgProject } from '../gis/projects.models';
import { PageableResponse, PageOptions } from '../models';
import { preparePageOptions } from '../http.utils';
import { Role } from './permissions.models';
import { http } from '../http.service';
import { Coordinate } from 'ol/coordinate';
import { SchemasSelect } from '../../components/SchemasSelect/SchemasSelect';
import { viewedProjections } from '../geoserver/projections.service';

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

export const dataEntitySchema: Schema<NewDataset> = {
  properties: [
    {
      propertyType: PropertyType.STRING,
      title: 'Название',
      name: 'title',
      required: true
    },
    {
      propertyType: PropertyType.STRING,
      title: 'Описание',
      name: 'details'
    }
  ]
};

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

const title = 'Наименование';

export const datasetSchema: Schema<Dataset> = {
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

const vectorTableSchemaBase: Schema<VectorTable> = {
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
    }
  ]
};

export const vectorTableSchema: Schema<VectorTable> = {
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

export const emptyVectorTableSchema: Schema<VectorTable> = {
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

export async function getDatasets(pageOptions: PageOptions): Promise<[Dataset[], number]> {
  const params = preparePageOptions(pageOptions, true);
  const response = await http.get<PageableResponse<Dataset>>(await getDatasetsUrl(), { params });

  return [(response._embedded && response._embedded.datasets) || [], response.page.totalPages];
}

export async function getDatasetsWithParticularOne(
  identifier: string,
  pageOptions: PageOptions
): Promise<[Dataset[], number, number] | undefined> {
  return await http.getPageWithObject<Dataset>(
    await getDatasetsUrl(),
    preparePageOptions(pageOptions, true),
    (item: Dataset) => item.identifier === identifier
  );
}

export async function getAllDatasets(): Promise<Dataset[]> {
  return await http.getPagedOld<Dataset>(await getDatasetsUrl());
}

export async function getDataset(datasetId: string): Promise<Dataset> {
  return await http.get<Dataset>(await getDatasetUrl(datasetId));
}

export async function getDatasetTables(datasetId: string, pageOptions: PageOptions): Promise<[VectorTable[], number]> {
  const url = await getDatasetTablesUrl(datasetId);
  const params = preparePageOptions(pageOptions, true);

  const response = await http.get<PageableResponse<Omit<VectorTable, 'dataset'>>>(url, { params });

  const vectorTables: VectorTable[] = (response._embedded?.tables || []).map(table => ({
    ...table,
    dataset: datasetId
  }));

  return [vectorTables, response.page.totalPages];
}

export async function getDatasetTablesWithParticularOne(
  datasetId: string,
  identifier: string,
  pageOptions: PageOptions
): Promise<[VectorTable[], number, number] | undefined> {
  const response = await http.getPageWithObject<VectorTable>(
    await getDatasetTablesUrl(datasetId),
    preparePageOptions(pageOptions, true),
    (item: VectorTable) => item.identifier === identifier
  );

  if (response) {
    const [tables, totalPages, page] = response;
    tables.forEach(table => {
      table.dataset = datasetId;
    });

    return [tables, totalPages, page];
  }

  return response;
}

export async function getAllDatasetTables(dataset: Dataset): Promise<VectorTable[]> {
  const vectorTables = await http.getPagedOld<Omit<VectorTable, 'dataset'>>(
    await getDatasetTablesUrl(dataset.identifier),
    {
      params: { sort: 'title,asc' }
    }
  );

  return vectorTables.map(table => ({
    ...table,
    dataset: dataset.identifier
  }));
}

export async function createVectorTable(dataset: Dataset, layer: VectorTable): Promise<VectorTable[]> {
  const response = await http.post<VectorTable[]>(await getDatasetTablesUrl(dataset.identifier), layer);
  communicationService.vectorTablesUpdated.emit();

  return response;
}

export async function getVectorTable(datasetId: string, identifier: string): Promise<VectorTable> {
  const response = await http.get<Omit<VectorTable, 'dataset'>>(await getDatasetTableUrl(datasetId, identifier));

  return { ...response, dataset: datasetId };
}

export async function createVectorTableRecord(
  datasetId: string,
  vectorTableId: string,
  feature: WfsFeature
): Promise<WfsFeature> {
  const response = await http.post<WfsFeature>(await getDatasetTableRecordsUrl(datasetId, vectorTableId), feature);
  communicationService.vectorTablesUpdated.emit();

  return response;
}

export async function updateVectorTableRecord(
  datasetId: string,
  vectorTableId: string,
  recordId: string,
  patch: Partial<WfsFeature>
): Promise<void> {
  await http.patch(await getDatasetTableRecordUrl(datasetId, vectorTableId, recordId), patch);
  communicationService.vectorTablesUpdated.emit();
}

export async function updateVectorTable(
  datasetId: string,
  vectorTableId: string,
  patch: Partial<WfsFeature>
): Promise<void> {
  await http.put(await getDatasetTableUrl(datasetId, vectorTableId), patch);
  communicationService.vectorTablesUpdated.emit();
}

export async function copyFeaturesBetweenLayers(
  sourceLayer: CrgLayer,
  targetLayer: CrgLayer,
  features: WfsFeature[]
): Promise<void> {
  const featureIds = features.map(feature => Number(feature.id.split('.')[1]));

  const copyTablesInfo = {
    source: {
      schema: sourceLayer.dataset,
      table: sourceLayer.tableName
    },
    target: {
      schema: targetLayer.dataset,
      table: targetLayer.tableName
    },
    featureIds
  };

  await http.post(await getRecordsCopyUrl(), copyTablesInfo);

  communicationService.featuresUpdated.emit();
}

export async function deleteFeatures(
  datasetId: string,
  vectorTableId: string,
  features: WfsFeature<Coordinate | CoordinateEdited>[]
): Promise<void> {
  const featureIds = features.map(feature => feature.id.split('.')[1]).join(',');

  await http.delete(await getDatasetTableRecordUrl(datasetId, vectorTableId, featureIds));
  communicationService.featuresUpdated.emit();
}

export async function deleteVectorTable(datasetId: string, vectorTableId: string): Promise<void> {
  await http.delete(await getDatasetTableUrl(datasetId, vectorTableId));
  communicationService.vectorTablesUpdated.emit();
}

export async function deleteDataset(identifier: string): Promise<void> {
  await http.delete(await getDatasetUrl(identifier));
  communicationService.datasetsUpdated.emit();
}

export async function updateDataset(identifier: string, patch: Partial<Dataset>): Promise<void> {
  await http.patch(await getDatasetUrl(identifier), patch);
  communicationService.datasetsUpdated.emit();
}

export async function getVectorTableConnections(vectorTableId: string): Promise<VectorTableConnection[]> {
  const params = {
    field: 'table',
    value: vectorTableId
  };

  return await http.get<VectorTableConnection[]>(await getTableConnectionsUrl(), { params });
}

export async function createDataset(newDataset: NewDataset): Promise<void> {
  await http.post(await getDatasetsUrl(), newDataset);
  communicationService.datasetsUpdated.emit();
}

export function tablesEqual(firstTable: VectorTable, ...otherTables: VectorTable[]): boolean {
  const { identifier, dataset } = firstTable;

  return otherTables.every(table => table.identifier === identifier && table.dataset === dataset);
}
