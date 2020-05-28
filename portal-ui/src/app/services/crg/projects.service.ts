import { reaction } from 'mobx';
import { HttpParams } from '@angular/common/http';

import { getRoute } from '../services';
import { TaskImport } from '../geoserver/import/taskImport';
import { wsService } from '../ws.service';
import { serverProperties } from '../server-properties.service';
import { CrgApiResponse, Process } from './models';
import { projectsList } from '../../stores/ProjectsList.store';
import { Project } from './projects.models';
import { currentProject } from '../../stores/CurrentProject.store';
import { route } from '../../stores/Route.store';
import { services } from '../services';

class ProjectsService {
  private static _instance: ProjectsService;
  private fetchingCurrentProject?: Promise<Project>;

  private constructor () {
    reaction(() => route.params && route.params.projectId, async (id) => {
      this.fetchCurrent(Number(id));
    });
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  async fetchProjects() {
    await services.provided;
    const baseUrl = await serverProperties.geoServerUrl;
    const url = await serverProperties.projectsUrl;
    const params = new HttpParams().set('size', '1000');

    const response = await services.httpq.get<CrgApiResponse>(url, { params });

    if (response && response._embedded) {
      response._embedded.projects.forEach(async (project: Project) => await this.handleLayers(project, baseUrl));

      projectsList.setList(response._embedded.projects);
    } else {
      projectsList.setList([]);
    }
  }

  async getById(id: number): Promise<Project> {
    await services.provided;
    const baseUrl = await serverProperties.geoServerUrl;
    const url = `${await serverProperties.projectsUrl}/${id}`;
    const project = await services.httpq.get<Project>(url);

    this.handleLayers(project, baseUrl);

    return project;
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

  private handleLayers(project: Project, baseUrl: string) {
    project.layers.forEach(layer => {
      layer.complexName = project.internalName + ':' + layer.internalName;
      layer.href = baseUrl + '/rest/layers/' + layer.complexName;
    });
  }
}

export const projectsService = ProjectsService.instance;
