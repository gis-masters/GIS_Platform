import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private logger: NGXLogger) {

  }

  saveByKey(payload: any, key: string): void {
    window.localStorage.setItem(key, payload);
  }

  getByKey(key: string): any {
    return localStorage.getItem(key);
  }
}
