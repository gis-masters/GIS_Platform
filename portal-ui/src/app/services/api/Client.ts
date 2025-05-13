import { environment } from '../environment';

export abstract class Client {
  protected getBaseUrl(): string {
    const { host, path, port, protocol } = environment.server;

    return `${protocol}//${host}${port && ':'}${port}${path}`;
  }

  protected getDataUrl(): string {
    return this.getBaseUrl() + '/api/data';
  }

  protected getProjectsUrl(): string {
    return this.getBaseUrl() + '/projects';
  }

  protected getProjectUrl(projectId: number): string {
    return `${this.getProjectsUrl()}/${projectId}`;
  }

  protected getProjectMoveUrl(currentProjId: number, targetProjId: number): string {
    return `${this.getProjectUrl(currentProjId)}/move/${targetProjId}`;
  }
}
