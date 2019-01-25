import {NGXLogger} from "ngx-logger";
import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ServerPropertiesService} from "./server-properties.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private serverProp: ServerPropertiesService) {

  }

  validateLayer(data: ValidationRequest): Observable<any> {
    return this.validateLayers([data]);
  }

  validateLayers(data: ValidationRequest[]): Observable<any> {
    return this.http
               .post(this.serverProp.validationUrl, data);
  }

}

interface ValidationRequest {
  dbName: string;
  schemaName: string;
  tableName: string;
}
