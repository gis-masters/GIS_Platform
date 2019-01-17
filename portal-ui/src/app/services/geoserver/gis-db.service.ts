import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {WorkImport} from './import.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ServerPropertiesService} from "../server-properties.service";

@Injectable({
  providedIn: 'root'
})
export class GisDbService {

  constructor(private http: HttpClient,
              private serverProp: ServerPropertiesService,
              private logger: NGXLogger) {
  }

  getDbTables(dbName: string, schema?: string): Observable<TableProjection[] | any> {
    const headers = new HttpHeaders({
      // 'Bearer': this.tokenStorage.getAccessToken(),
    });

    return this.http.get<TableProjection[]>(this.makeUrl(dbName, schema));
  }

  // TODO: Где брать название БД пользователя, и целевой схемы?
  // В СУБД под каждую организацию создается отдельная БД. Под каждый проект(рабочую область) создается схема
  doWorkImport(workImport: WorkImport) {
    const payload = {
      dbName: 'gis',
      sourceSchema: 'public',
      targetSchema: 'fiz',
      importTasks: workImport.tasks
    };

    this.logger.info('payload: ', payload);

    return this.http.post(this.serverProp.baseUrl + '/db/import', payload);
  }

  private makeUrl(dbName: string, schema: string) {
    if (schema) {
      return this.serverProp.baseUrl + '/db/' + dbName + '/tables?schema=' + schema;
    } else {
      return this.serverProp.baseUrl + '/db/' + dbName + '/tables';
    }
  }
}

export interface TableProjection {
  name: string;
  columns: ColumnProjection[];
}

export interface ColumnProjection {
  name: string;
  type: string;
}
