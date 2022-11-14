import { reaction } from 'mobx';
import { debounce } from 'lodash';
import { AxiosError } from 'axios';

import { route } from '../../stores/Route.store';
import { currentUser } from '../../stores/CurrentUser.store';
import { allProjects } from '../../stores/AllProjects.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { CrgLayer, CrgLayersGroup, CrgLayerType, CrgProject } from './projects.models';
import { PageableResponse, PageOptions, Process } from '../models';
import { isRasterReadAllowed, isFeaturesReadAllowed } from '../data/permissions.service';
import { TaskImport } from '../geoserver/import/taskImport';
import { wsService } from '../ws.service';
import { services } from '../services';
import { http } from '../http.service';
import { sleep } from '../util/sleep';
import {
  getApiImportUrl,
  getProjectGroupsUrl,
  getProjectGroupUrl,
  getProjectLayersUrl,
  getProjectsUrl,
  getProjectUrl,
  getWmsUrl
} from '../server-urls.service';
import { Toast } from '../../components/Toast/Toast';
import { communicationService } from '../communication.service';
import { preparePageOptions } from '../http.utils';
import { usersService } from '../data/users.service';
import { Mime } from '../util/Mime';
import { mapStore } from '../../stores/Map.store';

class ProjectsService {
  private static _instance: ProjectsService;
  private fetchingCurrentProject?: Promise<CrgProject | void>;
  private fetchingAllProjectsRequest?: Promise<CrgProject[]>;
  private debouncedFetchAllProjects: () => Promise<void>;

  private constructor() {
    this.debouncedFetchAllProjects = debounce(this.fetchAllProjects, 300);

    reaction(
      () => route.params?.projectId,
      async id => {
        if (id) {
          await this.fetchCurrent(Number(id));
        }
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

    // при выделении фичи включать её слой
    reaction(
      () => Object.keys(mapStore.selectedFeaturesByTableName),
      tableNames => {
        currentProject.layers?.forEach(layer => {
          if (tableNames.includes(layer.tableName)) {
            currentProject.patchLayer(layer.id, { enabled: true });
            this.enableGroupAndAncestors(layer.parentId);
          }
        });
      },
      { fireImmediately: true }
    );
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
    const request = http.getPagedOld<CrgProject>(url, { cache: { disabled: true } });

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
      id = Number(route.params?.projectId);
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

    await usersService.fetchCurrentUser();
    const layers = await this.getLayers(project.id);
    const layersErrors: Record<string, string[]> = {};
    const layersPermissions = await Promise.all(
      layers.map(async layer => {
        if (currentUser.isAdmin || layer.type === CrgLayerType.EXTERNAL) {
          return true;
        }

        if (layer.type === CrgLayerType.VECTOR) {
          return await isFeaturesReadAllowed(layer.dataset, layer.tableName);
        }

        if (layer.type === CrgLayerType.RASTER) {
          return await isRasterReadAllowed(layer.libraryId, layer.recordId);
        }
      })
    );

    const allowedLayers = layers.filter((layer, i) => layersPermissions[i]);
    const groups = await this.getGroups(project.id);

    currentProject.setProject(project, allowedLayers, groups, layersErrors, layers);

    if (project.id !== id) {
      delete this.fetchingCurrentProject;
      await this.fetchCurrent(id);
    }
  }

  enableGroupAndAncestors(groupId: number) {
    if (groupId) {
      const group = currentProject.patchGroup(groupId, { enabled: true });

      if (group.parentId) {
        this.enableGroupAndAncestors(group.parentId);
      }
    }
  }

  async testCurrentProjectLayers() {
    const testingProjectId = currentProject.id;

    for (const layer of currentProject.vectorLayers) {
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
      const xmlDoc = parser.parseFromString(result, Mime.XML);
      const errors = [...xmlDoc.querySelectorAll('ServiceException')].map(
        (n: Element) => `Ошибка получения данных с сервера: ${n.innerHTML.trim()}`
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
    const result = await http.post<CrgProject>(url, payload);

    communicationService.projectsUpdated.emit();

    return result;
  }

  async getProjects(pageOptions: PageOptions): Promise<[CrgProject[], number]> {
    const response = await http.get<PageableResponse<CrgProject>>(await getProjectsUrl(), {
      params: preparePageOptions(pageOptions)
    });

    return [response._embedded?.projects || [], response.page.totalPages];
  }

  async getProjectsWithParticularOne(
    id: string | number,
    pageOptions: PageOptions
  ): Promise<[CrgProject[], number, number] | undefined> {
    return await http.getPageWithObject<CrgProject>(
      await getProjectsUrl(),
      preparePageOptions(pageOptions),
      (item: CrgProject) => item.id === Number(id)
    );
  }

  async update(id: number, patch: Partial<CrgProject>) {
    const url = await getProjectUrl(id);
    await http.patch(url, patch);
    allProjects.update(id, patch);
  }

  async delete(id: number) {
    await http.delete(await getProjectUrl(id));
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

  private async getLayers(projectId: number): Promise<CrgLayer[]> {
    return await http.get<CrgLayer[]>(await getProjectLayersUrl(projectId));
  }

  private async getGroups(projectId: number): Promise<CrgLayersGroup[]> {
    return await http.get<CrgLayersGroup[]>(await getProjectGroupsUrl(projectId));
  }

  async createGroup(group: CrgLayersGroup, projectId: number): Promise<CrgLayersGroup> {
    return await http.post<CrgLayersGroup>(await getProjectGroupsUrl(projectId), group);
  }

  async updateGroup(
    groupId: number,
    patch: Partial<CrgLayersGroup>,
    project: CrgProject = currentProject
  ): Promise<void> {
    return await http.patch(await getProjectGroupUrl(project.id, groupId), patch);
  }

  async deleteGroup(groupId: number, project: CrgProject = currentProject): Promise<void> {
    return await http.delete(await getProjectGroupUrl(project.id, groupId));
  }

  generateNextGroupId(): number {
    return Math.max(...currentProject.groups.map(({ id }) => id), 0) + 1;
  }

  async getById(id: number): Promise<CrgProject> {
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
