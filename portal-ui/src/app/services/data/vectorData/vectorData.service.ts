import { Coordinate } from 'ol/coordinate';

import { CoordinateEdited, NewWfsFeature, WfsFeature } from '../../geoserver/wfs/wfs.models';
import { communicationService } from '../../communication.service';
import { CrgLayer } from '../../gis/layers/layers.models';
import { PageOptions } from '../../models';

import {
  _reqCopyFeaturesBetweenLayers,
  _reqCreateDataset,
  _reqCreateFeature,
  _reqCreateVectorTable,
  _reqDeleteDataset,
  _reqDeleteFeatures,
  _reqDeleteVectorTable,
  _getAllVectorTablesInDataset,
  _reqGetDataset,
  _reqGetDatasets,
  _reqGetDatasetsWithParticularOne,
  _reqGetVectorTables,
  _reqGetVectorTablesWithParticularOne,
  _reqGetVectorTableConnections,
  _reqGetVectorTable,
  _reqUpdateDataset,
  _reqUpdateFeature,
  _reqUpdateVectorTable,
  _reqGetAllDatasets
} from './vectorData.client';
import { Dataset, NewDataset, NewVectorTable, VectorTable, VectorTableConnection } from './vectorData.models';

// dataset

export function getDataset(identifier: string): Promise<Dataset> {
  return _reqGetDataset(identifier);
}

export async function getDatasets(pageOptions: PageOptions): Promise<[Dataset[], number]> {
  const response = await _reqGetDatasets(pageOptions);

  return [(response._embedded && response._embedded.datasets) || [], response.page.totalPages];
}

export async function getAllDatasets(): Promise<Dataset[]> {
  return await _reqGetAllDatasets();
}

export async function getDatasetsWithParticularOne(
  identifier: string,
  pageOptions: PageOptions
): Promise<[Dataset[], number, number] | undefined> {
  return await _reqGetDatasetsWithParticularOne(identifier, pageOptions);
}

export async function createDataset(newDataset: NewDataset): Promise<Dataset> {
  const result = await _reqCreateDataset(newDataset);
  communicationService.datasetUpdated.emit({ type: 'create', data: result });

  return result;
}

export async function updateDataset(dataset: Dataset, patch: Partial<Dataset>): Promise<void> {
  await _reqUpdateDataset(dataset.identifier, patch);
  communicationService.datasetUpdated.emit({ type: 'update', data: dataset });
}

export async function deleteDataset(dataset: Dataset): Promise<void> {
  await _reqDeleteDataset(dataset.identifier);
  communicationService.datasetUpdated.emit({ type: 'delete', data: dataset });
}

// vector table

export async function getVectorTable(datasetIdentifier: string, identifier: string): Promise<VectorTable> {
  const response = await _reqGetVectorTable(datasetIdentifier, identifier);

  return { ...response, dataset: datasetIdentifier };
}

export async function getVectorTables(
  datasetIdentifier: string,
  pageOptions: PageOptions
): Promise<[VectorTable[], number]> {
  const response = await _reqGetVectorTables(datasetIdentifier, pageOptions);
  const vectorTables: VectorTable[] = (response._embedded?.tables || []).map(table => ({
    ...table,
    dataset: datasetIdentifier
  }));

  return [vectorTables, response.page.totalPages];
}

export async function getVectorTablesWithParticularOne(
  datasetIdentifier: string,
  vectorTableIdentifier: string,
  pageOptions: PageOptions
): Promise<[VectorTable[], number, number] | undefined> {
  const response = await _reqGetVectorTablesWithParticularOne(datasetIdentifier, vectorTableIdentifier, pageOptions);

  if (response) {
    const [tables, totalPages, page] = response;
    tables.forEach(table => {
      table.dataset = datasetIdentifier;
    });

    return [tables, totalPages, page];
  }

  return response;
}

export async function getAllVectorTablesInDataset(dataset: Dataset): Promise<VectorTable[]> {
  const vectorTables = await _getAllVectorTablesInDataset(dataset.identifier);

  return vectorTables.map(table => ({
    ...table,
    dataset: dataset.identifier
  }));
}

export async function createVectorTable(datasetIdentifier: string, table: NewVectorTable): Promise<VectorTable> {
  const response = await _reqCreateVectorTable(datasetIdentifier, table);
  communicationService.vectorTableUpdated.emit({ type: 'create', data: response });

  return response;
}

export async function updateVectorTable(vectorTable: VectorTable, patch: Partial<VectorTable>): Promise<void> {
  await _reqUpdateVectorTable(vectorTable.dataset, vectorTable.identifier, patch);
  // api возвращает болт #5349
  communicationService.vectorTableUpdated.emit({ type: 'update', data: { ...vectorTable, ...patch } });
}

export async function deleteVectorTable(vectorTable: VectorTable): Promise<void> {
  await _reqDeleteVectorTable(vectorTable.dataset, vectorTable.identifier);
  communicationService.vectorTableUpdated.emit({ type: 'delete', data: vectorTable });
}

export async function getVectorTableConnections(vectorTableIdentifier: string): Promise<VectorTableConnection[]> {
  return _reqGetVectorTableConnections(vectorTableIdentifier);
}

// feature

export async function createFeature(
  datasetIdentifier: string,
  vectorTableIdentifier: string,
  feature: NewWfsFeature
): Promise<WfsFeature> {
  const response = await _reqCreateFeature(datasetIdentifier, vectorTableIdentifier, feature);
  communicationService.featuresUpdated.emit({ type: 'create', data: response });

  return response;
}

export async function updateFeature(
  datasetIdentifier: string,
  vectorTableIdentifier: string,
  recordId: string,
  patch: Partial<WfsFeature>
): Promise<void> {
  await _reqUpdateFeature(datasetIdentifier, vectorTableIdentifier, recordId, patch);
  communicationService.featuresUpdated.emit({ type: 'update', data: null });
}

export async function copyFeaturesBetweenLayers(
  sourceLayer: CrgLayer,
  targetLayer: CrgLayer,
  features: WfsFeature[]
): Promise<void> {
  const featureIds = features.map(feature => Number(feature.id.split('.')[1]));

  await _reqCopyFeaturesBetweenLayers(
    sourceLayer.dataset,
    sourceLayer.tableName,
    targetLayer.dataset,
    targetLayer.tableName,
    featureIds
  );

  communicationService.featuresUpdated.emit({ type: 'create', data: null });
}

export async function deleteFeatures(
  datasetIdentifier: string,
  vectorTableIdentifier: string,
  features: WfsFeature<Coordinate | CoordinateEdited>[]
): Promise<void> {
  const featureIds = features.map(feature => feature.id.split('.')[1]);
  await _reqDeleteFeatures(datasetIdentifier, vectorTableIdentifier, featureIds);
  communicationService.featuresUpdated.emit({ type: 'delete', data: null });
}

// for autotests
if (typeof window !== 'undefined') {
  Object.assign(window, {
    getDatasets,
    getVectorTables,
    createVectorTable,
    deleteVectorTable,
    updateVectorTable,
    createFeature
  });
}
