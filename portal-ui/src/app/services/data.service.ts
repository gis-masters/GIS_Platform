import {
  getDatasetsUrl,
  getDatasetTableRecordsUrl,
  getDatasetTableRecordUrl,
  getDatasetTablesUrl,
  getDatasetTableUrl,
  getDatasetUrl,
  getTableConnectionsUrl
} from './server-urls.service';
import { PropertyType, Schema } from './crg/schema.models';
import { WfsFeature } from './geoserver/wfs.models';
import { communicationService } from './communication.service';
import { CrgLayer, CrgProject } from './crg/projects.models';
import { PageableResponse, PageOptions } from './models';
import { preparePageOptions } from './http.utils';
import { Role } from './crg/permissions.models';
import { http } from './http.service';

export enum DataEntityType {
  DATASET = 'SCHEMA',
  TABLE = 'TABLE',
  LIBRARY = 'LIBRARY'
}

export interface DataEntity {
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

export interface DataTable extends DataEntity {
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

export const datasetSchema: Schema<Dataset> = {
  properties: [
    {
      name: 'title',
      title: 'Наименование',
      propertyType: PropertyType.STRING
    },
    {
      name: 'details',
      title: 'Описание',
      propertyType: PropertyType.STRING
    }
  ]
};

export const dataTableSchema: Schema<DataTable> = {
  properties: [
    {
      name: 'title',
      title: 'Наименование слоя',
      propertyType: PropertyType.STRING
    },
    {
      name: 'details',
      title: 'Описание слоя',
      propertyType: PropertyType.STRING
    },
    {
      name: 'crs',
      title: 'Координатная система',
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
      options: [
        { title: 'Проектный', value: 'Проектный' },
        { title: 'Утвержденный', value: 'Утвержденный' },
        { title: 'Архивный', value: 'Архивный' }
      ]
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

export interface DataTableConnection {
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
  return await http.getPaged<Dataset>(await getDatasetsUrl());
}

export async function getDataset(datasetId: string): Promise<Dataset> {
  return await http.get<Dataset>(await getDatasetUrl(datasetId));
}

export async function getDatasetTables(datasetId: string, pageOptions: PageOptions): Promise<[DataTable[], number]> {
  const url = await getDatasetTablesUrl(datasetId);
  const params = preparePageOptions(pageOptions, true);

  const response = await http.get<PageableResponse<Omit<DataTable, 'dataset'>>>(url, { params });

  const dataTables: DataTable[] = (response._embedded?.tables || []).map(table => ({
    ...table,
    dataset: datasetId
  }));

  return [dataTables, response.page.totalPages];
}

export async function getDatasetTablesWithParticularOne(
  datasetId: string,
  identifier: string,
  pageOptions: PageOptions
): Promise<[DataTable[], number, number] | undefined> {
  const response = await http.getPageWithObject<DataTable>(
    await getDatasetTablesUrl(datasetId),
    preparePageOptions(pageOptions, true),
    (item: DataTable) => item.identifier === identifier
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

export async function getAllDatasetTables(dataset: Dataset): Promise<DataTable[]> {
  const dataTables = await http.getPaged<Omit<DataTable, 'dataset'>>(await getDatasetTablesUrl(dataset.identifier), {
    params: { sort: 'title,asc' }
  });

  return dataTables.map(table => ({
    ...table,
    dataset: dataset.identifier
  }));
}

export async function getDataTable(datasetId: string, identifier: string): Promise<DataTable> {
  const response = await http.get<Omit<DataTable, 'dataset'>>(await getDatasetTableUrl(datasetId, identifier));

  return { ...response, dataset: datasetId };
}

export async function createDataTableRecord(
  datasetId: string,
  dataTableId: string,
  feature: WfsFeature
): Promise<WfsFeature> {
  const response = await http.post<WfsFeature>(await getDatasetTableRecordsUrl(datasetId, dataTableId), feature);
  communicationService.datasetsUpdated.emit();

  return response;
}

export async function updateDataTableRecord(
  datasetId: string,
  dataTableId: string,
  recordId: string,
  patch: Partial<WfsFeature>
): Promise<void> {
  await http.patch(await getDatasetTableRecordUrl(datasetId, dataTableId, recordId), patch);
  communicationService.dataTablesUpdated.emit();
}

export async function updateDataTable(
  datasetId: string,
  dataTableId: string,
  patch: Partial<WfsFeature>
): Promise<void> {
  await http.put(await getDatasetTableUrl(datasetId, dataTableId), patch);
  communicationService.dataTablesUpdated.emit();
}

export async function deleteDataTableRecord(datasetId: string, dataTableId: string, recordId: string): Promise<void> {
  await http.delete(await getDatasetTableRecordUrl(datasetId, dataTableId, recordId.split('.')[1]));
  communicationService.datasetsUpdated.emit();
}

export async function deleteDataTable(datasetId: string, dataTableId: string): Promise<void> {
  await http.delete(await getDatasetTableUrl(datasetId, dataTableId));
  communicationService.datasetsUpdated.emit();
}

export async function deleteDataset(identifier: string): Promise<void> {
  await http.delete(await getDatasetUrl(identifier));
  communicationService.datasetsUpdated.emit();
}

export async function updateDataset(identifier: string, patch: Partial<Dataset>): Promise<void> {
  await http.patch(await getDatasetUrl(identifier), patch);
  communicationService.datasetsUpdated.emit();
}

export async function getDataTableConnections(dataTableId: string): Promise<DataTableConnection[]> {
  const params = {
    field: 'table',
    value: dataTableId
  };

  return await http.get<DataTableConnection[]>(await getTableConnectionsUrl(), { params });
}

export async function createDataset(newDataset: NewDataset): Promise<void> {
  await http.post(await getDatasetsUrl(), newDataset);
  communicationService.datasetsUpdated.emit();
}

export function tablesEqual(firstTable: DataTable, ...otherTables: DataTable[]): boolean {
  const { identifier, dataset } = firstTable;

  return otherTables.every(table => table.identifier === identifier && table.dataset === dataset);
}
