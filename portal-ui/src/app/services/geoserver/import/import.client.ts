import { boundClass } from 'autobind-decorator';

import { http } from '../../api/http.service';
import { GeoserverClient } from '../GeoserverClient';
import { ImportLayer, ImportTaskFull, ImportTaskProgress, InputStartResponseDto } from './import.models';

@boundClass
class ImportClient extends GeoserverClient {
  private static _instance: ImportClient;
  static get instance(): ImportClient {
    return this._instance || (this._instance = new this());
  }

  getGeoserverImportsUrl(): string {
    return this.getGeoserverUrl() + '/rest/imports';
  }

  getGeoserverImportUrl(importId: number | string): string {
    return `${this.getGeoserverImportsUrl()}/${importId}`;
  }

  getGeoserverImportTasksUrl(importId: number | string): string {
    return `${this.getGeoserverImportUrl(importId)}/tasks`;
  }

  getGeoserverImportTaskUrl(importId: number | string, taskId: number): string {
    return `${this.getGeoserverImportTasksUrl(importId)}/${taskId}`;
  }

  getGeoserverImportTaskProgressUrl(importId: number | string, taskId: number): string {
    return `${this.getGeoserverImportTasksUrl(importId)}/${taskId}/progress`;
  }

  getGeoserverImportTaskLayerUrl(importId: number | string, taskId: number): string {
    return `${this.getGeoserverImportTaskUrl(importId, taskId)}/layer`;
  }

  async getImport(importId: string) {
    return http.get<InputStartResponseDto>(this.getGeoserverImportUrl(importId));
  }

  async getImportWithoutCache(importId: string) {
    return http.get<InputStartResponseDto>(importClient.getGeoserverImportUrl(importId), {
      cache: { disabled: true }
    });
  }

  async getImportTaskProgress(importId: string, taskId: number) {
    return http.get<ImportTaskProgress>(importClient.getGeoserverImportTaskProgressUrl(importId, taskId), {
      cache: { disabled: true }
    });
  }

  async getTask(importId: string, taskId: number) {
    return http.get<{ task: ImportTaskFull }>(importClient.getGeoserverImportTaskUrl(importId, taskId));
  }

  async getTaskLayer(importId: string, taskId: number) {
    return http.get<ImportLayer>(importClient.getGeoserverImportTaskLayerUrl(importId, taskId));
  }

  async deleteTask(importId: string, taskId: number) {
    await http.delete(this.getGeoserverImportTaskUrl(importId, taskId));
  }
}

export const importClient = new ImportClient();
