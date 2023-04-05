import { getEnvironment } from '../environment';

async function getHost(): Promise<string> {
  const env = await getEnvironment();

  return env.server.host;
}

async function getProtocol(): Promise<string> {
  const env = await getEnvironment();

  return env.server.protocol;
}

async function getPort(): Promise<string> {
  const env = await getEnvironment();

  return env.server.port;
}

export async function getPath(): Promise<string> {
  const env = await getEnvironment();

  return env.server.path || '';
}

async function getWsPort(): Promise<string> {
  const env = await getEnvironment();

  return env.server.wsPort;
}

async function getWsPath(): Promise<string> {
  const env = await getEnvironment();

  return env.server.wsPath || '';
}

export async function getWsEndpointUrl(): Promise<string> {
  const protocol = await getProtocol();
  const host = await getHost();
  const port = await getWsPort();
  const path = await getWsPath();

  return `${protocol}//${host}:${port}${path}/crg-ws-endpoint`;
}

export async function getBaseUrl(): Promise<string> {
  const protocol = await getProtocol();
  const host = await getHost();
  const port = await getPort();
  const path = await getPath();

  return `${protocol}//${host}${port && ':'}${port}${path}`;
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
  const host = await getHost();
  const protocol = await getProtocol();
  const redirect = protocol + '//' + host + '/projects';
  const redirectFromEsia = `${url}/esia/ok?redirect=${redirect}`;

  return `${url}/esia?redirect=${redirectFromEsia}`;
}

export async function getValidationUrl(): Promise<string> {
  return (await getDataUrl()) + '/validation';
}

export async function getValidationResultsUrl(): Promise<string> {
  return (await getValidationUrl()) + '/results';
}

export async function getValidationShortInfoUrl(): Promise<string> {
  return (await getValidationUrl()) + '/short';
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

export async function getMessagesRegistriesUrl(): Promise<string> {
  return (await getDataUrl()) + '/reestrs';
}

export async function getMessagesRegistryUrl(tableName: string): Promise<string> {
  return (await getDataUrl()) + `/reestrs/${tableName}`;
}

export async function getMessagesRegistriesDataUrl(tableName: string): Promise<string> {
  return (await getMessagesRegistryUrl(tableName)) + '/records';
}

export async function getMessagesRegistriesSchemaUrl(tableName: string): Promise<string> {
  return (await getMessagesRegistryUrl(tableName)) + '/schemas';
}

export async function getUsersInviteUrl(): Promise<string> {
  return (await getUsersUrl()) + '/invite';
}

export async function getUserUrl(userId: number | string): Promise<string> {
  return `${await getUsersUrl()}/${userId}`;
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

export async function getFileProcessesUrl(): Promise<string> {
  return `${await getDataUrl()}/processes/file`;
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

export async function getDocLibraryUrl(tableName: string): Promise<string> {
  return `${await getDocLibrariesUrl()}/${tableName}`;
}

export async function getDocLibraryRecordsUrl(tableName: string): Promise<string> {
  return `${await getDataUrl()}/document-libraries/${tableName}/records`;
}

export async function getDocLibraryRecordsAsRegistryUrl(tableName: string): Promise<string> {
  return `${await getDataUrl()}/document-libraries/${tableName}/records/as_registry`;
}

export async function getDocLibraryRecordUrl(libraryTableName: string, recordId: number): Promise<string> {
  return `${await getDataUrl()}/document-libraries/${libraryTableName}/records/${recordId}`;
}

export async function getDocLibraryRecordMoveUrl(libraryTableName: string, recordId: number): Promise<string> {
  return `${await getDataUrl()}/document-libraries/${libraryTableName}/records/${recordId}/move`;
}

export async function getDocLibraryRecordMoveToFolderUrl(
  libraryTableName: string,
  recordId: number,
  newParentId?: number
): Promise<string> {
  return `${await getDocLibraryRecordMoveUrl(libraryTableName, recordId)}/${newParentId}`;
}

export async function getDocRegisterUrl(libraryTableName: string, recordId: number): Promise<string> {
  return `${await getDataUrl()}/document-libraries/${libraryTableName}/records/${recordId}/register`;
}

export async function getDocumentLibraryRoleAssignmentUrl(tableName: string): Promise<string> {
  return `${await getDocLibrariesUrl()}/${tableName}/roleAssignment`;
}

export async function getDocumentLibraryRecordRoleAssignmentUrl(
  libraryTableName: string,
  recordId: number
): Promise<string> {
  return `${await getDocLibrariesUrl()}/${libraryTableName}/records/${recordId}/roleAssignment`;
}

export async function getDocumentLibraryIntegrationUrl(libraryTableName: string, recordId: number): Promise<string> {
  return `${await getDocLibrariesUrl()}/${libraryTableName}/records/${recordId}/integration`;
}

export async function getDatasetUrl(datasetIdentifier: string): Promise<string> {
  return `${await getDatasetsUrl()}/${datasetIdentifier}`;
}

export async function getDatasetRoleAssignmentsUrl(datasetIdentifier: string): Promise<string> {
  return `${await getDatasetUrl(datasetIdentifier)}/roleAssignment`;
}

export async function getDatasetRoleAssignmentUrl(id: number, datasetIdentifier: string): Promise<string> {
  return `${await getDatasetRoleAssignmentsUrl(datasetIdentifier)}/${id}`;
}

export async function getVectorTablesUrl(datasetIdentifier: string): Promise<string> {
  return `${await getDatasetUrl(datasetIdentifier)}/tables`;
}

export async function getVectorTableUrl(datasetIdentifier: string, tableIdentifier: string): Promise<string> {
  return `${await getDatasetUrl(datasetIdentifier)}/tables/${tableIdentifier}`;
}

export async function getVectorTableRecordsUrl(datasetIdentifier: string, tableIdentifier: string): Promise<string> {
  return `${await getDatasetUrl(datasetIdentifier)}/tables/${tableIdentifier}/records`;
}

export async function getFeatureUrl(
  datasetIdentifier: string,
  tableIdentifier: string,
  recordId: string
): Promise<string> {
  return `${await getDatasetUrl(datasetIdentifier)}/tables/${tableIdentifier}/records/${recordId}`;
}

export async function getVectorTableMultipleRecordsUrl(
  datasetIdentifier: string,
  tableIdentifier: string,
  recordsId: string
): Promise<string> {
  return `${await getDatasetUrl(datasetIdentifier)}/tables/${tableIdentifier}/records-multiple/${recordsId}`;
}

export async function getTableRoleAssignmentsUrl(datasetIdentifier: string, tableIdentifier: string): Promise<string> {
  return `${await getVectorTableUrl(datasetIdentifier, tableIdentifier)}/roleAssignment`;
}

export async function getTableRoleAssignmentUrl(
  id: number,
  datasetIdentifier: string,
  tableIdentifier: string
): Promise<string> {
  return `${await getTableRoleAssignmentsUrl(datasetIdentifier, tableIdentifier)}/${id}`;
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
  newUrl.protocol = await getProtocol();

  if (addPath) {
    newUrl.pathname = (await getPath()) + newUrl.pathname;
  }

  return newUrl.href;
}
