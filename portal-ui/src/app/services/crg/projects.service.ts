import { reaction } from 'mobx';
import { debounce } from 'lodash';
import { AxiosError } from 'axios';

import { route } from '../../stores/Route.store';
import { allProjects } from '../../stores/AllProjects.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { CrgLayer, CrgLayersGroup, CrgLayerType, CrgProject } from './projects.models';
import { PageableResponse, Process, SortDir } from '../models';
import { isFeaturesReadAllowed } from './permissions.service';
import { TaskImport } from '../geoserver/import/taskImport';
import { wsService } from '../ws.service';
import { services } from '../services';
import { http } from '../http.service';
import { sleep } from '../util/sleep';
import {
  getApiImportUrl,
  getProjectGroupsUrl,
  getProjectLayersUrl,
  getProjectsUrl,
  getProjectUrl,
  getWmsUrl
} from '../server-urls.service';
import { Toast } from '../../components/Toast/Toast';
import { communicationService } from '../communication.service';
import { mapLinkFollowing, MAP_QUERY_PARAMS_DELIMITER } from '../map/map-link-following.service';

class ProjectsService {
  private static _instance: ProjectsService;
  private fetchingCurrentProject?: Promise<CrgProject | void>;
  private fetchingAllProjectsRequest?: Promise<CrgProject[]>;
  private enabledQueryLayers?: boolean;
  private debouncedFetchAllProjects: () => Promise<void>;

  private constructor() {
    this.debouncedFetchAllProjects = debounce(this.fetchAllProjects, 300);

    reaction(
      () => route.params?.projectId as string,
      async id => {
        await this.fetchCurrent(Number(id));
      }
    );

    communicationService.projectsUpdated.on(async () => {
      await this.debouncedFetchAllProjects();
    });

    communicationService.logout.on(() => {
      allProjects.reset();
      delete this.fetchingCurrentProject;
      delete this.fetchingAllProjectsRequest;
    });

    reaction(
      () => route.queryParams?.features as string,
      features => {
        if (features) {
          this.enabledQueryLayers = true;
        }
      }
    );

    communicationService.mapInited.on(isRender => {
      if (isRender) {
        this.enabledQueryLayers = false;
      }
    }, this);
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async initAllProjectsStore() {
    if (this.fetchingAllProjectsRequest) {
      await this.fetchingAllProjectsRequest;
      await sleep(0);

      return;
    }

    if (allProjects.inited) {
      return;
    }
    await this.fetchAllProjects();
  }

  private async fetchAllProjects() {
    const url = await getProjectsUrl();
    const request = http.getPaged<CrgProject>(url);

    this.fetchingAllProjectsRequest = request;

    const response = await this.fetchingAllProjectsRequest;

    if (this.fetchingAllProjectsRequest !== request) {
      return;
    }

    delete this.fetchingAllProjectsRequest;

    allProjects.setList(response);
    communicationService.allProjectsFetched.emit();
  }

  clearCurrent() {
    currentProject.clearProject();
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
    const layersErrors: Record<string, string[]> = {};

    const layersPermissions = await Promise.all(
      layers.map(async ({ dataset, tableName, type, complexName }) => {
        try {
          return type !== CrgLayerType.VECTOR || (await isFeaturesReadAllowed(dataset, tableName));
        } catch {
          const message = `Ошибка получения прав для таблицы ${tableName} в наборе ${dataset}`;
          layersErrors[complexName] = [message];
          Toast.error({ message, suppress: true });

          return true;
        }
      })
    );
    const allowedLayers = layers.filter((layer, i) => layersPermissions[i]);

    if (project.id === id) {
      const queryParams = route.queryParams as { [key: string]: string };

      const groups = await this.getProjectGroups(project.id);
      currentProject.setProject(project, allowedLayers, groups, layersErrors);

      let activeLayers: string[] = [];

      if (this.enabledQueryLayers) {
        if (queryParams.features) {
          activeLayers = [
            ...new Set(
              queryParams.features.split(',').map(feature => {
                return feature.split(MAP_QUERY_PARAMS_DELIMITER)[1];
              })
            )
          ];
        }

        currentProject.layers.forEach(layer => {
          if (activeLayers.includes(layer.complexName)) {
            currentProject.patchLayer(layer.id, { enabled: true });
            this.enableGroupAndAncestors(layer.parentId);
          }
        });
      }
    } else {
      delete this.fetchingCurrentProject;
      await this.fetchCurrent(id);
    }
  }

  enableGroupAndAncestors(groupId: number) {
    const group = currentProject.patchGroup(groupId, { enabled: true });

    if (group.parentId) {
      this.enableGroupAndAncestors(group.parentId);
    }
  }

  async testCurrentProjectLayers() {
    const serverErrors: Record<string, string>[] = [];

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
      const errors = [...xmlDoc.querySelectorAll('ServiceException')].map(
        (n: Element) => `Ошибка получения данных с сервера: ${n.innerHTML.trim()}`
      );

      if (errors.length) {
        serverErrors.push({ schemaId: layer.schemaId, error: errors[0] });
        currentProject.setLayerError(layer.complexName, errors);
        services.logger.error(errors);
      }
    }

    mapLinkFollowing.showLayersServerErrorMessage(serverErrors, 'Ошибка получения данных слоя с сервера');
  }

  async create(name: string): Promise<CrgProject> {
    const url = await getProjectsUrl();
    const payload = { projectName: name };

    return http.post<CrgProject>(url, payload);
  }

  async getProjects(
    page: number,
    pageSize: number,
    sort?: string,
    sortDir?: SortDir,
    filter?: { [key: string]: string }
  ): Promise<[CrgProject[], number]> {
    const response = await http.get<PageableResponse<{ projects: CrgProject[] }>>(await getProjectsUrl(), {
      params: { page, size: pageSize, sort: sort ? `${sort},${sortDir}` : undefined, ...(filter || {}) }
    });

    return [response._embedded?.projects || [], response.page.totalPages];
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
    } catch (error) {
      const err = error as AxiosError<{ status: string; message: string }>;
      const message = err?.response?.data?.message;
      if (message) {
        Toast.warn(message);
      } else {
        throw error;
      }
    }
  }
}

export const projectsService = ProjectsService.instance;
