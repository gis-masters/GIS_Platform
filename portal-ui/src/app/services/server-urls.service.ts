import { getEnvironment } from './environment';

async function getHost(): Promise<string> {
  return (await getEnvironment()).server.host || location.hostname;
}

async function getPort(): Promise<string> {
  return (await getEnvironment()).server.port || location.port;
}

export async function getPath(): Promise<string> {
  return (await getEnvironment()).server.path || '';
}

async function getWsPort(): Promise<string> {
  return (await getEnvironment()).server.wsPort || location.port;
}

async function getWsPath(): Promise<string> {
  return (await getEnvironment()).server.wsPath || '';
}

export async function getWsEndpointUrl(): Promise<string> {
  const host = await getHost();
  const port = await getWsPort();
  const path = await getWsPath();

  return `${location.protocol}//${host}:${port}${path}/crg-ws-endpoint`;
}

export async function getBaseUrl(): Promise<string> {
  const host = await getHost();
  const port = await getPort();
  const path = await getPath();

  return `${location.protocol}//${host}${port && ':'}${port}${path}`;
}

export async function getGeoServerUrl(): Promise<string> {
  return (await getBaseUrl()) + '/geoserver';
}

export async function getWmsUrl(): Promise<string> {
  return (await getGeoServerUrl()) + '/wms';
}

export async function getWfsUrl(): Promise<string> {
  return (await getGeoServerUrl()) + '/wfs';
}

export async function getWmtsUrl(): Promise<string> {
  return (await getGeoServerUrl()) + '/gwc/service/wmts';
}

export async function getGeoserverImportsUrl(): Promise<string> {
  return (await getGeoServerUrl()) + '/rest/imports';
}

export async function getGeoserverFeatureTypeInfoUrl(
  workspace: string,
  dataset: string,
  tableName: string
): Promise<string> {
  return `${await getGeoServerUrl()}/rest/workspaces/${workspace}/datastores/${dataset}/featuretypes/${tableName}.json`;
}

export async function getGeoserverImportUrl(importId: number | string): Promise<string> {
  return `${await getGeoserverImportsUrl()}/${importId}`;
}

export async function getGeoserverImportTasksUrl(importId: number | string): Promise<string> {
  return `${await getGeoserverImportUrl(importId)}/tasks`;
}

export async function getGeoserverImportTaskUrl(importId: number | string, taskId: number): Promise<string> {
  return `${await getGeoserverImportTasksUrl(importId)}/${taskId}`;
}

export async function getGeoserverImportTaskProgressUrl(importId: number | string, taskId: number): Promise<string> {
  return `${await getGeoserverImportTasksUrl(importId)}/${taskId}/progress`;
}

export async function getGeoserverImportTaskLayerUrl(importId: number | string, taskId: number): Promise<string> {
  return `${await getGeoserverImportTaskUrl(importId, taskId)}/layer`;
}

export async function getAuthUrl(): Promise<string> {
  return (await getBaseUrl()) + '/oauth/token';
}

export async function getLogoutUrl(): Promise<string> {
  return (await getBaseUrl()) + '/perform_logout';
}

export async function getValidationUrl(): Promise<string> {
  return (await getDataUrl()) + '/validation';
}

export async function getOrganizationsUrl(): Promise<string> {
  return (await getBaseUrl()) + '/organizations';
}

export async function getSchemaUrl(): Promise<string> {
  return (await getDataUrl()) + '/schemas';
}

export async function getExportUrl(): Promise<string> {
  return (await getDataUrl()) + '/export';
}

export async function getExportValidationResultUrl(): Promise<string> {
  return (await getDataUrl()) + '/export/validation_results';
}

export async function getUsersUrl(): Promise<string> {
  return (await getBaseUrl()) + '/users';
}

export async function getUserUrl(userId: number | string): Promise<string> {
  return `${await getBaseUrl()}/users/${userId}`;
}

export async function getGroupsUrl(): Promise<string> {
  return (await getBaseUrl()) + '/groups';
}

export async function getGroupUrl(groupId: number): Promise<string> {
  return `${await getGroupsUrl()}/${groupId}`;
}

export async function getGroupUserUrl(groupId: number, userId: number): Promise<string> {
  return `${await getGroupsUrl()}/${groupId}/users/${userId}`;
}

export async function getProjectsUrl(): Promise<string> {
  return (await getBaseUrl()) + '/projects';
}

export async function getProjectUrl(projectId: number): Promise<string> {
  return `${await getProjectsUrl()}/${projectId}`;
}

export async function getProjectBasemapsUrl(projectId: number): Promise<string> {
  return `${await getProjectUrl(projectId)}/basemaps`;
}

export async function getAllProjectsPermissionsUrl(): Promise<string> {
  return `${await getProjectsUrl()}/all-permissions`;
}

export async function getProjectLayersUrl(projectId: number): Promise<string> {
  return (await getProjectUrl(projectId)) + '/layers';
}

export async function getProjectLayerUrl(projectId: number, layerId: number): Promise<string> {
  return `${await getProjectUrl(projectId)}/layers/${layerId}`;
}

export async function getProjectGroupsUrl(projectId: number): Promise<string> {
  return (await getProjectUrl(projectId)) + '/groups';
}

export async function getProjectGroupUrl(projectId: number, groupId: number): Promise<string> {
  return `${await getProjectGroupsUrl(projectId)}/${groupId}`;
}

export async function getProjectPermissionsUrl(projectId: number): Promise<string> {
  return (await getProjectUrl(projectId)) + '/permissions';
}

export async function getProjectPermissionUrl(projectId: number, permissionId: number): Promise<string> {
  return `${await getProjectPermissionsUrl(projectId)}/${permissionId}`;
}

async function getDataUrl(): Promise<string> {
  return (await getBaseUrl()) + '/api/data';
}

export async function getProcessUrl(processId: number): Promise<string> {
  return `${await getDataUrl()}/processes/${processId}`;
}

export async function getProcessesUrl(): Promise<string> {
  return `${await getDataUrl()}/processes`;
}

export async function getApiImportUrl(projectId: number): Promise<string> {
  return `${await getDataUrl()}/import/${projectId}`;
}

export async function getApiImportXmlUrl(): Promise<string> {
  return `${await getDataUrl()}/import/file`;
}
export async function getApiImportGmlUrl(): Promise<string> {
  return `${await getDataUrl()}/import/file/gml`;
}

export async function getActualLegendUrl(): Promise<string> {
  return `${await getDataUrl()}/styles/actual`;
}

export async function getDatasetsUrl(): Promise<string> {
  return `${await getDataUrl()}/datasets`;
}

export async function getDocLibrariesUrl(): Promise<string> {
  return `${await getDataUrl()}/document-libraries`;
}

export async function getDocLibrariesRecordsUrl(libraryName: string): Promise<string> {
  return `${await getDataUrl()}/document-libraries/${libraryName}/records`;
}

export async function getDocLibrariesRecordUrl(libraryName: string, id: string): Promise<string> {
  return `${await getDataUrl()}/document-libraries/${libraryName}/records/${id}`;
}

export async function getDocumentLibraryRoleAssignmentUrl(id: string): Promise<string> {
  return `${await getDocLibrariesUrl()}/${id}/roleAssignment`;
}

export async function getDocumentLibraryRecordRoleAssignmentUrl(lidraryid: string, id: string): Promise<string> {
  return `${await getDocLibrariesUrl()}/${lidraryid}/records/${id}/roleAssignment`;
}

export async function getDatasetUrl(datasetId: string): Promise<string> {
  return `${await getDatasetsUrl()}/${datasetId}`;
}

export async function getDatasetRoleAssignmentUrl(datasetId: string): Promise<string> {
  return `${await getDatasetUrl(datasetId)}/roleAssignment`;
}

export async function getDatasetTablesUrl(datasetId: string): Promise<string> {
  return `${await getDatasetUrl(datasetId)}/tables`;
}

export async function getDatasetTableUrl(datasetId: string, tableId: string): Promise<string> {
  return `${await getDatasetUrl(datasetId)}/tables/${tableId}`;
}

export async function getTableRoleAssignmentUrl(datasetId: string, tableId: string): Promise<string> {
  return `${await getDatasetTableUrl(datasetId, tableId)}/roleAssignment`;
}

export async function getTableConnectionsUrl(): Promise<string> {
  return `${await getProjectsUrl()}/find-related-layers`;
}

export async function getBasemapConnectionsUrl(sourceBasemapId: number): Promise<string> {
  return `${await getProjectsUrl()}/find-related-by-basemap/${sourceBasemapId}`;
}

export async function getBasemapsUrl(): Promise<string> {
  return (await getDataUrl()) + '/basemaps';
}

export async function getBasemapUrl(basemapId: number): Promise<string> {
  return `${await getBasemapsUrl()}/${basemapId}`;
}

export async function getBasemapsByIdsUrl(): Promise<string> {
  return (await getBasemapsUrl()) + '/search/findByIdIn';
}

export async function getAllPermissionsUrl(): Promise<string> {
  return (await getDataUrl()) + '/all-permissions';
}

export async function replaceUrl(url: string, addPath?: boolean): Promise<string> {
  if (!url) {
    return '';
  }
  const newUrl = new URL(url);
  newUrl.hostname = await getHost();
  newUrl.port = await getPort();
  newUrl.protocol = location.protocol;

  if (addPath) {
    newUrl.pathname = (await getPath()) + newUrl.pathname;
  }

  return newUrl.href;
}
