import { reaction } from 'mobx';
import { AxiosError } from 'axios';
import { debounce, DebouncedFunc } from 'lodash';

import { Toast } from '../../../components/Toast/Toast';
import { allProjects } from '../../../stores/AllProjects.store';
import { currentProject } from '../../../stores/CurrentProject.store';
import { mapStore } from '../../../stores/Map.store';
import { route } from '../../../stores/Route.store';
import { usersService } from '../../auth/users/users.service';
import { communicationService } from '../../communication.service';
import { isArrayOfProjections } from '../../data/projections/projections.models';
import { getProjectionByCode, registerProjectionArrayInProj4 } from '../../data/projections/projections.service';
import { testLayerByWms } from '../../geoserver/wms/wms.service';
import { PageOptions } from '../../models';
import { isLayerReadAllowed } from '../../permissions/permissions.service';
import { services } from '../../services';
import { sleep } from '../../util/sleep';
import { CrgLayer, CrgLayersGroup } from '../layers/layers.models';
import { getLayers } from '../layers/layers.service';
import { projectsClient } from './projects.client';
import { CrgProject } from './projects.models';

class ProjectsService {
  private static _instance: ProjectsService;

  private fetchingCurrentProject?: Promise<CrgProject | void>;
  private fetchingAllProjectsRequest?: Promise<CrgProject[]>;

  private readonly debouncedFetchAllProjects: DebouncedFunc<() => Promise<void>>;

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

    communicationService.projectUpdated.on(async () => {
      await this.debouncedFetchAllProjects();
    });

    // при выделении фичи включать её слой
    reaction(
      () => Object.keys(mapStore.selectedFeaturesByTableName),
      tableNames => {
        this.enableLayersByTableNames(tableNames);
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

  async getAllProjects(): Promise<CrgProject[]> {
    return await projectsClient.getAllProjects();
  }

  private async fetchAllProjects() {
    const request = projectsClient.getAllProjects();

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
    const layers = await getLayers(project.id);
    const layersErrors: Record<string, string[]> = {};
    const layersPermissions = await Promise.all(layers.map(async layer => await isLayerReadAllowed(layer)));
    const allowedLayers = layers.filter((layer, i) => layersPermissions[i]);
    const groups = await this.getGroups(project.id);

    await this.registerLayersProjection(allowedLayers);

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

  async testCurrentProjectLayers() {
    const testingProjectId = currentProject.id;

    for (const layer of currentProject.layers) {
      // если пользователь успел убежать из проекта, пока мы слои щупали
      if (currentProject.id !== testingProjectId) {
        break;
      }

      const result = await testLayerByWms(layer);
      if (result?.errors?.length && layer.complexName) {
        currentProject.setLayerError(layer.complexName, result.errors);
        services.logger.error(result.errors);
      }
    }
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

  async create(name: string): Promise<CrgProject> {
    const result = await projectsClient.createProject(name);
    communicationService.projectUpdated.emit({ type: 'create', data: result });

    return result;
  }

  async getProjects(pageOptions: PageOptions): Promise<[CrgProject[], number]> {
    const response = await projectsClient.getProjects(pageOptions);

    return [response.content || [], response.page.totalPages];
  }

  async getProjectsWithParticularOne(
    id: string | number,
    pageOptions: PageOptions
  ): Promise<[CrgProject[], number, number] | undefined> {
    return await projectsClient.getProjectsWithParticularOne(id, pageOptions);
  }

  async update(project: CrgProject, patch: Partial<CrgProject>) {
    await projectsClient.updateProject(project.id, patch);
    if (allProjects.inited) {
      allProjects.update(project.id, patch);
    }
    communicationService.projectUpdated.emit({ type: 'update', data: { ...project, ...patch } });
  }

  async delete(id: number) {
    await projectsClient.deleteProject(id);
    allProjects.delete(id);
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

  async getById(id: number): Promise<CrgProject | undefined> {
    try {
      return await projectsClient.getProject(id);
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

  enableLayersByTableNames(tableNames: string[]) {
    currentProject.layers?.forEach(layer => {
      if (layer.tableName && tableNames.includes(layer.tableName)) {
        currentProject.patchLayer(layer.id, { enabled: true });
        this.enableGroupAndAncestors(layer.parentId);
      }
    });
  }
}

export const projectsService = ProjectsService.instance;
