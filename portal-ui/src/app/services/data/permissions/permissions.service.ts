import { AxiosError } from 'axios';

import { currentUser } from '../../../stores/CurrentUser.store';
import { currentProject } from '../../../stores/CurrentProject.store';
import { CrgLayer, CrgLayerType } from '../../gis/layers/layers.models';
import { CrgProject } from '../../gis/projects/projects.models';
import { getLibrary, getLibraryRecord } from '../docLibrary/docLibrary.service';
import { DocumentLibrary, LibraryRecord } from '../docLibrary/docLibrary.models';
import { getVectorTable } from '../vectorData/vectorData.service';
import { VectorTable } from '../vectorData/vectorData.models';
import { schemaService } from '../schema/schema.service';
import { Schema } from '../schema/schema.models';
import { services } from '../../services';
import { Toast } from '../../../components/Toast/Toast';
import { ExplorerItemEntityTypeTitle } from '../../../components/Explorer/Explorer.models';

import {
  ProjectPermissionPoint,
  projectRolesPermissionPoints,
  Role,
  RoleAssignmentBody,
  roles,
  TablePermissionPoint,
  tableRolesPermissionPoints
} from './permissions.models';
import { permissionsClient } from './permissions.client';
import { getLibraryRecordFiles } from '../files/files.util';

export async function getProjectPermissions(url: string): Promise<RoleAssignmentBody[]> {
  return await permissionsClient.getProjectPermissions(url);
}

export async function getTablePermissions(url: string): Promise<RoleAssignmentBody[]> {
  return await permissionsClient.getTablePermissions(url);
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
    await permissionsClient.removeEntityPermission(payload.id, url);
  } catch (error) {
    handleSavingError(error, payload, 'удалить', `${itemEntityType}`, `${title}`);
  }
}

export async function addTablePermission(
  payload: RoleAssignmentBody,
  datasetId: string,
  tableIdentifier: string
): Promise<void> {
  try {
    await permissionsClient.addTablePermission(payload, datasetId, tableIdentifier);
  } catch (error) {
    handleSavingError(error, payload, 'добавить', 'таблицы', `${datasetId}:${tableIdentifier}`);
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
    await permissionsClient.removeProjectPermission(payload.id, project.id);
  } catch (error) {
    handleSavingError(error, payload, 'удалить', 'проекта', project.name);
  }
}

export async function isReadAllowed(layer: CrgLayer): Promise<boolean> {
  if (currentUser.isAdmin || layer.type === CrgLayerType.EXTERNAL || layer.type === CrgLayerType.EXTERNAL_GEOSERVER) {
    return true;
  }

  if (layer.type === CrgLayerType.VECTOR) {
    return await isFeaturesReadAllowed(layer.dataset, layer.tableName);
  } else if (layer.type === CrgLayerType.RASTER || layer.type === CrgLayerType.VECTOR_FROM_FILE) {
    return await isRasterReadAllowed(layer);
  }

  return false;
}

export async function isRecordUpdateAllowed(record: LibraryRecord): Promise<boolean> {
  const libraryRecord = record.role ? record : await getLibraryRecord(record.libraryTableName, record.id);

  return checkIsUpdateAllowed(libraryRecord.role);
}

export async function isLibraryUpdateAllowed(library: DocumentLibrary): Promise<boolean> {
  const documentLibrary = library.role ? library : await getLibrary(library.table_name);

  return checkIsUpdateAllowed(documentLibrary.role);
}

function checkIsUpdateAllowed(role: Role) {
  return currentUser.isAdmin || role === Role.OWNER || role === Role.CONTRIBUTOR;
}

export async function isUpdateAllowed(layer: CrgLayer): Promise<boolean> {
  const schema: Schema = await schemaService.getSchema(layer.schemaId);
  if (!schema) {
    return false;
  }

  if (schema.readOnly) {
    return false;
  }

  if (layer.type === CrgLayerType.VECTOR) {
    return await isFeaturesUpdateAllowed(layer.dataset, layer.tableName, layer.schemaId);
  } else if (layer.type === CrgLayerType.RASTER || layer.type === CrgLayerType.VECTOR_FROM_FILE) {
    return await isRasterReadAllowed(layer);
  }

  return false;
}

export async function isShapeImportAllowed(datasetIdentifier: string, tableIdentifier: string): Promise<boolean> {
  let table: VectorTable;
  try {
    table = await getVectorTable(datasetIdentifier, tableIdentifier);
  } catch (error) {
    const err = error as AxiosError;

    if (err.response.status !== 403) {
      throw err;
    }
  }

  const role = table?.role;

  return !!(currentUser.isAdmin || role === Role.OWNER || role === Role.CONTRIBUTOR);
}

export async function isRasterReadAllowed(layer: CrgLayer): Promise<boolean> {
  try {
    const raster = await getLibraryRecord(layer.libraryId, layer.recordId);
    const files = getLibraryRecordFiles(raster);
    const datasource = files?.filter(file => layer.tableName.includes(file.id));

    if (layer.tableName.slice(0, 7) === 'dl_data' && !datasource?.length) {
      return false;
    }

    return Boolean(raster.role);
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

export function isTableDeletionAllowed(datasetIdentifier: string, tableIdentifier: string): Promise<boolean> {
  return isAllowedWithTable(datasetIdentifier, tableIdentifier, TablePermissionPoint.DELETE);
}

async function isFeaturesReadAllowed(datasetIdentifier: string, tableIdentifier: string): Promise<boolean> {
  return isAllowedWithTable(datasetIdentifier, tableIdentifier, TablePermissionPoint.READ_FEATURES);
}

function isFeaturesUpdateAllowed(dataset: string, table: string, schemaId: string): Promise<boolean> {
  return isAllowedWithTable(dataset, table, TablePermissionPoint.UPDATE_FEATURES, schemaId);
}

function isAllowedWithProject(project: CrgProject, targetPoint: ProjectPermissionPoint): boolean {
  const role = currentUser.isAdmin ? Role.OWNER : project.role;

  return Boolean(role) && projectRolesPermissionPoints.get(role).includes(targetPoint);
}

async function isAllowedWithTable(
  datasetIdentifier: string,
  tableIdentifier: string,
  targetPoint: TablePermissionPoint,
  schemaIdForReadonlyCheck?: string
): Promise<boolean> {
  const schema = schemaIdForReadonlyCheck && (await schemaService.getSchema(schemaIdForReadonlyCheck));
  const readOnly = schema?.readOnly;
  let table: VectorTable;
  try {
    table = await getVectorTable(datasetIdentifier, tableIdentifier);
  } catch (error) {
    const err = error as AxiosError;

    if (err.response.status !== 403) {
      throw err;
    }
  }

  let role = table?.role;

  if (currentUser.isAdmin) {
    role = Role.OWNER;
  }
  if (roles.indexOf(role) > roles.indexOf(Role.VIEWER) && readOnly) {
    role = Role.VIEWER;
  }

  return Boolean(role) && tableRolesPermissionPoints.get(role).includes(targetPoint);
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
