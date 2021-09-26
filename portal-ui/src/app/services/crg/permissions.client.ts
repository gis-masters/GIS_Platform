import {
  getAllPermissionsUrl,
  getAllProjectsPermissionsUrl,
  getDatasetRoleAssignmentUrl,
  getProjectPermissionsUrl,
  getProjectPermissionUrl,
  getTableRoleAssignmentUrl
} from '../server-urls.service';
import { ResourcePermissions, RoleAssignmentBody } from './permissions.models';
import { CrgProject } from './projects.models';
import { services } from '../services';
import { http } from '../http.service';
import { Toast } from '../../components/Toast/Toast';
import { ExplorerItemEntityType } from '../../components/Explorer/Explorer.models';

export async function getTablePermissions(url: string): Promise<RoleAssignmentBody[]> {
  return http.getPaged<RoleAssignmentBody>(url);
}

export async function getAllTablesAndDatasetsPermissions(): Promise<ResourcePermissions[]> {
  try {
    const response = await http.getPaged<ResourcePermissions>(await getAllPermissionsUrl());

    return response.filter(({ permissions }) => permissions?.length);
  } catch {
    Toast.error('Ошибка получения прав для списка таблиц');

    return [];
  }
}

export async function addEntityPermission(
  payload: RoleAssignmentBody,
  url: string,
  title: string,
  itemEntityType?: ExplorerItemEntityType
): Promise<void> {
  try {
    await http.post(url, payload);
  } catch (error) {
    handleSavingError(error, payload, 'добавить', `${itemEntityType}`, `${title}`);
  }
}

export async function removeEntityPermission(
  payload: RoleAssignmentBody,
  url: string,
  title: string,
  itemEntityType?: ExplorerItemEntityType
): Promise<void> {
  try {
    await http.delete(`${url}/${payload.id}`);
  } catch (error) {
    handleSavingError(error, payload, 'удалить', `${itemEntityType}`, `${title}`);
  }
}

export async function addTablePermission(
  payload: RoleAssignmentBody,
  datasetId: string,
  tableId: string
): Promise<void> {
  const url = await getTableRoleAssignmentUrl(datasetId, tableId);

  try {
    await http.post(url, payload);
  } catch (error) {
    handleSavingError(error, payload, 'добавить', 'таблицы', `${datasetId}:${tableId}`);
  }
}

export async function removeTablePermission(
  payload: RoleAssignmentBody,
  datasetId: string,
  tableId: string
): Promise<void> {
  const url = await getTableRoleAssignmentUrl(datasetId, tableId);

  try {
    await http.delete(`${url}/${payload.id}`);
  } catch (error) {
    handleSavingError(error, payload, 'удалить', 'таблицы', `${datasetId}:${tableId}`);
  }
}

export async function addDatasetPermission(payload: RoleAssignmentBody, datasetId: string): Promise<void> {
  const url = await getDatasetRoleAssignmentUrl(datasetId);

  try {
    await http.post(url, payload);
  } catch (error) {
    handleSavingError(error, payload, 'добавить', 'набора данных', datasetId);
  }
}

export async function removeDatasetPermission(payload: RoleAssignmentBody, datasetId: string): Promise<void> {
  const url = await getDatasetRoleAssignmentUrl(datasetId);

  try {
    await http.delete(`${url}/${payload.id}`);
  } catch (error) {
    handleSavingError(error, payload, 'удалить', 'набора данных', datasetId);
  }
}

export async function getProjectPermissions(project: CrgProject): Promise<RoleAssignmentBody[]> {
  try {
    const list = await http.get<RoleAssignmentBody[]>(await getProjectPermissionsUrl(project.id));

    return list.map(item => ({ ...item, principalId: Number(item.principalId) }));
  } catch {
    Toast.error(`Ошибка получения прав для проекта ${project.id}`);

    return [];
  }
}

export async function getAllProjectsPermissions(): Promise<{ [projectId: string]: RoleAssignmentBody[] }> {
  try {
    return await http.get<{ [projectId: string]: RoleAssignmentBody[] }>(await getAllProjectsPermissionsUrl());
  } catch {
    Toast.error('Ошибка получения прав для списка проектов');

    return {};
  }
}

export async function addProjectPermission(payload: RoleAssignmentBody, project: CrgProject): Promise<void> {
  try {
    await http.post(await getProjectPermissionsUrl(project.id), payload);
  } catch (error) {
    handleSavingError(error, payload, 'добавить', 'проекта', project.name);
  }
}

export async function removeProjectPermission(payload: RoleAssignmentBody, project: CrgProject): Promise<void> {
  try {
    await http.delete(await getProjectPermissionUrl(project.id, payload.id));
  } catch (error) {
    handleSavingError(error, payload, 'удалить', 'проекта', project.name);
  }
}

function handleSavingError(
  e: unknown,
  payload: RoleAssignmentBody,
  actionType: string,
  entityType: string,
  entityName: string
) {
  const errText = `Не удалось ${actionType} разрешение "${payload.role}" для ${entityType} "${entityName}"`;
  Toast.warn(errText);
  services.logger.error(errText, e);
}
