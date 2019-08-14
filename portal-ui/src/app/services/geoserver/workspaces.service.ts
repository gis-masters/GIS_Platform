import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {BaseService} from '../base.service';
import {TaskImport} from './import/taskImport';
import {WorkImport} from './import/workImport';
import {ProjectModel} from './import/projectModel';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from '../local-storage.service';
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspacesService {

  private geoserverWorkspaceUrl = this.serverProp.geoServerUrl + '/rest/workspaces';

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private baseService: BaseService,
              private storageService: LocalStorageService,
              private serverProp: ServerPropertiesService) {
    logger.info('WorkspacesService start');
  }

  /**
   * Опубликовать слой на геосервере.
   * Для публикации в БД должна быть уже заполненная таблица.
   *
   * /geoserver/rest/workspaces/work_workspace/datastores/work_workspace_store/featuretypes
   * @param projectModel Проект
   * @param table Название таблицы
   */
  publishLayer(projectModel: ProjectModel, table: string): Observable<any> {
    const orgId = this.storageService.getOrgId();
    const workspaceName = projectModel.crgProject.workspaceName;
    const storeName = 'database_' + orgId + '_store';

    return this.http.post(
      this.geoserverWorkspaceUrl + '/' + workspaceName + '/datastores/' + storeName + '/featuretypes',
      {featureType: {name: table}});
  }

  /**
   * Публикация слоев рабочего импорта.
   * @param workImport -
   */
  publishLayers(workImport: WorkImport): Observable<any> {
    const observableTasks = [];
    workImport.tasks.forEach((task: TaskImport) => {
      observableTasks.push(this.publishLayer(workImport.projectModel, task.workTableName));
    });

    return forkJoin(observableTasks);
  }

}
