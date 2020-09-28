import { reaction } from 'mobx';

import { TaskImport } from '../geoserver/import/taskImport';
import { getRoute, services } from '../services';
import { wsService } from '../ws.service';
import { serverProperties } from '../server-properties.service';
import { CrgApiResponse, Process } from './models';
import { CrgLayer, CrgLayersGroup, CrgLayerType, CrgProject, CrgSource } from './projects.models';
import { projectsList } from '../../stores/ProjectsList.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { isReadAllowed } from './permissions.service';
import { route } from '../../stores/Route.store';
import { http } from '../http.service';

class ProjectsService {
  private static _instance: ProjectsService;
  private fetchingCurrentProject?: Promise<CrgProject>;

  private constructor() {
    reaction(
      () => route.params && route.params.projectId,
      async id => {
        await this.fetchCurrent(Number(id));
      }
    );
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async fetchProjects() {
    await services.provided;
    const url = await serverProperties.projectsUrl;
    const params = { size: '1000' };

    const response = await http.get<CrgApiResponse<{ projects: CrgProject[] }>>(url, { params });

    if (response && response._embedded) {
      projectsList.setList(response._embedded.projects);
    } else {
      projectsList.setList([]);
    }
  }

  clearCurrent() {
    currentProject.dropProject();
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
      currentProject.setProject(
        project,
        await this.getProjectLayers(project.id),
        await this.getProjectGroups(project.id)
      );
    } else {
      delete this.fetchingCurrentProject;
      await this.fetchCurrent(id);
    }
  }

  async create(name: string): Promise<Process> {
    await services.provided;
    const url = await serverProperties.projectsUrl;

    const payload = {
      projectName: name
    };

    return http.post<Process>(url, payload);
  }

  async delete(id: number) {
    await services.provided;
    const url = `${await serverProperties.projectsUrl}/${id}`;
    await http.delete(url);
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

    return http.post<Process>(url, payload);
  }

  private async getById(id: number): Promise<CrgProject> {
    await services.provided;
    const url = `${await serverProperties.projectsUrl}/${id}`;
    const project = await http.get<CrgProject>(url);

    return project;
  }

  async getProjectLayers(projectId: number): Promise<CrgLayer[]> {
    const layers = await http.get<CrgLayer[]>(`${await serverProperties.projectsUrl}/${projectId}/layers`);
    const layersPermissions = await Promise.all(layers.map(isReadAllowed));

    return layers.filter((layer, i) => layersPermissions[i]);
  }

  async getProjectGroups(projectId: number): Promise<CrgLayersGroup[]> {
    return await http.get<CrgLayersGroup[]>(`${await serverProperties.projectsUrl}/${projectId}/groups`);
  }
}

export const projectsService = ProjectsService.instance;
