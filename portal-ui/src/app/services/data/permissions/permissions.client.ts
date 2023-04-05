import {
  getAllPermissionsUrl,
  getAllProjectsPermissionsUrl,
  getDatasetRoleAssignmentsUrl,
  getDatasetRoleAssignmentUrl,
  getProjectPermissionsUrl,
  getProjectPermissionUrl,
  getTableRoleAssignmentsUrl,
  getTableRoleAssignmentUrl
} from '../../api/server-urls.service';
import { http } from '../../api/http.service';

import { ResourcePermissions, RoleAssignmentBody } from './permissions.models';

export async function _reqGetProjectPermissions(url: string): Promise<RoleAssignmentBody[]> {
  return http.get<RoleAssignmentBody[]>(url);
}

export async function _reqGetTablePermissions(url: string): Promise<RoleAssignmentBody[]> {
  return http.getPagedOld<RoleAssignmentBody>(url);
}

export async function _reqGetAllTablesAndDatasetsPermissions(): Promise<ResourcePermissions[]> {
  return await http.getPagedOld<ResourcePermissions>(await getAllPermissionsUrl());
}

export async function _reqAddEntityPermission(payload: RoleAssignmentBody, url: string): Promise<void> {
  await http.post(url, payload);
}

export async function _reqRemoveEntityPermission(id: number, url: string): Promise<void> {
  await http.delete(`${url}/${id}`);
}

export async function _reqAddTablePermission(
  payload: RoleAssignmentBody,
  datasetIdentifier: string,
  tableIdentifier: string
): Promise<void> {
  await http.post(await getTableRoleAssignmentsUrl(datasetIdentifier, tableIdentifier), payload);
}

export async function _reqRemoveTablePermission(
  payload: RoleAssignmentBody,
  datasetIdentifier: string,
  tableIdentifier: string
): Promise<void> {
  await http.delete(await getTableRoleAssignmentUrl(payload.id, datasetIdentifier, tableIdentifier));
}

export async function _reqAddDatasetPermission(payload: RoleAssignmentBody, datasetIdentifier: string): Promise<void> {
  await http.post(await getDatasetRoleAssignmentsUrl(datasetIdentifier), payload);
}

export async function _reqRemoveDatasetPermission(id: number, datasetIdentifier: string): Promise<void> {
  await http.delete(await getDatasetRoleAssignmentUrl(id, datasetIdentifier));
}

export async function _reqGetAllProjectsPermissions(): Promise<{ [projectId: string]: RoleAssignmentBody[] }> {
  return await http.get<{ [projectId: string]: RoleAssignmentBody[] }>(await getAllProjectsPermissionsUrl());
}

export async function _reqAddProjectPermission(payload: RoleAssignmentBody, projectId: number): Promise<void> {
  await http.post(await getProjectPermissionsUrl(projectId), payload);
}

export async function _reqRemoveProjectPermission(id: number, projectId: number): Promise<void> {
  await http.delete(await getProjectPermissionUrl(projectId, id));
}
