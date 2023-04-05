import { reaction } from 'mobx';
import { debounce } from 'lodash';
import { AxiosError } from 'axios';

import { route } from '../../../stores/Route.store';
import { mapStore } from '../../../stores/Map.store';
import { allProjects } from '../../../stores/AllProjects.store';
import { currentProject } from '../../../stores/CurrentProject.store';
import { isReadAllowed } from '../../data/permissions/permissions.service';
import { communicationService } from '../../communication.service';
import { CrgLayer, CrgLayersGroup } from '../layers/layers.models';
import { usersService } from '../../auth/users/users.service';
import { testLayerByWms } from '../../geoserver/wms.service';
import { PageOptions } from '../../models';
import { services } from '../../services';
import { sleep } from '../../util/sleep';
import { Toast } from '../../../components/Toast/Toast';

import { CrgProject } from './projects.models';
import {
  _reqCreateProject,
  _reqCreateGroup,
  _reqDeleteGroup,
  _reqDeleteProject,
  _reqGetAllProjects,
  _reqGetProject,
  _reqGetProjectGroups,
  _reqGetProjectLayers,
  _reqGetProjects,
  _reqGetProjectsWithParticularOne,
  _reqUpdateGroup,
  _reqUpdateProject
} from './projects.client';

class ProjectsService {
  private static _instance: ProjectsService;

  private fetchingCurrentProject?: Promise<CrgProject | void>;
  private fetchingAllProjectsRequest?: Promise<CrgProject[]>;

  private readonly debouncedFetchAllProjects: () => Promise<void>;

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

  async getAllProjects(): Promise<CrgProject[]> {
    return await _reqGetAllProjects();
  }

  private async fetchAllProjects() {
    const request = _reqGetAllProjects();

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
    const layersPermissions = await Promise.all(layers.map(async layer => await isReadAllowed(layer)));

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

      const { errors } = await testLayerByWms(layer);

      if (errors?.length) {
        currentProject.setLayerError(layer.complexName, errors);
        services.logger.error(errors);
      }
    }
  }

  async create(name: string): Promise<CrgProject> {
    const result = await _reqCreateProject(name);
    communicationService.projectUpdated.emit({ type: 'create', data: result });

    return result;
  }

  async getProjects(pageOptions: PageOptions): Promise<[CrgProject[], number]> {
    const response = await _reqGetProjects(pageOptions);

    return [response._embedded?.projects || [], response.page.totalPages];
  }

  async getProjectsWithParticularOne(
    id: string | number,
    pageOptions: PageOptions
  ): Promise<[CrgProject[], number, number] | undefined> {
    return await _reqGetProjectsWithParticularOne(id, pageOptions);
  }

  async update(project: CrgProject, patch: Partial<CrgProject>) {
    await _reqUpdateProject(project.id, patch);
    if (allProjects.inited) {
      allProjects.update(project.id, patch);
    }
    communicationService.projectUpdated.emit({ type: 'update', data: { ...project, ...patch } });
  }

  async delete(id: number) {
    await _reqDeleteProject(id);
    allProjects.delete(id);
  }

  async getLayers(projectId: number): Promise<CrgLayer[]> {
    return await _reqGetProjectLayers(projectId);
  }

  async getGroups(projectId: number): Promise<CrgLayersGroup[]> {
    return await _reqGetProjectGroups(projectId);
  }

  async createGroup(group: CrgLayersGroup, projectId: number): Promise<CrgLayersGroup> {
    return await _reqCreateGroup(group, projectId);
  }

  async updateGroup(
    groupId: number,
    patch: Partial<CrgLayersGroup>,
    project: CrgProject = currentProject
  ): Promise<void> {
    return await _reqUpdateGroup(groupId, patch, project.id);
  }

  async deleteGroup(groupId: number, project: CrgProject = currentProject): Promise<void> {
    return await _reqDeleteGroup(groupId, project.id);
  }

  generateNextGroupId(): number {
    return Math.max(...currentProject.groups.map(({ id }) => id), 0) + 1;
  }

  async getById(id: number): Promise<CrgProject> {
    try {
      return await _reqGetProject(id);
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

// for autotests
if (typeof window !== 'undefined') {
  Object.assign(window, { projectsService });
}
