import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { CrgProject } from '../projects/projects.models';
import { ProjectBasemap } from './project-basemaps.models';

@boundClass
class ProjectBasemapClient extends Client {
  private static _instance: ProjectBasemapClient;
  static get instance(): ProjectBasemapClient {
    return this._instance || (this._instance = new this());
  }

  private getProjectBasemapsUrl(projectId: number): string {
    return `${this.getProjectUrl(projectId)}/basemaps`;
  }

  private getBasemapConnectionsUrl(sourceBasemapId: number): string {
    return `${this.getProjectsUrl()}/find-related-by-basemap/${sourceBasemapId}`;
  }

  getProjectBasemaps(projectId: number): Promise<ProjectBasemap[]> {
    return http.get<ProjectBasemap[]>(this.getProjectBasemapsUrl(projectId));
  }

  connectBasemapToProject(projectId: number, basemapId: number, title: string) {
    return http.post(this.getProjectBasemapsUrl(projectId), {
      baseMapId: basemapId,
      title
    });
  }

  getBasemapConnections(basemapId: number) {
    return http.get<CrgProject[]>(this.getBasemapConnectionsUrl(basemapId));
  }
}

export const projectBasemapClient = ProjectBasemapClient.instance;
