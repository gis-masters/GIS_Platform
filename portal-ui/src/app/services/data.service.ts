import { getDatasetsUrl, getDatasetTablesUrl, getDatasetTableUrl } from './server-urls.service';
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

  // убрать после закрытия бага #2250
  if (response.identifier.includes('.')) {
    response.identifier = response.identifier.split('.')[1];
  }

  return { ...response, dataset: datasetId };
}

export async function createDataset(title: string, details: string) {
  await http.post(await getDatasetsUrl(), { title, details });
}
