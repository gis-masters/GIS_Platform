import { reaction } from 'mobx';
import { type AxiosError } from 'axios';
import { debounce, type DebouncedFunc } from 'lodash';

import { Toast } from '../../../components/Toast/Toast';
import { allProjects } from '../../../stores/AllProjects.store';
import { currentProject } from '../../../stores/CurrentProject.store';
import { route } from '../../../stores/Route.store';
import { usersService } from '../../auth/users/users.service';
import { communicationService } from '../../communication.service';
import { isArrayOfProjections } from '../../data/projections/projections.models';
import { getProjectionByCode, registerProjectionArrayInProj4 } from '../../data/projections/projections.service';
import { schemaService } from '../../data/schema/schema.service';
import { testLayerByWms } from '../../geoserver/wms/wms.service';
import { selectedFeaturesStore } from '../../map/a-map-mode/selected-features/SelectedFeatures.store';
import { type PageOptions } from '../../models';
import { isLayerReadAllowed } from '../../permissions/permissions.service';
import { services } from '../../services';
import { sleep } from '../../util/sleep';
import { type CrgLayer, type CrgLayersGroup } from '../layers/layers.models';
import { getLayers } from '../layers/layers.service';
import { projectsClient } from './projects.client';
import { type CrgProject, type NewCrgProject } from './projects.models';

class ProjectsService {
  private static _instance: ProjectsService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private fetchingCurrentProject?: Promise<CrgProject | void>;
  private fetchingAllProjectsRequest?: Promise<CrgProject[]>;

  private readonly debouncedFetchAllProjects: DebouncedFunc<() => Promise<void>>;

  private constructor() {
    this.debouncedFetchAllProjects = debounce(this.fetchAllProjects, 300);

    communicationService.projectUpdated.on(async () => {
      await this.debouncedFetchAllProjects();
    });

    // при выделении фичи включать её слой
    reaction(
      () => Object.keys(selectedFeaturesStore.featuresByResourceId),
      tableNames => {
        this.enableLayersByResourceId(tableNames);
      },
      { fireImmediately: true }
    );
  }

  /**
   * Рекурсивно получает все проекты включая вложенные в папки
   */
  private async getAllProjectsRecursively(parentId?: number): Promise<CrgProject[]> {
    const projects = parentId
      ? await projectsClient.getAllProjectsInFolder(parentId)
      : await projectsClient.getAllProjects();

    // Рекурсивно получаем проекты из папок
    const folders = projects.filter(p => p.folder);
    const nestedProjects = await Promise.all(folders.map(folder => this.getAllProjectsRecursively(folder.id)));

    return [...nestedProjects.flat(), ...projects];
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
    const request = this.getAllProjectsRecursively();

    this.fetchingAllProjectsRequest = request;

    const response = await this.fetchingAllProjectsRequest;

    if (this.fetchingAllProjectsRequest !== request) {
      return;
    }

    delete this.fetchingAllProjectsRequest;

    allProjects.setList(response);
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
    const layers = await getLayers(project.id);
    const layersErrors: Record<string, string[]> = {};
    const layersPermissions = await Promise.all(layers.map(async layer => await isLayerReadAllowed(layer)));
    const allowedLayers = layers.filter((layer, i) => layersPermissions[i]);
    const groups = await this.getGroups(project.id);

    await this.registerLayersProjection(allowedLayers);

    const tableIdentifiers = allowedLayers
      .map(layer => layer.resourceId)
      .filter((tableName): tableName is string => tableName !== undefined);
    await schemaService.fetchAndCacheTablesSchemas(tableIdentifiers);

    currentProject.setProject(project, allowedLayers, groups, layersErrors, layers);

    if (project.id !== id) {
      delete this.fetchingCurrentProject;
      await this.fetchCurrent(id);
    }
  }

  enableGroupAndAncestors(groupId?: number) {
    if (groupId) {
      const group = currentProject.patchGroup(groupId, { enabled: true });

      if (group.parentId) {
        this.enableGroupAndAncestors(group.parentId);
      }
    }
  }

  /**
   * Тестируем слой, "дергая" его по WMS в заранее определенной небольшой области.
   *
   * Целью проверки является заблаговременное распознавание "битых" по разным причинам слоёв на геосервере.
   * Частые причины отсутствия слоя — отсутствие данных, на которые слой ссылается, будь то файл или источник в БД.
   *
   * По результатам проверки слой будет помечен сломанным в текущем проекте в currentProject.layersErrors
   *
   * @param layer Тестируемый слой
   */
  async checkLayerHealthy(layer: CrgLayer): Promise<boolean> {
    const result = await testLayerByWms(layer);
    if (result?.errors?.length && layer.complexName) {
      currentProject.setLayerError(layer.complexName, result.errors);
      services.logger.error(result.errors);

      return false;
    }

    return true;
  }

  async registerLayersProjection(allowedLayers: CrgLayer[]) {
    const projections = await Promise.all(
      allowedLayers.map(async layer => {
        if (layer.nativeCRS) {
          return await getProjectionByCode(layer.nativeCRS);
        }
      })
    );

    const uniqueProjection = projections
      .filter((value, index, self) => index === self.findIndex(item => item?.authSrid === value?.authSrid))
      .filter(Boolean);

    if (uniqueProjection.length && isArrayOfProjections(uniqueProjection)) {
      registerProjectionArrayInProj4(uniqueProjection);
    }
  }

  async create(project: NewCrgProject): Promise<CrgProject> {
    const result = await projectsClient.createProject(project);
    communicationService.projectUpdated.emit({ type: 'create', data: result });

    allProjects.add(result);

    return result;
  }

  async getProjects(pageOptions: PageOptions): Promise<[CrgProject[], number]> {
    const response = await projectsClient.getProjects(pageOptions);

    return [response.content || [], response.page.totalPages];
  }

  async getAllProjects(): Promise<CrgProject[]> {
    return await projectsClient.getAllProjects();
  }

  async getProjectsWithParticularOne(
    id: string | number,
    pageOptions: PageOptions
  ): Promise<[CrgProject[], number, number] | undefined> {
    return await projectsClient.getProjectsWithParticularOne(id, pageOptions);
  }

  async update(project: CrgProject, patch: Partial<CrgProject>) {
    await projectsClient.updateProject(project.id, patch);
    communicationService.projectUpdated.emit({ type: 'update', data: { ...project, ...patch } });
    allProjects.update(project.id, patch);
  }

  async move(project: CrgProject, targetProjId: number) {
    await projectsClient.moveProject(project.id, targetProjId);
    communicationService.projectUpdated.emit({ type: 'delete', data: project });
    allProjects.update(project.id, { parentId: targetProjId });
  }

  async delete(id: number) {
    await projectsClient.deleteProject(id);
    const project = allProjects.getById(id);
    if (project) {
      communicationService.projectUpdated.emit({ type: 'delete', data: project });
      allProjects.delete(id);
    }
  }

  async getGroups(projectId: number): Promise<CrgLayersGroup[]> {
    return await projectsClient.getProjectGroups(projectId);
  }

  async createGroup(group: Omit<CrgLayersGroup, 'id'>, projectId: number): Promise<CrgLayersGroup> {
    return await projectsClient.createGroup(group, projectId);
  }

  async updateGroup(
    groupId: number,
    patch: Partial<CrgLayersGroup>,
    project: CrgProject = currentProject
  ): Promise<void> {
    return await projectsClient.updateGroup(groupId, patch, project.id);
  }

  async deleteGroup(groupId: number, project: CrgProject = currentProject): Promise<void> {
    return await projectsClient.deleteGroup(groupId, project.id);
  }

  generateNextGroupId(): number {
    return Math.max(...currentProject.groups.map(({ id }) => id), 0) + 1;
  }

  async getById(id: number): Promise<CrgProject> {
    try {
      return await projectsClient.getProject(id);
    } catch {
      throw new Error(`Проект ${id} не найден`);
    }
  }

  async getAllProjectsInFolder(id: number): Promise<CrgProject[] | undefined> {
    try {
      return await projectsClient.getAllProjectsInFolder(id);
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

  enableLayersByResourceId(resourceIds: string[]) {
    currentProject.layers?.forEach(layer => {
      if (layer.resourceId && resourceIds.includes(layer.resourceId)) {
        currentProject.patchLayer(layer.id, { enabled: true });
        this.enableGroupAndAncestors(layer.parentId);
      }
    });
  }
}

export const projectsService = ProjectsService.instance;
