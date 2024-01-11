import { boundClass } from 'autobind-decorator';

import { GisClient } from '../GisClient';
import { PageOptions } from '../../models';
import { http } from '../../api/http.service';
import { preparePageOptions } from '../../api/http.utils';
import { CrgLayer, CrgLayersGroup } from '../layers/layers.models';

import { CrgProject } from './projects.models';
import { PageableResources } from '../../../../server-types/common-contracts';

@boundClass
class ProjectsClient extends GisClient {
  private static _instance: ProjectsClient;

  static get instance(): ProjectsClient {
    return this._instance || (this._instance = new this());
  }

  private getProjectGroupsUrl(projectId: number): string {
    return this.getProjectUrl(projectId) + '/groups';
  }

  private getProjectGroupUrl(projectId: number, groupId: number): string {
    return `${this.getProjectGroupsUrl(projectId)}/${groupId}`;
  }

  async getProject(id: number): Promise<CrgProject> {
    return http.get<CrgProject>(this.getProjectUrl(id));
  }

  async getProjects(pageOptions: PageOptions): Promise<PageableResources<CrgProject>> {
    return http.get<PageableResources<CrgProject>>(this.getProjectsUrl(), {
      params: preparePageOptions(pageOptions)
    });
  }

  async getProjectsWithParticularOne(
    id: string | number,
    pageOptions: PageOptions
  ): Promise<[CrgProject[], number, number] | undefined> {
    return await http.getPageWithObject<CrgProject>(
      this.getProjectsUrl(),
      preparePageOptions(pageOptions),
      (item: CrgProject) => item.id === Number(id),
      {}
    );
  }

  async getAllProjects(): Promise<CrgProject[]> {
    return http.getPaged<CrgProject>(this.getProjectsUrl(), { cache: { disabled: true } });
  }

  async createProject(projectName: string): Promise<CrgProject> {
    return http.post<CrgProject>(this.getProjectsUrl(), { projectName });
  }

  async updateProject(id: number, patch: Partial<CrgProject>): Promise<void> {
    return http.patch(this.getProjectUrl(id), patch);
  }

  async deleteProject(id: number): Promise<void> {
    return http.delete(this.getProjectUrl(id));
  }

  async getProjectLayers(projectId: number): Promise<CrgLayer[]> {
    return http.get<CrgLayer[]>(this.getProjectLayersUrl(projectId));
  }

  async getProjectGroups(projectId: number): Promise<CrgLayersGroup[]> {
    return http.get<CrgLayersGroup[]>(this.getProjectGroupsUrl(projectId));
  }

  async createGroup(group: Omit<CrgLayersGroup, 'id'>, projectId: number): Promise<CrgLayersGroup> {
    return http.post<CrgLayersGroup>(this.getProjectGroupsUrl(projectId), group);
  }

  async updateGroup(groupId: number, patch: Partial<CrgLayersGroup>, projectId: number): Promise<void> {
    return http.patch(this.getProjectGroupUrl(projectId, groupId), patch);
  }

  async deleteGroup(groupId: number, projectId: number): Promise<void> {
    return http.delete(this.getProjectGroupUrl(projectId, groupId));
  }
}

export const projectsClient = ProjectsClient.instance;
