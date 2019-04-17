import { Injectable } from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {StorageKeys} from './storage-keys';
import {ProjectModel} from './geoserver/import/projectModel';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private logger: NGXLogger) {

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
}
