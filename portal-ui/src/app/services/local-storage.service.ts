import {Injectable} from '@angular/core';
import {StorageKeys} from './storage-keys';
import {LogModel} from './logger/fiz.logger';
import {ProjectModel} from './geoserver/import/projectModel';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {

  }

  cleanUp() {
    window.localStorage.clear();
  }

  saveByKey(key: string, payload: any): void {
    window.localStorage.setItem(key, payload);
  }

  getByKey(key: string): any {
    return localStorage.getItem(key);
  }

  clearByKey(key: string): any {
    return localStorage.removeItem(key);
  }

  getProject(): ProjectModel {
    return JSON.parse(this.getByKey(StorageKeys.projectKey)) as ProjectModel;
  }

  clearProject(): void {
    this.clearByKey(StorageKeys.projectKey);
  }

  getOrganizationId(): number {
    const orgId = this.getByKey(StorageKeys.orgId);
    if (!!orgId) {
      return orgId;
    } else {
      throw Error('Не удалось получить id организации');
    }
  }

  setLogModel(model: LogModel) {
    this.saveByKey(StorageKeys.logModel, JSON.stringify(model));
  }

  getLogModel(): LogModel {
    return JSON.parse(this.getByKey(StorageKeys.logModel)) as LogModel;
  }
}
