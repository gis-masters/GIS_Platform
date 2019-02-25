import {NGXLogger} from 'ngx-logger';
import {Layer} from './layers.service';
import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {StringUtil} from '../util/StringUtil';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {

  constructor(private http: HttpClient,
              private logger: NGXLogger) {
  }

  getByLayerResource(layer: Layer): Observable<any> {
    const url = StringUtil.getHrefFromBlyadskiyJson(layer);

    return this.http
               .get<any>(url);
  }

  getByLayersResource(layers: Layer[]) {
    const observableTasks = [];
    layers.forEach((layer: Layer) => {
      observableTasks.push(this.getByLayerResource(layer));
    });

    return forkJoin(observableTasks);
  }

}
