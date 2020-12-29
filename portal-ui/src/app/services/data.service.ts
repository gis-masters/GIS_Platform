import { getDatasetsUrl, getDatasetTablesUrl } from './server-urls.service';
import { PageableResponse, SortDir } from './models';
import { Role } from './crg/permissions.models';
import { http } from './http.service';

export interface DataEntity {
  title?: string;
  identifier: string;
  permission: Role;
  details?: string;
  type: 'SCHEMA' | 'TABLE';
  createdAt?: string;
  itemsCount: number;
}

export interface DataSet extends DataEntity {
  type: 'SCHEMA';
}

export interface DataTable extends DataEntity {
  type: 'TABLE';
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
  const response = await http.get<PageableResponse<{ tables: DataTable[] }>>(
    await getDatasetTablesUrl(dataSet.identifier),
    { params: { page, size: pageSize, sort: sort ? `${sort},${sortDir}` : undefined, ...(filter || {}) } }
  );

  return [(response._embedded && response._embedded.tables) || [], response.page.totalPages];
}

export async function createDataset(title: string, details: string) {
  await http.post(await getDatasetsUrl(), { title, details });
}
