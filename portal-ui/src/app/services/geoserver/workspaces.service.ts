import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {TaskImport} from './import/taskImport';
import {WorkImport} from './import/workImport';
import {NameHrefProjection} from './projections';
import {forkJoin, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspacesService {

  private geoserverWorkspaceUrl = this.serverProp.geoServerUrl + '/rest/workspaces';

  private JSON_FORMAT = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private baseService: BaseService,
              private serverProp: ServerPropertiesService) {
    logger.info('WorkspacesService start');
  }

  /**
   * Получить все слоя рабочей области.
   * @param name Название рабочей области.
   */
  getLayers(name: string): Observable<any> {
    this.logger.info('All layers for workspace: ', name);

    return this.http
               .get<NameHrefProjection>(this.geoserverWorkspaceUrl + '/' + name + '/layers')
               .pipe(
                 map((response: any) => response.layers.layer)
               );

  }

  /**
   * Опубликовать слой на геосервере.
   * Для публикации в БД должна быть уже заполненная таблица.
   *
   * /geoserver/rest/workspaces/work_workspace/datastores/work_workspace_store/featuretypes
   * @param workspace Название рабочей области
   * @param store Название хранилища
   * @param table Название таблицы
   */
  publishLayer(workspace: string, store: string, table: string): Observable<any> {
    // this.logger.info('publishLayer: ', workspace, store, table);

    return this.http.post(
      this.geoserverWorkspaceUrl + '/' + workspace + '/datastores/' + store + '/featuretypes',
      {featureType: {name: table}});
  }

  /**
   * Публикация слоев рабочего импорта.
   * @param workImport -
   */
  publishLayers(workImport: WorkImport): Observable<any> {
    this.logger.info('Publish ' + workImport.tasks.length + ' layers');

    const observableTasks = [];
    workImport.tasks.forEach((task: TaskImport) => {
      observableTasks.push(this.publishLayer(workImport.workspace, workImport.dataStore, task.workTableName));
    });

    return forkJoin(observableTasks);
  }

  getWorkspaceDataStore(url: string): Observable<GeoDataStore | any> {
    return this.http.get<GeoDataStore>(url);
  }

  deleteLayer(workspaceName: string, layerName: string) {
    return this.http
               .delete(this.geoserverWorkspaceUrl + '/' + workspaceName + '/layers/' + layerName);
  }
}

export interface GeoWorkspace {
  workspaces: {
    workspace: NameHrefProjection[]
  };
}

export interface GeoDataStore {
  dataStores: {
    dataStore: NameHrefProjection[]
  };
}

export interface GeoWorkspaceItem {
  coverageStores: string;
  dataStores: string;
  isolated: boolean;
  name: string;
  wmsStores: string;
  wmtsStores: string;
}
