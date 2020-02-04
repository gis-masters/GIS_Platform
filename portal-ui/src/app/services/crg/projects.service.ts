import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';

import {getRoute} from '../services';
import {TaskImport} from '../geoserver/import/taskImport';
import {WsService} from '../ws.service';
import {LayersService} from '../geoserver/layers.service';
import {LocalStorageService} from '../local-storage.service';
import {serverProperties} from '../server-properties.service';
import {CrgApiResponse, Process} from './models';
import {HttpQueue} from '../util/HttpQueue';
import {Project, projectsList} from '../../stores/ProjectsList.store';
import {defineGeomType} from '../util/stringUtil';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private currentProject?: Promise<Project>;

  constructor(private httpq: HttpQueue,
              private logger: NGXLogger,
              private wsService: WsService,
              private layerService: LayersService,
              private storageService: LocalStorageService) { }

  async fetchProjects() {
    const baseUrl = await serverProperties.geoServerUrl;
    const url = await serverProperties.projectsUrl;

    const response = await this.httpq.get<CrgApiResponse>(url);

    if (response._embedded) {
      response._embedded.projects.forEach(project => this.handleLayers(project, baseUrl));

      projectsList.setList(response._embedded.projects);
    } else {
      projectsList.setList([]);
    }
  }

  async getById(id: string): Promise<Project> {
    const baseUrl = await serverProperties.geoServerUrl;
    const url = `${await serverProperties.projectsUrl}/${id}`;

    return this.httpq.get<Project>(url).then(project => {
      this.handleLayers(project, baseUrl);

      return project;
    });
  }

  clearCurrent() {
    delete this.currentProject;
  }

  async getCurrent(route?: ActivatedRouteSnapshot): Promise<Project> {
    route = route || getRoute().snapshot;
    const projectId = route.params.projectId;

    if (this.currentProject) {
      const project = await this.currentProject;
      if (String(project.id) === projectId) {
        return project;
      }
    }

    this.currentProject = this.getById(projectId);

    return this.currentProject;
  }

  async create(name: string): Promise<Process> {
    const url = await serverProperties.projectsUrl;

    const payload = {
      'projectName': name
    };

    return this.httpq.post<Process>(url, payload);
  }

  async delete(id: string) {
    const url = `${await serverProperties.projectsUrl}/${id}`;
    await this.httpq.delete(url);
    projectsList.considerDeleted(id);
  }

  /**
   * Для выполнения импорта передаем на бекенд geoserverName(то имя под которым создан workspace на геосервере,
   * то имя под которым создана схема в БД) проекта в который хотим импортировать.
   * Организация, а соответственно и название БД есть на сервере.
   */
  async doWorkImport(tasks: TaskImport[], projectId: string, workspaceName: string): Promise<Process> {
    const url = `${await serverProperties.apiUrl}/${projectId}/import`;
    const payload = {
      wsUiId: this.wsService.getId(),
      targetSchema: workspaceName,
      importTasks: tasks
    };

    return this.httpq.post<Process>(url, payload);
  }

  changeProject() {
    this.storageService.clearProject();
  }

  private handleLayers(project: Project, baseUrl) {
    project.layers.forEach(layer => {
      layer.complexName = project.internalName + ':' + layer.internalName;
      layer.href = baseUrl + '/rest/layers/' + layer.complexName;
      layer.geometry = defineGeomType(layer.internalName);
    });

    project.layers.sort((a, b) => a.position - b.position);
  }

}
