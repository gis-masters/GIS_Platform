import { boundClass } from 'autobind-decorator';

import { PageableResponse, PageOptions } from '../../models';
import { preparePageOptions } from '../../api/http.utils';
import { http } from '../../api/http.service';
import { NewWfsFeature, WfsFeature } from '../../geoserver/wfs/wfs.models';
import { DataClient } from '../DataClient';

import { Dataset, NewDataset, VectorTable, VectorTableConnection, NewVectorTable } from './vectorData.models';

@boundClass
class VectorDataClient extends DataClient {
  private static _instance: VectorDataClient;

  static get instance(): VectorDataClient {
    return this._instance || (this._instance = new this());
  }

  private getTableConnectionsUrl(): string {
    return `${this.getProjectsUrl()}/find-related-layers`;
  }

  private getVectorTableRecordsUrl(datasetIdentifier: string, tableIdentifier: string): string {
    return `${this.getDatasetUrl(datasetIdentifier)}/tables/${tableIdentifier}/records`;
  }

  // Для удаления может быть передано множество id через запятую
  private getFeatureUrl(datasetIdentifier: string, tableIdentifier: string, recordId: number | string): string {
    return `${this.getDatasetUrl(datasetIdentifier)}/tables/${tableIdentifier}/records/${recordId}`;
  }

  private getRecordsCopyUrl(): string {
    return `${this.getDataUrl()}/records/copy`;
  }

  // dataset

  async getDataset(identifier: string): Promise<Dataset> {
    return http.get<Dataset>(this.getDatasetUrl(identifier));
  }

  async getDatasets(pageOptions: PageOptions): Promise<PageableResponse<Dataset>> {
    const params = preparePageOptions(pageOptions, true);

    return http.get<PageableResponse<Dataset>>(this.getDatasetsUrl(), { params });
  }

  async getDatasetsWithParticularOne(
    identifier: string,
    pageOptions: PageOptions
  ): Promise<[Dataset[], number, number]> {
    return http.getPageWithObject<Dataset>(
      this.getDatasetsUrl(),
      preparePageOptions(pageOptions, true),
      (item: Dataset) => item.identifier === identifier,
      {},
      true
    );
  }

  async getAllDatasets(): Promise<Dataset[]> {
    return http.getPagedOld<Dataset>(this.getDatasetsUrl());
  }

  async createDataset(newDataset: NewDataset): Promise<Dataset> {
    return http.post(this.getDatasetsUrl(), newDataset);
  }

  async updateDataset(datasetIdentifier: string, patch: Partial<Dataset>): Promise<void> {
    return http.patch(this.getDatasetUrl(datasetIdentifier), patch);
  }

  async deleteDataset(datasetIdentifier: string): Promise<void> {
    return http.delete(this.getDatasetUrl(datasetIdentifier));
  }

  // vector table

  async getVectorTable(datasetIdentifier: string, identifier: string): Promise<Omit<VectorTable, 'dataset'>> {
    return http.get<Omit<VectorTable, 'dataset'>>(this.getVectorTableUrl(datasetIdentifier, identifier));
  }

  async getVectorTables(
    datasetIdentifier: string,
    pageOptions: PageOptions
  ): Promise<PageableResponse<Omit<VectorTable, 'dataset'>>> {
    const url = this.getVectorTablesUrl(datasetIdentifier);
    const params = preparePageOptions(pageOptions, true);

    return http.get<PageableResponse<Omit<VectorTable, 'dataset'>>>(url, { params });
  }

  async getVectorTablesWithParticularOne(
    datasetIdentifier: string,
    vectorTableIdentifier: string,
    pageOptions: PageOptions
  ): Promise<[VectorTable[], number, number] | undefined> {
    return http.getPageWithObject<VectorTable>(
      this.getVectorTablesUrl(datasetIdentifier),
      preparePageOptions(pageOptions, true),
      (item: VectorTable) => item.identifier === vectorTableIdentifier,
      {},
      true
    );
  }

  async getAllVectorTablesInDataset(datasetIdentifier: string): Promise<Omit<VectorTable, 'dataset'>[]> {
    return http.getPagedOld<Omit<VectorTable, 'dataset'>>(this.getVectorTablesUrl(datasetIdentifier), {
      params: { sort: 'title,asc' }
    });
  }

  async createVectorTable(datasetIdentifier: string, table: NewVectorTable): Promise<VectorTable> {
    return http.post<VectorTable>(this.getVectorTablesUrl(datasetIdentifier), table);
  }

  async updateVectorTable(
    datasetIdentifier: string,
    vectorTableIdentifier: string,
    patch: Partial<VectorTable>
  ): Promise<void> {
    return http.put(this.getVectorTableUrl(datasetIdentifier, vectorTableIdentifier), patch);
  }

  async deleteVectorTable(datasetIdentifier: string, vectorTableIdentifier: string): Promise<void> {
    return http.delete(this.getVectorTableUrl(datasetIdentifier, vectorTableIdentifier));
  }

  async getVectorTableConnections(vectorTableIdentifier: string): Promise<VectorTableConnection[]> {
    const params = {
      field: 'table',
      value: vectorTableIdentifier
    };

    return http.get<VectorTableConnection[]>(this.getTableConnectionsUrl(), { params });
  }

  // feature

  async createFeature(
    datasetIdentifier: string,
    vectorTableIdentifier: string,
    feature: NewWfsFeature
  ): Promise<WfsFeature> {
    return await http.post<WfsFeature>(
      this.getVectorTableRecordsUrl(datasetIdentifier, vectorTableIdentifier),
      feature
    );
  }

  async updateFeature(
    datasetIdentifier: string,
    vectorTableIdentifier: string,
    recordId: number,
    patch: Partial<WfsFeature>
  ): Promise<void> {
    return http.patch(this.getFeatureUrl(datasetIdentifier, vectorTableIdentifier, recordId), patch);
  }

  async copyFeaturesBetweenLayers(
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

    return http.post(this.getRecordsCopyUrl(), copyFeaturesInfo);
  }

  async deleteFeatures(datasetIdentifier: string, vectorTableIdentifier: string, featureIds: number[]): Promise<void> {
    return http.delete(this.getFeatureUrl(datasetIdentifier, vectorTableIdentifier, featureIds.join(',')));
  }
}

export const vectorDataClient = VectorDataClient.instance;
