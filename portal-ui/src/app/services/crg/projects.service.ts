import { reaction } from 'mobx';

import { route } from '../../stores/Route.store';
import { allProjects } from '../../stores/AllProjects.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { CrgLayer, CrgLayersGroup, CrgProject } from './projects.models';
import { isFeaturesReadAllowed } from './permissions.service';
import { TaskImport } from '../geoserver/import/taskImport';
import { PageableResponse, Process } from '../models';
import { wsService } from '../ws.service';
import { services } from '../services';
import { http } from '../http.service';
import {
  getApiImportUrl,
  getProjectGroupsUrl,
  getProjectLayersUrl,
  getProjectsUrl,
  getProjectUrl,
  getWmsUrl
} from '../server-urls.service';
import { Toast } from '../../components/Toast/Toast';

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
    const url = await getProjectsUrl();
    const params = { size: '1000' };
    const response = await http.get<PageableResponse<{ projects: CrgProject[] }>>(url, { params });

    if (response && response._embedded) {
      allProjects.setList(response._embedded.projects);
    } else {
      allProjects.setList([]);
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

    const layers = await this.getProjectLayers(project.id);
    const layersPermissions = await Promise.all(layers.map(isFeaturesReadAllowed));
    const allowedLayers = layers.filter((layer, i) => layersPermissions[i]);

    if (project.id === id) {
      currentProject.setProject(project, allowedLayers, await this.getProjectGroups(project.id));
    } else {
      delete this.fetchingCurrentProject;
      await this.fetchCurrent(id);
    }
  }

  async testCurrentProjectLayers() {
    const testingProjectId = currentProject.id;

    for (const layer of currentProject.layers) {
      // если пользователь успел убежать из проекта, пока мы слои щупали
      if (currentProject.id !== testingProjectId) {
        break;
      }

      const url = new URL(await getWmsUrl());

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
    const url = await getProjectsUrl();
    const payload = { projectName: name };

    return http.post<CrgProject>(url, payload);
  }

  async delete(id: number) {
    const url = await getProjectUrl(id);
    await http.delete(url);
    allProjects.delete(id);
  }

  /**
   * Для выполнения импорта передаем на бекенд geoserverName(то имя под которым создан workspace на геосервере,
   * то имя под которым создана схема в БД) проекта в который хотим импортировать.
   * Организация, а соответственно и название БД есть на сервере.
   */
  async doWorkImport(importTasks: TaskImport[], projectId: number, targetSchema: string): Promise<Process> {
    const url = await getApiImportUrl(projectId);
    const payload = {
      wsUiId: wsService.getId(),
      targetSchema,
      importTasks
    };

    return http.post<Process>(url, payload);
  }

  async getProjectLayers(projectId: number): Promise<CrgLayer[]> {
    return await http.get<CrgLayer[]>(await getProjectLayersUrl(projectId));
  }

  async getProjectGroups(projectId: number): Promise<CrgLayersGroup[]> {
    return await http.get<CrgLayersGroup[]>(await getProjectGroupsUrl(projectId));
  }

  async createDataset(title: string, details: string) {
    const url = `${await getProjectsUrl()}/datasets`;

    await http.post(url, { title, details });
  }

  private async getById(id: number): Promise<CrgProject | void> {
    try {
      return await http.get<CrgProject>(await getProjectUrl(id));
    } catch (e) {
      if (e.response && e.response.status === 404) {
        Toast.warn('Не найден проект id: ' + id);
      } else {
        throw e;
      }
    }
  }
}

export const projectsService = ProjectsService.instance;
