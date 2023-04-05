import { PageableResponse, PageOptions } from '../../models';
import {
  getDatasetsUrl,
  getVectorTableRecordsUrl,
  getFeatureUrl,
  getVectorTablesUrl,
  getVectorTableUrl,
  getDatasetUrl,
  getRecordsCopyUrl,
  getTableConnectionsUrl
} from '../../api/server-urls.service';
import { preparePageOptions } from '../../api/http.utils';
import { http } from '../../api/http.service';
import { NewWfsFeature, WfsFeature } from '../../geoserver/wfs/wfs.models';

import { Dataset, NewDataset, VectorTable, VectorTableConnection, NewVectorTable } from './vectorData.models';

// dataset

export async function _reqGetDataset(identifier: string): Promise<Dataset> {
  return http.get<Dataset>(await getDatasetUrl(identifier));
}

export async function _reqGetDatasets(pageOptions: PageOptions): Promise<PageableResponse<Dataset>> {
  const params = preparePageOptions(pageOptions, true);

  return http.get<PageableResponse<Dataset>>(await getDatasetsUrl(), { params });
}

export async function _reqGetDatasetsWithParticularOne(
  identifier: string,
  pageOptions: PageOptions
): Promise<[Dataset[], number, number]> {
  return http.getPageWithObject<Dataset>(
    await getDatasetsUrl(),
    preparePageOptions(pageOptions, true),
    (item: Dataset) => item.identifier === identifier,
    {},
    true
  );
}

export async function _reqGetAllDatasets(): Promise<Dataset[]> {
  return http.getPagedOld<Dataset>(await getDatasetsUrl());
}

export async function _reqCreateDataset(newDataset: NewDataset): Promise<Dataset> {
  return http.post(await getDatasetsUrl(), newDataset);
}

export async function _reqUpdateDataset(datasetIdentifier: string, patch: Partial<Dataset>): Promise<void> {
  return http.patch(await getDatasetUrl(datasetIdentifier), patch);
}

export async function _reqDeleteDataset(datasetIdentifier: string): Promise<void> {
  return http.delete(await getDatasetUrl(datasetIdentifier));
}

// vector table

export async function _reqGetVectorTable(
  datasetIdentifier: string,
  identifier: string
): Promise<Omit<VectorTable, 'dataset'>> {
  return http.get<Omit<VectorTable, 'dataset'>>(await getVectorTableUrl(datasetIdentifier, identifier));
}

export async function _reqGetVectorTables(
  datasetIdentifier: string,
  pageOptions: PageOptions
): Promise<PageableResponse<Omit<VectorTable, 'dataset'>>> {
  const url = await getVectorTablesUrl(datasetIdentifier);
  const params = preparePageOptions(pageOptions, true);

  return http.get<PageableResponse<Omit<VectorTable, 'dataset'>>>(url, { params });
}

export async function _reqGetVectorTablesWithParticularOne(
  datasetIdentifier: string,
  vectorTableIdentifier: string,
  pageOptions: PageOptions
): Promise<[VectorTable[], number, number] | undefined> {
  return http.getPageWithObject<VectorTable>(
    await getVectorTablesUrl(datasetIdentifier),
    preparePageOptions(pageOptions, true),
    (item: VectorTable) => item.identifier === vectorTableIdentifier,
    {},
    true
  );
}

export async function _getAllVectorTablesInDataset(datasetIdentifier: string): Promise<Omit<VectorTable, 'dataset'>[]> {
  return http.getPagedOld<Omit<VectorTable, 'dataset'>>(await getVectorTablesUrl(datasetIdentifier), {
    params: { sort: 'title,asc' }
  });
}

export async function _reqCreateVectorTable(datasetIdentifier: string, table: NewVectorTable): Promise<VectorTable> {
  return http.post<VectorTable>(await getVectorTablesUrl(datasetIdentifier), table);
}

export async function _reqUpdateVectorTable(
  datasetIdentifier: string,
  vectorTableIdentifier: string,
  patch: Partial<VectorTable>
): Promise<void> {
  return http.put(await getVectorTableUrl(datasetIdentifier, vectorTableIdentifier), patch);
}

export async function _reqDeleteVectorTable(datasetIdentifier: string, vectorTableIdentifier: string): Promise<void> {
  return http.delete(await getVectorTableUrl(datasetIdentifier, vectorTableIdentifier));
}

export async function _reqGetVectorTableConnections(vectorTableIdentifier: string): Promise<VectorTableConnection[]> {
  const params = {
    field: 'table',
    value: vectorTableIdentifier
  };

  return http.get<VectorTableConnection[]>(await getTableConnectionsUrl(), { params });
}

// feature

export async function _reqCreateFeature(
  datasetIdentifier: string,
  vectorTableIdentifier: string,
  feature: NewWfsFeature
): Promise<WfsFeature> {
  return await http.post<WfsFeature>(await getVectorTableRecordsUrl(datasetIdentifier, vectorTableIdentifier), feature);
}

export async function _reqUpdateFeature(
  datasetIdentifier: string,
  vectorTableIdentifier: string,
  recordId: string,
  patch: Partial<WfsFeature>
): Promise<void> {
  return http.patch(await getFeatureUrl(datasetIdentifier, vectorTableIdentifier, recordId), patch);
}

export async function _reqCopyFeaturesBetweenLayers(
  sourceDatasetIdentifier: string,
  sourceVectorTableIdentifier: string,
  targetDatasetIdentifier: string,
  targetVectorTableIdentifier: string,
  featureIds: number[]
): Promise<void> {
  const copyFeaturesInfo = {
    source: {
      schema: sourceDatasetIdentifier,
      table: sourceVectorTableIdentifier
    },
    target: {
      schema: targetDatasetIdentifier,
      table: targetVectorTableIdentifier
    },
    featureIds
  };

  return http.post(await getRecordsCopyUrl(), copyFeaturesInfo);
}

export async function _reqDeleteFeatures(
  datasetIdentifier: string,
  vectorTableIdentifier: string,
  featureIds: string[]
): Promise<void> {
  return http.delete(await getFeatureUrl(datasetIdentifier, vectorTableIdentifier, featureIds.join(',')));
}
