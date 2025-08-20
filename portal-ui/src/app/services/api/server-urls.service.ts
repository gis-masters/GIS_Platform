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

function getDataUrl(): string {
  return getBaseUrl() + '/api/data';
}

function getDatasetsUrl(): string {
  return `${getDataUrl()}/datasets`;
}

function getDatasetUrl(datasetIdentifier: string): string {
  return `${getDatasetsUrl()}/${datasetIdentifier}`;
}

function getBaseUrl(): string {
  const protocol = getProtocol();
  const host = getHost();
  const port = getPort();
  const path = getPath();

  return `${protocol}//${host}${port && ':'}${port}${path}`;
}

export function getWsEndpointUrl(): string {
  const protocol = getProtocol();
  const host = getHost();
  const port = getWsPort();
  const path = getWsPath();

  return `${protocol}//${host}:${port}${path}/crg-ws-endpoint`;
}

export function getEsiaUrl(): string {
  const url = getBaseUrl();
  const host = getHost();
  const protocol = getProtocol();
  const redirect = protocol + '//' + host + '/projects';
  const redirectFromEsia = `${url}/esia/ok?redirect=${redirect}`;

  return `${url}/esia?redirect=${redirectFromEsia}`;
}

export function getApiImportUrl(projectId: number): string {
  return `${getDataUrl()}/import/${projectId}`;
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
