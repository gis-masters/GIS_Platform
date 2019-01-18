import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ValueTitleProjection} from "../geoserver/projections";
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class GisService {

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private serverProp: ServerPropertiesService) {
    logger.info('LayersService start');
  }

  getRules(): Observable<EntityDefinition[] | any> {
    return this.http
               .get<EntityDefinition[]>(this.serverProp.rulesUrl);
  }

}

export interface EntityDefinition {
  entityTypes: EntityType[];
}

export interface EntityType {
  name: string;
  title: string;
  description: string;
  properties: SimpleProperty[];
  tableName: string;
}

export interface SimpleProperty {
  name: string;
  title: string;
  description?: string;

  required?: boolean;
  hidden?: boolean;
  isMultiple?: boolean;

  updateability?: any;
  choice?: any;
  valueType?: any;

  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternDescription?: string;
  minInclusive?: number;
  maxInclusive?: number;
  totalDigits?: number;
  allowedValues?: string[];
  enumerations?: ValueTitleProjection;
}
