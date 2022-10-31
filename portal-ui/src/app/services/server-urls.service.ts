import { getEnvironment } from './environment';

async function getHost(): Promise<string> {
  const env = await getEnvironment();

  return env.server.host || location.hostname;
}

async function getPort(): Promise<string> {
  const env = await getEnvironment();

  return env.server.port || location.port;
}

export async function getPath(): Promise<string> {
  const env = await getEnvironment();

  return env.server.path || '';
}

async function getWsPort(): Promise<string> {
  const env = await getEnvironment();

  return env.server.wsPort || location.port;
}

async function getWsPath(): Promise<string> {
  const env = await getEnvironment();

  return env.server.wsPath || '';
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

export async function getGeoserverFileUrl(workspace: string, coverages: string): Promise<string> {
  return `${await getGeoServerUrl()}/rest/workspaces/${workspace}/coveragestores/store_${coverages}/coverages/${coverages}.json`;
}

export async function getGeoserverFeatureTypesUrl(workspace: string, datastore: string): Promise<string> {
  return `${await getGeoServerUrl()}/rest/workspaces/${workspace}/datastores/${datastore}/featuretypes.json`;
}

export async function getGeoserverFeatureTypeUrl(
  workspace: string,
  datastore: string,
  feature: string
): Promise<string> {
  return `${await getGeoServerUrl()}/rest/workspaces/${workspace}/datastores/${datastore}/featuretypes/${feature}`;
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

export async function getEsiaUrl(): Promise<string> {
  const url = await getBaseUrl();
  const redirect = window.location.protocol + '//' + window.location.host + '/projects';
  const redirectFromEsia = `${url}/esia/ok?redirect=${redirect}`;

  return `${url}/esia?redirect=${redirectFromEsia}`;
}

export async function getValidationUrl(): Promise<string> {
  return (await getDataUrl()) + '/validation';
}

export async function getOrganizationsUrl(): Promise<string> {
  return (await getBaseUrl()) + '/organizations';
}

export async function getOrganizationSettingsUrl(): Promise<string> {
  return `${await getOrganizationsUrl()}/settings`;
}

export async function getOrganizationKnownSettingsUrl(): Promise<string> {
  return `${await getOrganizationsUrl()}/known-settings`;
}

export async function getSchemaUrl(): Promise<string> {
  return (await getDataUrl()) + '/schemas';
}

export async function getExportUrl(): Promise<string> {
  return (await getDataUrl()) + '/export';
}

export async function getEpsgUrl(): Promise<string> {
  return (await getDataUrl()) + '/epsg';
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

export async function getFiasAddresses(): Promise<string> {
  return (await getDataUrl()) + '/integration/fias/fulladdress';
}

export async function getFiasOktmo(): Promise<string> {
  return (await getDataUrl()) + '/integration/fias/oktmo';
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

export async function getRecordsCopyUrl(): Promise<string> {
  return `${await getDataUrl()}/records/copy`;
}

export async function getDocLibraryUrl(id: string): Promise<string> {
  return `${await getDocLibrariesUrl()}/${id}`;
}

export async function getDocLibrariesRecordsUrl(libraryIdentifier: string): Promise<string> {
  return `${await getDataUrl()}/document-libraries/${libraryIdentifier}/records`;
}

export async function getDocLibrariesRecords2Url(libraryIdentifier: string): Promise<string> {
  return `${await getDataUrl()}/document-libraries/${libraryIdentifier}/records/as_registry`;
}

export async function getDocLibrariesRecordUrl(libraryIdentifier: string, recordId: number): Promise<string> {
  return `${await getDataUrl()}/document-libraries/${libraryIdentifier}/records/${recordId}`;
}

export async function getDocRegisterUrl(libraryIdentifier: string, recordId: number): Promise<string> {
  return `${await getDataUrl()}/document-libraries/${libraryIdentifier}/records/${recordId}/register`;
}

export async function getDocumentLibraryRoleAssignmentUrl(id: string): Promise<string> {
  return `${await getDocLibrariesUrl()}/${id}/roleAssignment`;
}

export async function getDocumentLibraryRecordRoleAssignmentUrl(libraryId: string, recordId: number): Promise<string> {
  return `${await getDocLibrariesUrl()}/${libraryId}/records/${recordId}/roleAssignment`;
}

export async function getDocumentLibraryIntegrationUrl(libraryId: string, recordId: number): Promise<string> {
  return `${await getDocLibrariesUrl()}/${libraryId}/records/${recordId}/integration`;
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

export async function getDatasetTableRecordsUrl(datasetId: string, tableId: string): Promise<string> {
  return `${await getDatasetUrl(datasetId)}/tables/${tableId}/records`;
}

export async function getDatasetTableRecordUrl(datasetId: string, tableId: string, recordId: string): Promise<string> {
  return `${await getDatasetUrl(datasetId)}/tables/${tableId}/records/${recordId}`;
}

export async function getDatasetTableMultipleRecordsUrl(
  datasetId: string,
  tableId: string,
  recordsId: string
): Promise<string> {
  return `${await getDatasetUrl(datasetId)}/tables/${tableId}/records-multiple/${recordsId}`;
}

export async function getTableRoleAssignmentUrl(datasetId: string, tableId: string): Promise<string> {
  return `${await getDatasetTableUrl(datasetId, tableId)}/roleAssignment`;
}

export async function getTableConnectionsUrl(): Promise<string> {
  return `${await getProjectsUrl()}/find-related-layers`;
}

export async function getFileConnectionsUrl(): Promise<string> {
  return `${await getProjectsUrl()}/find-related-to-file-layers`;
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

export async function getFilesUrl(): Promise<string> {
  return (await getDataUrl()) + '/files';
}

export async function getFileUrl(id: string): Promise<string> {
  return (await getFilesUrl()) + `/${id}`;
}

export async function getFileDownloadUrl(id: string): Promise<string> {
  return (await getFilesUrl()) + `/${id}/download`;
}

export async function getRestorePasswordUrl(): Promise<string> {
  return (await getBaseUrl()) + '/request-password-reset';
}

export async function getChangePasswordUrl(): Promise<string> {
  return (await getBaseUrl()) + '/password-reset';
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
