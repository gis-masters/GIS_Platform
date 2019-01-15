import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {WorkImport} from './import.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GisDbService {

  hostUrl = 'http://localhost:8088';

  constructor(private http: HttpClient,
              private logger: NGXLogger) {
  }

  getDbTables(dbName: string, schema?: string): Observable<TableProjection[] | any> {
    const headers = new HttpHeaders({
      // 'Bearer': this.tokenStorage.getAccessToken(),
    });

    return this.http.get<TableProjection[]>(this.makeUrl(dbName, schema));
  }

  doWorkImport(workImport: WorkImport) {
    const payload = {
      dbName: 'gis',
      sourceSchema: 'public',
      targetSchema: 'fiz',
      importTasks: workImport.tasks
    };

    this.logger.info('payload: ', payload);

    return this.http.post(this.hostUrl + '/db/import', payload);
  }

  private makeUrl(dbName: string, schema: string) {
    if (schema) {
      return this.hostUrl + '/db/' + dbName + '/tables?schema=' + schema;
    } else {
      return this.hostUrl + '/db/' + dbName + '/tables';
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
