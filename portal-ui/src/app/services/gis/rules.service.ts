import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

  getRules(): Observable<EntityType[] | any> {
    return this.http
               .get<EntityType[]>(this.serverProp.rulesUrl);
  }

}

// export interface ClassDefinition {
//   fgistpClassTypes: GisClassType;
// }

export interface EntityType {
  name: string;
  title: string;
  description: string;
  properties: any;
}

export interface SimpleProperty {
  name: string;
  title: string;
  description: string;

}
