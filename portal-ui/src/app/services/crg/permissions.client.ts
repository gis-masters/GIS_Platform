import { getProjectPermissionsUrl, getProjectPermissionUrl, getTableRoleAssignmentUrl } from '../server-urls.service';
import { RoleAssignmentBody } from './permissions.models';
import { CrgProject } from './projects.models';
import { PageableResponse } from '../models';
import { services } from '../services';
import { http } from '../http.service';
import { Toast } from '../../components/Toast/Toast';

export async function getTablePermissions(datasetId: string, tableId: string): Promise<RoleAssignmentBody[]> {
  const url = await getTableRoleAssignmentUrl(datasetId, tableId);
  const response = await http.get<PageableResponse<{ permissions: RoleAssignmentBody[] }>>(url, {
    params: { size: '10000' }
  });

  return response._embedded?.permissions || [];
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
  const list = await http.get<RoleAssignmentBody[]>(await getProjectPermissionsUrl(project.id));

  return list.map(item => ({ ...item, principalId: Number(item.principalId) }));
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
