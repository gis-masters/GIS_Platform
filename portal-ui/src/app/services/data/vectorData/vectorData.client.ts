import { boundClass } from 'autobind-decorator';

import { PageableResources } from '../../../../server-types/common-contracts';
import { http, MAX_ITEMS_PER_PAGE } from '../../api/http.service';
import { preparePageOptions } from '../../api/http.utils';
import { CrgFeature, NewWfsFeature, WfsFeature } from '../../geoserver/wfs/wfs.models';
import { PageOptions } from '../../models';
import { DataClient } from '../DataClient';
import { OldSchema } from '../schema/schemaOld.models';
import {
  Dataset,
  NewDataset,
  NewVectorTable,
  RawVectorTable,
  TablesData,
  VectorTable,
  VectorTableConnection
} from './vectorData.models';

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

  private getVectorTableRecordsSchemaUrl(datasetIdentifier: string, tableIdentifier: string): string {
    return `${this.getDatasetUrl(datasetIdentifier)}/tables/${tableIdentifier}/schema`;
  }

  // Для удаления может быть передано множество id через запятую
  private getFeatureUrl(datasetIdentifier: string, tableIdentifier: string, recordId: number | string): string {
    return `${this.getDatasetUrl(datasetIdentifier)}/tables/${tableIdentifier}/records/${recordId}`;
  }

  // dataset

  async getDataset(identifier: string): Promise<Dataset> {
    return http.get<Dataset>(this.getDatasetUrl(identifier));
  }

  async getTablesBySrid(srid: number): Promise<TablesData[]> {
    return http.get<TablesData[]>(this.getDatasetTablesBySridUrl(), { params: { srid } });
  }

  async getDatasets(pageOptions: PageOptions): Promise<PageableResources<Dataset>> {
    const params = preparePageOptions(pageOptions, true);

    return http.get<PageableResources<Dataset>>(this.getDatasetsUrl(), { params });
  }

  async getDatasetsWithParticularOne(
    identifier: string,
    pageOptions: PageOptions
  ): Promise<[Dataset[], number, number] | undefined> {
    return http.getPageWithObject<Dataset>(
      this.getDatasetsUrl(),
      preparePageOptions(pageOptions, true),
      (item: Dataset) => item.identifier === identifier,
      {}
    );
  }

  async getAllDatasets(): Promise<Dataset[]> {
    return http.getPaged<Dataset>(this.getDatasetsUrl());
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

  async getVectorTable(datasetIdentifier: string, identifier: string): Promise<RawVectorTable> {
    return http.get<RawVectorTable>(this.getVectorTableUrl(datasetIdentifier, identifier));
  }

  async getVectorTables(
    datasetIdentifier: string,
    pageOptions: PageOptions
  ): Promise<PageableResources<RawVectorTable>> {
    const url = this.getVectorTablesUrl(datasetIdentifier);
    const params = preparePageOptions(pageOptions, true);

    return http.get<PageableResources<RawVectorTable>>(url, { params });
  }

  async getVectorTablesWithParticularOne(
    datasetIdentifier: string,
    vectorTableIdentifier: string,
    pageOptions: PageOptions
  ): Promise<[RawVectorTable[], number, number] | undefined> {
    return http.getPageWithObject<RawVectorTable>(
      this.getVectorTablesUrl(datasetIdentifier),
      preparePageOptions(pageOptions, true),
      (item: RawVectorTable) => item.identifier === vectorTableIdentifier,
      {}
    );
  }

  async getAllVectorTablesInDataset(datasetIdentifier: string): Promise<RawVectorTable[]> {
    return http.getPaged<RawVectorTable>(this.getVectorTablesUrl(datasetIdentifier), {
      params: { sort: 'title,asc' }
    });
  }

  async getVectorTablesInAllDatasets(pageOptions: Partial<PageOptions>): Promise<RawVectorTable[]> {
    const url = this.getAllVectorTablesUrl();
    const params = preparePageOptions({ page: 0, pageSize: MAX_ITEMS_PER_PAGE, ...pageOptions }, true);

    return http.getPaged<RawVectorTable>(url, { params });
  }

  async createVectorTable(datasetIdentifier: string, table: NewVectorTable): Promise<RawVectorTable> {
    return http.post<RawVectorTable>(this.getVectorTablesUrl(datasetIdentifier), table);
  }

  async updateVectorTable(
    datasetIdentifier: string,
    vectorTableIdentifier: string,
    patch: Partial<VectorTable>
  ): Promise<void> {
    return http.put(this.getVectorTableUrl(datasetIdentifier, vectorTableIdentifier), patch);
  }

  async updateVectorTableSchema(
    datasetIdentifier: string,
    vectorTableIdentifier: string,
    schema: OldSchema
  ): Promise<void> {
    return http.put(this.getVectorTableRecordsSchemaUrl(datasetIdentifier, vectorTableIdentifier), schema);
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

  async createFeature(datasetIdentifier: string, tableIdentifier: string, feature: NewWfsFeature): Promise<WfsFeature> {
    return await http.post<WfsFeature>(this.getVectorTableRecordsUrl(datasetIdentifier, tableIdentifier), feature);
  }

  async updateFeature(
    datasetIdentifier: string,
    vectorTableIdentifier: string,
    patchedFeature: CrgFeature
  ): Promise<void> {
    return http.patch(this.getFeatureUrl(datasetIdentifier, vectorTableIdentifier, patchedFeature.id), patchedFeature);
  }

  async deleteFeatures(datasetIdentifier: string, vectorTableIdentifier: string, featureIds: number[]): Promise<void> {
    return http.delete(this.getFeatureUrl(datasetIdentifier, vectorTableIdentifier, featureIds.join(',')));
  }
}

export const vectorDataClient = VectorDataClient.instance;
