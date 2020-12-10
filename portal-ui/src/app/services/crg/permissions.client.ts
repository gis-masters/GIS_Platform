import { serverProperties } from '../server-properties.service';
import { RoleAssignmentBody } from './permissions.models';
import { CrgProject } from './projects.models';
import { PageableResponse } from '../models';
import { services } from '../services';
import { http } from '../http.service';
import { Toast } from '../../components/Toast/Toast';

export async function getTablePermissions(datasetId: string, tableId: string): Promise<RoleAssignmentBody[]> {
  const dataServerUrl = await serverProperties.dataUrl;
  const url = `${dataServerUrl}/datasets/${datasetId}/tables/${tableId}/roleAssignment`;
  const response = await http.get<PageableResponse<{ permissions: RoleAssignmentBody[] }>>(url, {
    params: { size: '10000' }
  });

  return response._embedded?.permissions || [];
}

export async function addTablePermission(payload: RoleAssignmentBody, datasetId: string, tableId: string) {
  const url = `${await serverProperties.dataUrl}/datasets/${datasetId}/tables/${tableId}/roleAssignment`;

  try {
    await http.post(url, payload);
  } catch (e) {
    handleSavingError(e, payload, 'добавить', 'таблицы', `${datasetId}:${tableId}`);
  }
}

export async function removeTablePermission(payload: RoleAssignmentBody, datasetId: string, tableId: string) {
  const dataServerUrl = await serverProperties.dataUrl;
  const url = `${dataServerUrl}/datasets/${datasetId}/tables/${tableId}/roleAssignment`;

  try {
    await http.delete(`${url}/${payload.id}`);
  } catch (e) {
    handleSavingError(e, payload, 'удалить', 'таблицы', `${datasetId}:${tableId}`);
  }
}

export async function getProjectPermissions(project: CrgProject): Promise<RoleAssignmentBody[]> {
  const list = await http.get<RoleAssignmentBody[]>(`${await serverProperties.projectsUrl}/${project.id}/permissions`);

  return list.map(item => ({ ...item, principalId: Number(item.principalId) }));
}

export async function addProjectPermission(payload: RoleAssignmentBody, project: CrgProject) {
  try {
    await http.post(`${await serverProperties.projectsUrl}/${project.id}/permissions`, payload);
  } catch (e) {
    handleSavingError(e, payload, 'добавить', 'проекта', project.name);
  }
}

export async function removeProjectPermission(payload: RoleAssignmentBody, project: CrgProject) {
  try {
    await http.delete(`${await serverProperties.projectsUrl}/${project.id}/permissions/${payload.id}`);
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
