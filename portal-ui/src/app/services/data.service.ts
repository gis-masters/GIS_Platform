import { getDatasetsUrl, getDatasetTablesUrl, getDatasetTableUrl, getTableConnectionsUrl } from './server-urls.service';
import { CrgLayer, CrgProject } from './crg/projects.models';
import { PageableResponse, SortDir } from './models';
import { Role } from './crg/permissions.models';
import { http } from './http.service';

export enum DataEntityType {
  SCHEMA = 'SCHEMA',
  TABLE = 'TABLE'
}

export interface DataEntity {
  title?: string;
  identifier: string;
  permission: Role;
  details?: string;
  type: DataEntityType;
  createdAt?: string;
  itemsCount: number;
}

export interface DataSet extends DataEntity {
  type: DataEntityType.SCHEMA;
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

export async function getDataSets(
  page: number,
  pageSize: number,
  sort?: string,
  sortDir?: SortDir,
  filter?: { [key: string]: string }
): Promise<[DataSet[], number]> {
  const response = await http.get<PageableResponse<{ datasets: DataSet[] }>>(await getDatasetsUrl(), {
    params: { page, size: pageSize, sort: sort ? `${sort},${sortDir}` : undefined, ...(filter || {}) }
  });

  return [(response._embedded && response._embedded.datasets) || [], response.page.totalPages];
}

export async function getDataSetTables(
  dataSet: DataSet,
  page: number,
  pageSize: number,
  sort?: string,
  sortDir?: SortDir,
  filter?: { [key: string]: string }
): Promise<[DataTable[], number]> {
  const response = await http.get<PageableResponse<{ tables: Omit<DataTable, 'dataset'>[] }>>(
    await getDatasetTablesUrl(dataSet.identifier),
    { params: { page, size: pageSize, sort: sort ? `${sort},${sortDir}` : undefined, ...(filter || {}) } }
  );

  const dataTabes: DataTable[] = (response._embedded?.tables || []).map(table => ({
    ...table,
    dataset: dataSet.identifier
  }));

  return [dataTabes, response.page.totalPages];
}

export async function getDataTable(datasetId: string, dataTableId: string): Promise<DataTable> {
  const response = await http.get<Omit<DataTable, 'dataset'>>(await getDatasetTableUrl(datasetId, dataTableId));

  return { ...response, dataset: datasetId };
}

export async function getDataTableConnections(dataTableId: string): Promise<DataTableConnection[]> {
  const params = {
    field: 'table',
    value: dataTableId
  };

  return await http.get<DataTableConnection[]>(await getTableConnectionsUrl(dataTableId), { params });
}

export async function createDataset(title: string, details: string) {
  await http.post(await getDatasetsUrl(), { title, details });
}
