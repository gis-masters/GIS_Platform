import { AxiosError } from 'axios';

import { ExplorerItemEntityTypeTitle } from '../../components/Explorer/Explorer.models';
import { Toast } from '../../components/Toast/Toast';
import { currentProject } from '../../stores/CurrentProject.store';
import { currentUser } from '../../stores/CurrentUser.store';
import { getLibraryRecordFiles } from '../data/files/files.util';
import { LibraryRecord } from '../data/library/library.models';
import { getLibraryRecord } from '../data/library/library.service';
import { Schema } from '../data/schema/schema.models';
import { VectorTable } from '../data/vectorData/vectorData.models';
import { getVectorTable } from '../data/vectorData/vectorData.service';
import { CrgLayer, CrgLayerType } from '../gis/layers/layers.models';
import { getLayerSchema } from '../gis/layers/layers.service';
import { isVectorFromFile } from '../gis/layers/layers.utils';
import { CrgProject } from '../gis/projects/projects.models';
import { services } from '../services';
import { permissionsClient } from './permissions.client';
import {
  PermissionType,
  ProjectPermissionPoint,
  projectRolesPermissionPoints,
  Role,
  RoleAssignmentBody,
  TablePermissionPoint,
  tableRolesPermissionPoints
} from './permissions.models';
import { getRoles } from './permissions.utils';

export async function getProjectPermissions(url: string): Promise<RoleAssignmentBody[]> {
  return await permissionsClient.getProjectPermissions(url);
}

export async function getAllPermissions(url: string): Promise<RoleAssignmentBody[]> {
  return await permissionsClient.getAllPermissions(url);
}

export async function addEntityPermission(
  payload: RoleAssignmentBody,
  url: string,
  title: string,
  itemEntityType?: ExplorerItemEntityTypeTitle
): Promise<void> {
  try {
    await permissionsClient.addEntityPermission(payload, url);
  } catch (error) {
    handleSavingError(error, payload, 'добавить', `${itemEntityType}`, `${title}`);
  }
}

export async function removeEntityPermission(
  payload: RoleAssignmentBody,
  url: string,
  title: string,
  itemEntityType?: ExplorerItemEntityTypeTitle
): Promise<void> {
  try {
    if (!payload.id) {
      throw new Error('Ошибка удаления прав, не найден id');
    }

    await permissionsClient.removeEntityPermission(payload.id, url);
  } catch (error) {
    handleSavingError(error, payload, 'удалить', `${itemEntityType}`, `${title}`);
  }
}

export async function addTablePermission(
  payload: RoleAssignmentBody,
  datasetIdentifier: string,
  tableIdentifier: string
): Promise<void> {
  try {
    await permissionsClient.addTablePermission(payload, datasetIdentifier, tableIdentifier);
  } catch (error) {
    handleSavingError(error, payload, 'добавить', 'таблицы', `${datasetIdentifier}:${tableIdentifier}`);
  }
}

export async function removeTablePermission(
  payload: RoleAssignmentBody,
  datasetIdentifier: string,
  tableIdentifier: string
): Promise<void> {
  try {
    await permissionsClient.removeTablePermission(payload, datasetIdentifier, tableIdentifier);
  } catch (error) {
    handleSavingError(error, payload, 'удалить', 'таблицы', `${datasetIdentifier}:${tableIdentifier}`);
  }
}

export async function addDatasetPermission(payload: RoleAssignmentBody, datasetIdentifier: string): Promise<void> {
  try {
    await permissionsClient.addDatasetPermission(payload, datasetIdentifier);
  } catch (error) {
    handleSavingError(error, payload, 'добавить', 'набора данных', datasetIdentifier);
  }
}

export async function removeDatasetPermission(payload: RoleAssignmentBody, datasetIdentifier: string): Promise<void> {
  try {
    if (!payload.id) {
      throw new Error('Ошибка удаления прав для набора данных, не найден id');
    }

    await permissionsClient.removeDatasetPermission(payload.id, datasetIdentifier);
  } catch (error) {
    handleSavingError(error, payload, 'удалить', 'набора данных', datasetIdentifier);
  }
}

export async function addProjectPermission(payload: RoleAssignmentBody, project: CrgProject): Promise<void> {
  try {
    await permissionsClient.addProjectPermission(payload, project.id);
  } catch (error) {
    handleSavingError(error, payload, 'добавить', 'проекта', project.name);
  }
}

export async function removeProjectPermission(payload: RoleAssignmentBody, project: CrgProject): Promise<void> {
  try {
    if (!payload.id) {
      throw new Error('Ошибка удаления прав для проекта, не найден id');
    }

    await permissionsClient.removeProjectPermission(payload.id, project.id);
  } catch (error) {
    handleSavingError(error, payload, 'удалить', 'проекта', project.name);
  }
}

export async function isLayerReadAllowed(layer: CrgLayer): Promise<boolean> {
  if (
    currentUser.isAdmin ||
    layer.type === CrgLayerType.EXTERNAL ||
    layer.type === CrgLayerType.EXTERNAL_GEOSERVER ||
    layer.type === CrgLayerType.EXTERNAL_NSPD
  ) {
    return true;
  }

  if (layer.dataset && layer.tableName && layer.type === CrgLayerType.VECTOR) {
    return await isFeaturesReadAllowed(layer.dataset, layer.tableName);
  } else if (layer.type && (layer.type === CrgLayerType.RASTER || isVectorFromFile(layer.type))) {
    return await isLayerFromFileReadAllowed(layer);
  }

  return false;
}

export async function isRecordUpdateAllowed(record: LibraryRecord): Promise<boolean> {
  const libraryRecord = record.role ? record : await getLibraryRecord(record.libraryTableName, record.id);

  if (!libraryRecord.role) {
    return false;
  }

  return checkIsUpdateAllowed(libraryRecord.role);
}

export function checkIsUpdateAllowed(role: Role): boolean {
  return currentUser.isAdmin || role === Role.OWNER || role === Role.CONTRIBUTOR;
}

export async function isUpdateAllowed(layer: CrgLayer): Promise<boolean> {
  if (layer.type === CrgLayerType.VECTOR) {
    const schema = await getLayerSchema(layer);
    if (!schema) {
      return false;
    }

    if (schema.readOnly || !layer.dataset || !layer.tableName) {
      return false;
    }

    return await isFeaturesUpdateAllowed(layer.dataset, layer.tableName, await getLayerSchema(layer));
  } else if (layer.type === CrgLayerType.RASTER) {
    return await isLayerFromFileReadAllowed(layer);
  } else if (layer.type && isVectorFromFile(layer.type)) {
    const schema = await getLayerSchema(layer);
    if (!schema) {
      return false;
    }

    if (schema.readOnly) {
      return false;
    }

    return await isLayerFromFileReadAllowed(layer);
  }

  return false;
}

export async function isShapeImportAllowed(datasetIdentifier: string, tableIdentifier: string): Promise<boolean> {
  try {
    const table: VectorTable = await getVectorTable(datasetIdentifier, tableIdentifier);
    const role = table?.role;

    return currentUser.isAdmin || role === Role.OWNER || role === Role.CONTRIBUTOR;
  } catch (error) {
    const err = error as AxiosError;

    if (err.response?.status !== 403) {
      throw err;
    }

    return false;
  }
}

export async function isLayerFromFileReadAllowed(layer: CrgLayer): Promise<boolean> {
  try {
    if (!layer.libraryId || !layer.recordId || !layer.tableName) {
      return false;
    }

    const record = await getLibraryRecord(layer.libraryId, layer.recordId);
    if (record.is_deleted) {
      return false;
    }

    // проверка наличия файла в документе (пока только растры и dxf, shape)
    if (layer.type === CrgLayerType.RASTER || layer.type === CrgLayerType.DXF || layer.type === CrgLayerType.SHP) {
      const files = getLibraryRecordFiles(record);
      const datasource = files?.find(file => layer.tableName?.includes(file.id));

      if (!datasource) {
        return false;
      }
    }

    return Boolean(record.role);
  } catch {
    return false;
  }
}

export function isLayersManagementAllowed(project: CrgProject = currentProject): boolean {
  return isAllowedWithProject(project, ProjectPermissionPoint.MANAGE_LAYERS);
}

export function isTableExportAllowed(datasetIdentifier: string, tableIdentifier: string): Promise<boolean> {
  return isAllowedWithTable(datasetIdentifier, tableIdentifier, TablePermissionPoint.EXPORT);
}

async function isFeaturesReadAllowed(datasetIdentifier: string, tableIdentifier: string): Promise<boolean> {
  return isAllowedWithTable(datasetIdentifier, tableIdentifier, TablePermissionPoint.READ_FEATURES);
}

export function isFeaturesUpdateAllowed(
  datasetIdentifier: string,
  tableIdentifier: string,
  schemaForReadonlyCheck?: Schema
): Promise<boolean> {
  return isAllowedWithTable(
    datasetIdentifier,
    tableIdentifier,
    TablePermissionPoint.UPDATE_FEATURES,
    schemaForReadonlyCheck
  );
}

function isAllowedWithProject(project: CrgProject, targetPoint: ProjectPermissionPoint): boolean {
  const role = currentUser.isAdmin ? Role.OWNER : project.role;

  return Boolean(role) && !!projectRolesPermissionPoints.get(role)?.includes(targetPoint);
}

async function isAllowedWithTable(
  datasetIdentifier: string,
  tableIdentifier: string,
  targetPoint: TablePermissionPoint,
  schemaForReadonlyCheck?: Schema
): Promise<boolean> {
  const readOnly = schemaForReadonlyCheck?.readOnly;
  try {
    const table = await getVectorTable(datasetIdentifier, tableIdentifier);
    let role = table?.role;

    if (currentUser.isAdmin) {
      role = Role.OWNER;
    }

    const roles = getRoles(PermissionType.DATA);
    if (roles.indexOf(role) > roles.indexOf(Role.VIEWER) && readOnly) {
      role = Role.VIEWER;
    }

    return Boolean(role) && !!tableRolesPermissionPoints.get(role)?.includes(targetPoint);
  } catch (error) {
    const err = error as AxiosError;

    if (err.response?.status !== 403) {
      throw err;
    }

    return false;
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
