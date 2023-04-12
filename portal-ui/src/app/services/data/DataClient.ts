import { Client } from '../api/Client';

export abstract class DataClient extends Client {
  protected getDatasetsUrl(): string {
    return `${this.getDataUrl()}/datasets`;
  }
  protected getDatasetUrl(datasetIdentifier: string): string {
    return `${this.getDatasetsUrl()}/${datasetIdentifier}`;
  }

  protected getVectorTablesUrl(datasetIdentifier: string): string {
    return `${this.getDatasetUrl(datasetIdentifier)}/tables`;
  }

  protected getVectorTableUrl(datasetIdentifier: string, tableIdentifier: string): string {
    return `${this.getDatasetUrl(datasetIdentifier)}/tables/${tableIdentifier}`;
  }
}
