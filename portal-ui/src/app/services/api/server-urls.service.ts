import { environment } from '../environment';

function getHost(): string {
  return environment.server.host;
}

function getProtocol(): string {
  return environment.server.protocol;
}

function getPort(): string {
  return environment.server.port;
}

function getPath(): string {
  return environment.server.path || '';
}

function getWsPort(): string {
  return environment.server.wsPort;
}

function getWsPath(): string {
  return environment.server.wsPath || '';
}

export function getWsEndpointUrl(): string {
  const protocol = getProtocol();
  const host = getHost();
  const port = getWsPort();
  const path = getWsPath();

  return `${protocol}//${host}:${port}${path}/crg-ws-endpoint`;
}

function getBaseUrl(): string {
  const protocol = getProtocol();
  const host = getHost();
  const port = getPort();
  const path = getPath();

  return `${protocol}//${host}${port && ':'}${port}${path}`;
}

function getGeoServerUrl(): string {
  return getBaseUrl() + '/geoserver';
}

export function getWfsUrl(): string {
  return getGeoServerUrl() + '/wfs';
}

export function getWmtsUrl(): string {
  return getGeoServerUrl() + '/gwc/service/wmts';
}

export function getGeoserverImportsUrl(): string {
  return getGeoServerUrl() + '/rest/imports';
}

export function getGeoserverFeatureTypeInfoUrl(workspace: string, dataset: string, tableName: string): string {
  return `${getGeoServerUrl()}/rest/workspaces/${workspace}/datastores/${dataset}/featuretypes/${tableName}.json`;
}

export function getGeoserverFileUrl(workspace: string, coverages: string): string {
  return `${getGeoServerUrl()}/rest/workspaces/${workspace}/coveragestores/store_${coverages}/coverages/${coverages}.json`;
}

export function getGeoserverFeatureTypesUrl(workspace: string, datastore: string): string {
  return `${getGeoServerUrl()}/rest/workspaces/${workspace}/datastores/${datastore}/featuretypes.json`;
}

export function getGeoserverFeatureTypeUrl(workspace: string, datastore: string, feature: string): string {
  return `${getGeoServerUrl()}/rest/workspaces/${workspace}/datastores/${datastore}/featuretypes/${feature}`;
}

export function getGeoserverImportUrl(importId: number | string): string {
  return `${getGeoserverImportsUrl()}/${importId}`;
}

export function getGeoserverImportTasksUrl(importId: number | string): string {
  return `${getGeoserverImportUrl(importId)}/tasks`;
}

export function getGeoserverImportTaskUrl(importId: number | string, taskId: number): string {
  return `${getGeoserverImportTasksUrl(importId)}/${taskId}`;
}

export function getGeoserverImportTaskProgressUrl(importId: number | string, taskId: number): string {
  return `${getGeoserverImportTasksUrl(importId)}/${taskId}/progress`;
}

export function getGeoserverImportTaskLayerUrl(importId: number | string, taskId: number): string {
  return `${getGeoserverImportTaskUrl(importId, taskId)}/layer`;
}

export function getEsiaUrl(): string {
  const url = getBaseUrl();
  const host = getHost();
  const protocol = getProtocol();
  const redirect = protocol + '//' + host + '/projects';
  const redirectFromEsia = `${url}/esia/ok?redirect=${redirect}`;

  return `${url}/esia?redirect=${redirectFromEsia}`;
}

function getDataUrl(): string {
  return getBaseUrl() + '/api/data';
}

export function getApiImportUrl(projectId: number): string {
  return `${getDataUrl()}/import/${projectId}`;
}

export function getApiImportGmlUrl(): string {
  return `${getDataUrl()}/import/file/gml`;
}

function getDatasetsUrl(): string {
  return `${getDataUrl()}/datasets`;
}
function getDatasetUrl(datasetIdentifier: string): string {
  return `${getDatasetsUrl()}/${datasetIdentifier}`;
}

export function getVectorTableMultipleRecordsUrl(
  datasetIdentifier: string,
  tableIdentifier: string,
  recordsId: string
): string {
  return `${getDatasetUrl(datasetIdentifier)}/tables/${tableIdentifier}/records-multiple/${recordsId}`;
}

export function replaceUrl(url: string, addPath?: boolean): string {
  if (!url) {
    return '';
  }
  const newUrl = new URL(url);
  newUrl.hostname = getHost();
  newUrl.port = getPort();
  newUrl.protocol = getProtocol();

  if (addPath) {
    newUrl.pathname = getPath() + newUrl.pathname;
  }

  return newUrl.href;
}
