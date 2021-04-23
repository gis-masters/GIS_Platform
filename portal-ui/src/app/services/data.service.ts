import { getDatasetsUrl, getDatasetTablesUrl, getDatasetTableUrl, getTableConnectionsUrl } from './server-urls.service';
import { CrgLayer, CrgProject } from './crg/projects.models';
import { PageableResponse, SortDir } from './models';
import { Role } from './crg/permissions.models';
import { http } from './http.service';
import { communicationService } from './communication.service';

export enum DataEntityType {
  DATASET = 'SCHEMA',
  TABLE = 'TABLE',
  LIBRARY = 'LIBRARY'
}

export interface DataEntity {
  title: string;
  identifier: string;
  permission: Role;
  details?: string;
  type: DataEntityType;
  createdAt?: string;
  itemsCount?: number;
  schemaId?: string;
}

export interface Dataset extends DataEntity {
  type: DataEntityType.DATASET;
}

export interface DataTable extends DataEntity {
  type: DataEntityType.TABLE;
  crs: string;
  schemaId: string;
  dataset: string;
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
  const response = await http.get<PageableResponse<{ datasets: Dataset[] }>>(await getDatasetsUrl(), { params });

  return [(response._embedded && response._embedded.datasets) || [], response.page.totalPages];
}

export async function getAllDatasets(): Promise<Dataset[]> {
  return await http.getPaged<Dataset>(await getDatasetsUrl());
}

export async function getDatasetTables(
  dataset: Dataset,
  page: number,
  pageSize: number,
  sort?: string,
  sortDir?: SortDir,
  filter?: { [key: string]: string }
): Promise<[DataTable[], number]> {
  const response = await http.get<PageableResponse<{ tables: Omit<DataTable, 'dataset'>[] }>>(
    await getDatasetTablesUrl(dataset.identifier),
    { params: { page, size: pageSize, sort: sort ? `${sort},${sortDir}` : undefined, ...(filter || {}) } }
  );

  const dataTables: DataTable[] = (response._embedded?.tables || []).map(table => ({
    ...table,
    dataset: dataset.identifier
  }));

  return [dataTables, response.page.totalPages];
}

export async function getAllDatasetTables(dataset: Dataset): Promise<DataTable[]> {
  const dataTables = await http.getPaged<Omit<DataTable, 'dataset'>>(await getDatasetTablesUrl(dataset.identifier));

  return dataTables.map(table => ({
    ...table,
    dataset: dataset.identifier
  }));
}

export async function getDataTable(datasetId: string, dataTableId: string): Promise<DataTable> {
  const response = await http.get<Omit<DataTable, 'dataset'>>(await getDatasetTableUrl(datasetId, dataTableId));

  return { ...response, dataset: datasetId };
}

export async function deleteDataTable(datasetId: string, dataTableId: string): Promise<void> {
  await http.delete(await getDatasetTableUrl(datasetId, dataTableId));
  communicationService.dataTablesUpdated.emit();
}

export async function getDataTableConnections(dataTableId: string): Promise<DataTableConnection[]> {
  const params = {
    field: 'table',
    value: dataTableId
  };

  return await http.get<DataTableConnection[]>(await getTableConnectionsUrl(), { params });
}

export async function createDataset(title: string, details: string) {
  await http.post(await getDatasetsUrl(), { title, details });
}

export function tablesEqual(firstTable: DataTable, ...otherTables: DataTable[]): boolean {
  const { identifier, dataset } = firstTable;

  return otherTables.every(table => table.identifier === identifier && table.dataset === dataset);
}
