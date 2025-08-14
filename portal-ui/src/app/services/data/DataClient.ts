import { Client } from '../api/Client';

export abstract class DataClient extends Client {
  protected getDatasetsUrl(): string {
    return `${this.getDataUrl()}/datasets`;
  }

  protected getDatasetUrl(datasetIdentifier: string): string {
    return `${this.getDatasetsUrl()}/${datasetIdentifier}`;
  }

  protected getDatasetTablesBySridUrl(): string {
    return `${this.getDatasetsUrl()}/getTablesBySrid`;
  }

  protected getVectorTablesUrl(datasetIdentifier: string): string {
    return `${this.getDatasetUrl(datasetIdentifier)}/tables`;
  }

  protected getVectorTableUrl(datasetIdentifier: string, tableIdentifier: string): string {
    return `${this.getDatasetUrl(datasetIdentifier)}/tables/${tableIdentifier}`;
  }

  protected getAllVectorTablesUrl(): string {
    return `${this.getDataUrl()}/tables`;
  }
}
