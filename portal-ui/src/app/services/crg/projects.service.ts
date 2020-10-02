import { reaction } from 'mobx';

import { services } from '../services';
import { wsService } from '../ws.service';
import { TaskImport } from '../geoserver/import/taskImport';
import { serverProperties } from '../server-properties.service';
import { CrgLayer, CrgLayersGroup, CrgProject } from './projects.models';
import { currentProject } from '../../stores/CurrentProject.store';
import { projectsList } from '../../stores/ProjectsList.store';
import { isReadAllowed } from './permissions.service';
import { Toast } from '../../components/Toast/Toast';
import { CrgApiResponse, Process } from './models';
import { route } from '../../stores/Route.store';
import { http } from '../http.service';

class ProjectsService {
  private static _instance: ProjectsService;
  private fetchingCurrentProject?: Promise<CrgProject | void>;

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
      id = Number(route.params.projectId);
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

    if (!project) {
      this.clearCurrent();

      return;
    }

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

  async testCurrentProjectLayers() {
    const testingProjectId = currentProject.id;

    for (let layer of currentProject.layers) {
      // если пользователь успел убежать из проекта, пока мы слои щупали
      if (currentProject.id !== testingProjectId) {
        break;
      }

      const url = new URL(await serverProperties.wmsUrl);

      url.searchParams.set('SERVICE', 'WMS');
      url.searchParams.set('VERSION', '1.3.0');
      url.searchParams.set('REQUEST', 'GetMap');
      url.searchParams.set('FORMAT', 'image/vnd.jpeg-png8');
      url.searchParams.set('TRANSPARENT', 'true');
      url.searchParams.set('LAYERS', layer.complexName);
      url.searchParams.set('CRS', 'EPSG:3857');
      url.searchParams.set('STYLES', '');
      url.searchParams.set('WIDTH', '300');
      url.searchParams.set('HEIGHT', '300');
      url.searchParams.set('BBOX', '3778140.58549765,5300522.190056069,3778162.97915828,5300544.5837167');

      const result = await http.get<string>(url.toString());

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(result, 'text/xml');
      const errors = Array.from(xmlDoc.querySelectorAll('ServiceException')).map(
        n => `Ошибка получения данных с сервера: ${n.innerHTML.trim()}`
      );

      if (errors.length) {
        currentProject.setLayerError(layer.complexName, errors);
        services.logger.error(errors);
      }
    }
  }

  async create(name: string): Promise<CrgProject> {
    const url = await serverProperties.projectsUrl;

    const payload = {
      projectName: name
    };

    return http.post<CrgProject>(url, payload);
  }

  async delete(id: number) {
    const url = `${await serverProperties.projectsUrl}/${id}`;
    await http.delete(url);
    projectsList.delete(id);
  }

  /**
   * Для выполнения импорта передаем на бекенд geoserverName(то имя под которым создан workspace на геосервере,
   * то имя под которым создана схема в БД) проекта в который хотим импортировать.
   * Организация, а соответственно и название БД есть на сервере.
   */
  async doWorkImport(tasks: TaskImport[], projectId: number, workspaceName: string): Promise<Process> {
    const url = `${await serverProperties.apiUrl}/${projectId}/import`;
    const payload = {
      wsUiId: wsService.getId(),
      targetSchema: workspaceName,
      importTasks: tasks
    };

    return http.post<Process>(url, payload);
  }

  private async getById(id: number): Promise<CrgProject | void> {
    try {
      const url = `${await serverProperties.projectsUrl}/${id}`;

      return await http.get<CrgProject>(url);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        Toast.warn('Не найден проект id: ' + id);
      } else {
        throw e;
      }
    }
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
