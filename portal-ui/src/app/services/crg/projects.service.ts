import { reaction } from 'mobx';
import { HttpParams } from '@angular/common/http';

import { TaskImport } from '../geoserver/import/taskImport';
import { getRoute, services } from '../services';
import { wsService } from '../ws.service';
import { serverProperties } from '../server-properties.service';
import { getSourceInfo } from './data.service';
import { CrgApiResponse, Process } from './models';
import { CrgLayerType, Project } from './projects.models';
import { projectsList } from '../../stores/ProjectsList.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { isReadAllowed } from './permissions.service';
import { route } from '../../stores/Route.store';

class ProjectsService {
  private static _instance: ProjectsService;
  private fetchingCurrentProject?: Promise<Project>;

  private constructor() {
    reaction(() => route.params && route.params.projectId, async (id) => {
      this.fetchCurrent(Number(id));
    });
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async fetchProjects() {
    await services.provided;
    const url = await serverProperties.projectsUrl;
    const params = new HttpParams().set('size', '1000');

    const response = await services.httpq.get<CrgApiResponse<{ projects: Project[] }>>(url, { params });

    if (response && response._embedded) {
      projectsList.setList(response._embedded.projects);
    } else {
      projectsList.setList([]);
    }
  }

  clearCurrent() {
    currentProject.setProject(null);
    delete this.fetchingCurrentProject;
  }

  async fetchCurrent(id?: number) {
    if (!id) {
      id = Number(getRoute().snapshot.params.projectId);
    }

    if (!id) {
      this.clearCurrent();
      return;
    }

    if (currentProject.id === id) {
      return;
    }

    if (!this.fetchingCurrentProject) {
      this.fetchingCurrentProject = this.getById(id);
    }

    const project = await this.fetchingCurrentProject;

    if (project.id === id) {
      currentProject.setProject(project);
    } else {
      delete this.fetchingCurrentProject;
      await this.fetchCurrent(id);
    }
  }

  async create(name: string): Promise<Process> {
    await services.provided;
    const url = await serverProperties.projectsUrl;

    const payload = {
      'projectName': name
    };

    return services.httpq.post<Process>(url, payload);
  }

  async delete(id: number) {
    await services.provided;
    const url = `${await serverProperties.projectsUrl}/${id}`;
    await services.httpq.delete(url);
    projectsList.considerDeleted(id);
  }

  /**
   * Для выполнения импорта передаем на бекенд geoserverName(то имя под которым создан workspace на геосервере,
   * то имя под которым создана схема в БД) проекта в который хотим импортировать.
   * Организация, а соответственно и название БД есть на сервере.
   */
  async doWorkImport(tasks: TaskImport[], projectId: number, workspaceName: string): Promise<Process> {
    await services.provided;
    const url = `${await serverProperties.apiUrl}/${projectId}/import`;
    const payload = {
      wsUiId: wsService.getId(),
      targetSchema: workspaceName,
      importTasks: tasks
    };

    return services.httpq.post<Process>(url, payload);
  }

  private async getById(id: number): Promise<Project> {
    await services.provided;
    const url = `${await serverProperties.projectsUrl}/${id}`;
    const project = await services.httpq.get<Project>(url);

    await this.handleLayers(project);

    return project;
  }

  private async handleLayers(project: Project) {
    await Promise.all(project.layers.map(async layer => {
      if (layer.type === CrgLayerType.VECTOR && layer.dataSourceUri) {
        layer.sourceData = await getSourceInfo(layer.dataSourceUri);
      }
    }));

    const layersPermissions = await Promise.all(project.layers.map(isReadAllowed));

    project.layers = project.layers.filter((layer, i) => layersPermissions[i]);
  }
}

export const projectsService = ProjectsService.instance;
