import { http } from './http.service';
import { PageableResponse, SortDir } from './models';
import { Role } from './crg/permissions.service';
import { serverProperties } from './server-properties.service';

export interface DataEntity {
  title?: string;
  resourceIdentifier: string;
  permission: Role;
  details?: string;
  type: 'SCHEMA' | 'TABLE';
  createdAt?: string;
}

export interface DataSet extends DataEntity {
  type: 'SCHEMA';
  itemsCount: number;
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
  const response = await http.get<PageableResponse<{ datasets: DataSet[] }>>(
    `${await serverProperties.dataUrl}/datasets`,
    { params: { page, size: pageSize, sort: sort ? `${sort},${sortDir}` : undefined, ...(filter || {}) } }
  );

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
    `${await serverProperties.dataUrl}/datasets/${dataSet.resourceIdentifier}/tables`,
    { params: { page, size: pageSize, sort: sort ? `${sort},${sortDir}` : undefined, ...(filter || {}) } }
  );

  return [(response._embedded && response._embedded.tables) || [], response.page.totalPages];
}
