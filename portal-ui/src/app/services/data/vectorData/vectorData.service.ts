import { communicationService } from '../../communication.service';
import { extractFeatureId } from '../../geoserver/featureType/featureType.util';
import { CrgFeature, NewWfsFeature, WfsFeature } from '../../geoserver/wfs/wfs.models';
import { PageOptions } from '../../models';
import { Schema } from '../schema/schema.models';
import { convertNewToOldSchema, convertOldToNewSchema } from '../schema/schema.utils';
import { vectorDataClient } from './vectorData.client';
import {
  Dataset,
  NewDataset,
  NewVectorTable,
  TablesData,
  VectorTable,
  VectorTableConnection
} from './vectorData.models';

// dataset

export function getDataset(identifier: string): Promise<Dataset> {
  return vectorDataClient.getDataset(identifier);
}

export function getTablesBySrid(srid: number): Promise<TablesData[]> {
  return vectorDataClient.getTablesBySrid(srid);
}

export async function getDatasets(pageOptions: PageOptions): Promise<[Dataset[], number]> {
  const response = await vectorDataClient.getDatasets(pageOptions);

  return [response.content || [], response.page.totalPages];
}

export async function getDatasetsWithParticularOne(
  identifier: string,
  pageOptions: PageOptions
): Promise<[Dataset[], number, number] | undefined> {
  return await vectorDataClient.getDatasetsWithParticularOne(identifier, pageOptions);
}

export async function createDataset(newDataset: NewDataset): Promise<Dataset> {
  const result = await vectorDataClient.createDataset(newDataset);
  communicationService.datasetUpdated.emit({ type: 'create', data: result });

  return result;
}

export async function updateDataset(dataset: Dataset, patch: Partial<Dataset>): Promise<void> {
  await vectorDataClient.updateDataset(dataset.identifier, patch);
  communicationService.datasetUpdated.emit({ type: 'update', data: dataset });
}

export async function deleteDataset(dataset: Dataset): Promise<void> {
  await vectorDataClient.deleteDataset(dataset.identifier);
  communicationService.datasetUpdated.emit({ type: 'delete', data: dataset });
}

// vector table

export async function getVectorTable(datasetIdentifier: string, identifier: string): Promise<VectorTable> {
  const response = await vectorDataClient.getVectorTable(datasetIdentifier, identifier);

  return { ...response, schema: convertOldToNewSchema(response.schema) };
}

export async function getVectorTables(
  datasetIdentifier: string,
  pageOptions: PageOptions
): Promise<[VectorTable[], number]> {
  const response = await vectorDataClient.getVectorTables(datasetIdentifier, pageOptions);
  const vectorTables: VectorTable[] = (response.content || []).map(table => ({
    ...table,
    schema: convertOldToNewSchema(table.schema)
  }));

  return [vectorTables, response.page.totalPages];
}

export async function getVectorTablesWithParticularOne(
  datasetIdentifier: string,
  vectorTableIdentifier: string,
  pageOptions: PageOptions
): Promise<[VectorTable[], number, number] | undefined> {
  const response = await vectorDataClient.getVectorTablesWithParticularOne(
    datasetIdentifier,
    vectorTableIdentifier,
    pageOptions
  );

  if (response) {
    const [tables, totalPages, page] = response;
    const enriched = tables.map(table => ({
      ...table,
      schema: convertOldToNewSchema(table.schema)
    }));

    return [enriched, totalPages, page];
  }
}

export async function getAllVectorTablesInDataset(dataset: Dataset): Promise<VectorTable[]> {
  const vectorTables = await vectorDataClient.getAllVectorTablesInDataset(dataset.identifier);

  return vectorTables.map(table => ({
    ...table,
    schema: convertOldToNewSchema(table.schema)
  }));
}

export async function getVectorTablesInAllDatasets(pageOptions: Partial<PageOptions>): Promise<VectorTable[]> {
  const data = await vectorDataClient.getVectorTablesInAllDatasets(pageOptions);

  return data.map(table => ({ ...table, schema: convertOldToNewSchema(table.schema) }));
}

export async function createVectorTable(datasetIdentifier: string, table: NewVectorTable): Promise<VectorTable> {
  const response = await vectorDataClient.createVectorTable(datasetIdentifier, table);
  const enriched = { ...response, schema: convertOldToNewSchema(response.schema) };
  communicationService.vectorTableUpdated.emit({ type: 'create', data: enriched });

  return enriched;
}

export async function updateVectorTable(vectorTable: VectorTable, patch: Partial<VectorTable>): Promise<void> {
  await vectorDataClient.updateVectorTable(vectorTable.dataset, vectorTable.identifier, patch);
  // api возвращает болт #5349
  communicationService.vectorTableUpdated.emit({ type: 'update', data: { ...vectorTable, ...patch } });
}

export async function updateVectorTableSchema(vectorTable: VectorTable, schema: Schema): Promise<void> {
  await vectorDataClient.updateVectorTableSchema(
    vectorTable.dataset,
    vectorTable.identifier,
    convertNewToOldSchema(schema)
  );

  vectorTable.schema = schema;
  communicationService.vectorTableUpdated.emit({ type: 'update', data: vectorTable });
}

export async function deleteVectorTable(vectorTable: VectorTable): Promise<void> {
  await vectorDataClient.deleteVectorTable(vectorTable.dataset, vectorTable.identifier);
  communicationService.vectorTableUpdated.emit({ type: 'delete', data: vectorTable });
}

export async function getVectorTableConnections(vectorTableIdentifier: string): Promise<VectorTableConnection[]> {
  return vectorDataClient.getVectorTableConnections(vectorTableIdentifier);
}

// feature

export async function createFeature(
  datasetIdentifier: string,
  tableIdentifier: string,
  feature: NewWfsFeature | WfsFeature,
  notUpdateFeatures?: boolean
): Promise<WfsFeature> {
  const newFeature: NewWfsFeature = { geometry: feature.geometry, type: feature.type, properties: feature.properties };

  const response = await vectorDataClient.createFeature(datasetIdentifier, tableIdentifier, newFeature);
  if (!notUpdateFeatures) {
    communicationService.featuresUpdated.emit({ type: 'create', data: response });
  }

  return response;
}

export async function updateFeature(
  datasetIdentifier: string,
  vectorTableIdentifier: string,
  patchedFeature: CrgFeature
): Promise<void> {
  await vectorDataClient.updateFeature(datasetIdentifier, vectorTableIdentifier, patchedFeature);
}

export async function deleteFeaturesAndEmitEvent(
  datasetIdentifier: string,
  vectorTableIdentifier: string,
  features: WfsFeature[]
): Promise<void> {
  const featureIds = features.map(feature => extractFeatureId(feature.id));
  await vectorDataClient.deleteFeatures(datasetIdentifier, vectorTableIdentifier, featureIds);

  communicationService.featuresUpdated.emit({ type: 'delete', data: null });
}
