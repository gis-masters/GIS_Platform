import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { catchError, map } from 'rxjs/operators';

import { getRoute } from '../services';
import { TaskImport } from '../geoserver/import/taskImport';
import { WsService } from '../ws.service';
import { LayersService } from '../geoserver/layers.service';
import { NameHrefProjection } from '../geoserver/projections';
import { LocalStorageService } from '../local-storage.service';
import { serverProperties } from '../server-properties.service';
import { CrgApiResponse, Process } from './models';
import { HttpQueue } from '../util/HttpQueue';
import { projectsList, Project } from '../../stores/ProjectsList.store';
import { NGXLogger } from 'ngx-logger';

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
    const url = await serverProperties.projectsUrl;

    const response = await this.httpq.get<CrgApiResponse>(url);
    let projectsWithLayers: Project[] = [];
    if (response._embedded) {
      projectsWithLayers = await this.fetchProjectsLayers(response._embedded.projects);
    }

    projectsList.setList(projectsWithLayers);
  }

  async getById(id: string): Promise<Project> {
    const url = `${await serverProperties.projectsUrl}/${id}`;

    return this.httpq.get<Project>(url);
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
  async doWorkImport(tasks: TaskImport[], internalName: string, workspaceName: string): Promise<Process> {
    const url = `${await serverProperties.apiUrl}/${internalName}/import`;
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

  private async fetchProjectsLayers(projects: Project[]): Promise<Project[]> {
    if (!projects || projects.length === 0) {
      return [];
    }

    return this.layerService
      .getAllLayers()
      .pipe(
        map((layers: NameHrefProjection[]) => {
          projects.forEach((project: Project) => project.layers.length = this.countLayers(project, layers));

          return projects;
        }),
        catchError(err => {
          this.logger.error('Cant get layers from geoserver: ', err);
          return [];
        })
      ).toPromise();
  }

  private countLayers(project: Project, layers: NameHrefProjection[]): number {
    let counter = 0;
    layers.forEach((layer: NameHrefProjection) => {
      const projectName = layer.name.split(':')[0];
      if (projectName) {
        if (project.internalName === projectName) {
          counter++;
        }
      } else {
        this.logger.warn('projects', 'Incorrect layer name');
      }
    });

    return counter;
  }
}
