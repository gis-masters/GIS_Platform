import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {WorkImport} from '../geoserver/import/workImport';
import {HttpClient} from '@angular/common/http';
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class GisDbService {

  constructor(private http: HttpClient,
              private serverProp: ServerPropertiesService,
              private logger: NGXLogger) {
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

    // this.logger.info('payload: ', payload);

    return this.http.post(this.serverProp.baseUrl + '/db/import', payload);
  }

}
