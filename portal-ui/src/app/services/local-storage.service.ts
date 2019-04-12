import { Injectable } from '@angular/core';
import {NGXLogger} from 'ngx-logger';

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
}
