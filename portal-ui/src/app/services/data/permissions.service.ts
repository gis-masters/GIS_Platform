import { AxiosError } from 'axios';

import { currentUser } from '../../stores/CurrentUser.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { CrgLayer, CrgLayerType, CrgProject } from '../gis/projects.models';
import {
  ProjectPermissionPoint,
  projectRolesPermissionPoints,
  Role,
  roles,
  TablePermissionPoint,
  tableRolesPermissionPoints
} from './permissions.models';

import { schemaService } from './schema.service';
import { getLibraryRecord } from './doc-library.service';
import { VectorTable, getVectorTable } from './data.service';
import { Schema } from './schema.models';

export async function isReadAllowed(layer: CrgLayer): Promise<boolean> {
  if (currentUser.isAdmin || layer.type === CrgLayerType.EXTERNAL || layer.type === CrgLayerType.EXTERNAL_GEOSERVER) {
    return true;
  }

  if (layer.type === CrgLayerType.VECTOR) {
    return await isFeaturesReadAllowed(layer.dataset, layer.tableName);
  } else if (layer.type === CrgLayerType.RASTER) {
    return await isRasterReadAllowed(layer.libraryId, layer.recordId);
  }

  return false;
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
    return await isRasterReadAllowed(layer.libraryId, layer.recordId);
  }

  return false;
}

export async function isRasterReadAllowed(libraryId: string, recordId: number): Promise<boolean> {
  try {
    const raster = await getLibraryRecord(libraryId, recordId);

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
