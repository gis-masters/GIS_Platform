import {forkJoin, Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Layer} from "./layers.service";
import {NameHrefProjection} from "./projections";
import {StringUtil} from "../util/StringUtil";

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {

  constructor(private http: HttpClient,
              private logger: NGXLogger) {
  }

  getByLayerResource(layer: Layer): Observable<any> {
    let url = StringUtil.getHrefFromBlyadskiyJson(layer);

    this.logger.info(' ------------ ', url);

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
