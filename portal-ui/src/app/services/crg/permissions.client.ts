import {
  getAllPermissionsUrl,
  getAllProjectsPermissionsUrl,
  getProjectPermissionsUrl,
  getProjectPermissionUrl,
  getTableRoleAssignmentUrl
} from '../server-urls.service';
import { ResourcePermissions, RoleAssignmentBody } from './permissions.models';
import { CrgProject } from './projects.models';
import { services } from '../services';
import { http } from '../http.service';
import { Toast } from '../../components/Toast/Toast';
import { DataEntityType } from '../data.service';

export async function getTablePermissions(datasetId: string, tableId: string): Promise<RoleAssignmentBody[]> {
  try {
    return await http.getPaged<RoleAssignmentBody>(await getTableRoleAssignmentUrl(datasetId, tableId));
  } catch (e) {
    Toast.error(`Ошибка получения прав для таблицы ${tableId} в наборе ${datasetId}`);
    return [];
  }
}

export async function getAllTablesPermissions(): Promise<ResourcePermissions[]> {
  try {
    const response = await http.getPaged<ResourcePermissions>(await getAllPermissionsUrl());

    return response.filter(({ type, permissions }) => type === DataEntityType.TABLE && permissions?.length);
  } catch (e) {
    Toast.error(`Ошибка получения прав для списка таблиц`);

    return [];
  }
}

export async function addTablePermission(payload: RoleAssignmentBody, datasetId: string, tableId: string) {
  const url = await getTableRoleAssignmentUrl(datasetId, tableId);

  try {
    await http.post(url, payload);
  } catch (e) {
    handleSavingError(e, payload, 'добавить', 'таблицы', `${datasetId}:${tableId}`);
  }
}

export async function removeTablePermission(payload: RoleAssignmentBody, datasetId: string, tableId: string) {
  const url = await getTableRoleAssignmentUrl(datasetId, tableId);

  try {
    await http.delete(`${url}/${payload.id}`);
  } catch (e) {
    handleSavingError(e, payload, 'удалить', 'таблицы', `${datasetId}:${tableId}`);
  }
}

export async function getProjectPermissions(project: CrgProject): Promise<RoleAssignmentBody[]> {
  try {
    const list = await http.get<RoleAssignmentBody[]>(await getProjectPermissionsUrl(project.id));

    return list.map(item => ({ ...item, principalId: Number(item.principalId) }));
  } catch (e) {
    Toast.error(`Ошибка получения прав для проекта ${project.id}`);

    return [];
  }
}

export async function getAllProjectsPermissions(): Promise<{ [projectId: string]: RoleAssignmentBody[] }> {
  try {
    return await http.get<{ [projectId: string]: RoleAssignmentBody[] }>(await getAllProjectsPermissionsUrl());
  } catch (e) {
    Toast.error(`Ошибка получения прав для списка проектов`);

    return {};
  }
}

export async function addProjectPermission(payload: RoleAssignmentBody, project: CrgProject) {
  try {
    await http.post(await getProjectPermissionsUrl(project.id), payload);
  } catch (e) {
    handleSavingError(e, payload, 'добавить', 'проекта', project.name);
  }
}

export async function removeProjectPermission(payload: RoleAssignmentBody, project: CrgProject) {
  try {
    await http.delete(await getProjectPermissionUrl(project.id, payload.id));
  } catch (e) {
    handleSavingError(e, payload, 'удалить', 'проекта', project.name);
  }
}

function handleSavingError(
  e: any,
  payload: RoleAssignmentBody,
  actionType: string,
  entityType: string,
  entityName: string
) {
  const errText = `Не удалось ${actionType} разрешение "${payload.role}" для ${entityType} "${entityName}"`;
  Toast.warn(errText);
  services.logger.error(errText, e);
}
