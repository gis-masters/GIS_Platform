import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {TaskImport} from './import/taskImport';
import {WorkImport} from './import/workImport';
import {ProjectModel} from './import/projectModel';
import {LocalStorageService} from '../local-storage.service';
import {ServerPropertiesService} from '../server-properties.service';
import { HttpQueue } from '../util/HttpQueue';

@Injectable({
  providedIn: 'root'
})
export class WorkspacesService {

  constructor(private httpq: HttpQueue,
              private storageService: LocalStorageService,
              private serverProp: ServerPropertiesService) { }

  /**
   * Опубликовать слой на геосервере.
   * Для публикации в БД должна быть уже заполненная таблица.
   *
   * /geoserver/rest/workspaces/work_workspace/datastores/work_workspace_store/featuretypes
   * @param projectModel Проект
   * @param table Название таблицы
   */
  async publishLayer(projectModel: ProjectModel, table: string): Promise<any> {
    const orgId = this.storageService.getOrgId();
    const workspaceName = projectModel.crgProject.workspaceName;
    const storeName = 'database_' + orgId + '_store';
    const geoserverWorkspaceUrl = await this.serverProp.geoServerUrl + '/rest/workspaces';

    return this.httpq.post(
      geoserverWorkspaceUrl + '/' + workspaceName + '/datastores/' + storeName + '/featuretypes',
      {featureType: {name: table}});
  }

  /**
   * Публикация слоев рабочего импорта.
   * @param workImport -
   */
  publishLayers(workImport: WorkImport): Observable<any> {
    const tasks: Promise<any>[] = [];
    workImport.tasks.forEach((task: TaskImport) => {
      tasks.push(this.publishLayer(workImport.projectModel, task.workTableName));
    });

    return forkJoin(tasks);
  }
}
