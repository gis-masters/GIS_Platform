import {
  getDatasetsUrl,
  getDatasetTablesUrl,
  getDatasetTableUrl,
  getDatasetUrl,
  getTableConnectionsUrl
} from './server-urls.service';
import { CrgLayer, CrgProject } from './crg/projects.models';
import { PageableResponse, PageOptions, SortDir } from './models';
import { Role } from './crg/permissions.models';
import { http } from './http.service';
import { communicationService } from './communication.service';
import { preparePageOptions } from './http.utils';

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
}

export type NewDataset = Pick<Dataset, 'title' | 'details'>;

export interface DataTable extends DataEntity {
  type: DataEntityType.TABLE;
  crs: string;
  schemaId: string;
  dataset: string;
  role: Role;
}

export interface DataTableConnection {
  layer: CrgLayer;
  project: CrgProject;
}

export async function getDatasets(
  page: number,
  pageSize: number,
  sort?: string,
  sortDir?: SortDir,
  filter?: { [key: string]: string }
): Promise<[Dataset[], number]> {
  const params = { page, size: pageSize, sort: sort ? `${sort},${sortDir}` : undefined, ...(filter || {}) };
  const response = await http.get<PageableResponse<Dataset>>(await getDatasetsUrl(), { params });

  return [(response._embedded && response._embedded.datasets) || [], response.page.totalPages];
}

export async function getDatasetsWithParticularOne(
  identifier: string,
  pageOptions: PageOptions
): Promise<[Dataset[], number, number] | undefined> {
  return await http.getPageWithObject<Dataset>(
    await getDatasetsUrl(),
    pageOptions,
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
  const response = await http.get<PageableResponse<Omit<DataTable, 'dataset'>>>(await getDatasetTablesUrl(datasetId), {
    params: preparePageOptions(pageOptions)
  });

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
    pageOptions,
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
  const dataTables = await http.getPaged<Omit<DataTable, 'dataset'>>(await getDatasetTablesUrl(dataset.identifier));

  return dataTables.map(table => ({
    ...table,
    dataset: dataset.identifier
  }));
}

export async function getDataTable(datasetId: string, identifier: string): Promise<DataTable> {
  const response = await http.get<Omit<DataTable, 'dataset'>>(await getDatasetTableUrl(datasetId, identifier));

  return { ...response, dataset: datasetId };
}

export async function deleteDataTable(datasetId: string, dataTableId: string): Promise<void> {
  await http.delete(await getDatasetTableUrl(datasetId, dataTableId));
  communicationService.dataTablesUpdated.emit();
}

export async function deleteDataset(identifier: string): Promise<void> {
  await http.delete(await getDatasetUrl(identifier));
  communicationService.datasetsUpdated.emit();
}

export async function getDataTableConnections(dataTableId: string): Promise<DataTableConnection[]> {
  const params = {
    field: 'table',
    value: dataTableId
  };

  return await http.get<DataTableConnection[]>(await getTableConnectionsUrl(), { params });
}

export async function createDataset(title: string, details: string): Promise<void> {
  await http.post(await getDatasetsUrl(), { title, details });
}

export function tablesEqual(firstTable: DataTable, ...otherTables: DataTable[]): boolean {
  const { identifier, dataset } = firstTable;

  return otherTables.every(table => table.identifier === identifier && table.dataset === dataset);
}
