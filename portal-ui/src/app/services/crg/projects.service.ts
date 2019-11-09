import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, filter, flatMap, map, publishReplay, refCount, takeUntil } from 'rxjs/operators';

import { getRoute } from '../services';
import { TaskImport } from "../geoserver/import/taskImport";
import { WsService } from '../ws.service';
import { FizLogger } from '../logger/fiz.logger';
import { LayersService } from '../geoserver/layers.service';
import { NameHrefProjection } from '../geoserver/projections';
import { LocalStorageService } from '../local-storage.service';
import { ServerPropertiesService } from '../server-properties.service';
import { Process, ProcessStatus } from './models';
import { HttpQueue } from '../util/HttpQueue';

export interface Project {
  id: string;
  workspaceName: string;
  internalName: string;
  databaseName?: string;
  storeName?: string;
  href?: string;
  type?: string;
  layersCount?: number;
  status?: ProcessStatus;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private currentProject?: Promise<Project>;
  private _projects$: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>(undefined);
  private deletedProjects: string[] = [];

  projects$: Observable<Project[]> = this._projects$.asObservable()
    .pipe(
      map(projects => projects && projects.filter(p => !this.deletedProjects.includes(p.id))),
      publishReplay(1),
      refCount(),
      filter(data => !!data)
    );

  constructor(private http: HttpClient,
              private httpq: HttpQueue,
              private router: Router,
              private log: FizLogger,
              private wsService: WsService,
              private layerService: LayersService,
              private storageService: LocalStorageService,
              private serverProp: ServerPropertiesService) {
    this.projects$.subscribe();
  }

  openProject (project: Project) {
    this.router.navigateByUrl(this.getProjectUrl(project));
  }

  getProjectUrl (project: Project): string {
    return project.layersCount ?
          `/project/${project.id}/map` :
          `/project/${project.id}/import`;
  }

  async fetchProjects() {
    const url = `${await this.serverProp.organizationsUrl}/${this.storageService.getOrgId()}/projects`;

    this.http
        .get<Project[]>(url)
        .pipe(
          flatMap((projects: Project[]) => this.fetchProjectsLayers(projects)),
        )
        .subscribe((projects: Project[]) => {
          this._projects$.next(projects);
        });
  }

  async getById(id: string): Promise<Project> {
    const url = `${await this.serverProp.organizationsUrl}/${this.storageService.getOrgId()}/projects/${id}`;

    return this.httpq.get<Project>(url);
  }

  async create(name: string): Promise<any> {
    const url = `${await this.serverProp.organizationsUrl}/${this.storageService.getOrgId()}/projects`;

    const payload = {
      'projectName': name
    };

    return this.httpq.post(url, payload);
  }

  async delete(id: string) {
    const url = `${await this.serverProp.organizationsUrl}/${this.storageService.getOrgId()}/projects/${id}`;

    await this.httpq.delete(url);

    this.deletedProjects.push(id);

    this._projects$.next(this._projects$.value);
  }

  /**
   * Для выполнения импорта передаем на бекенд geoserverName(то имя под которым создан workspace на геосервере,
   * то имя под которым создана схема в БД) проекта в который хотим импортировать.
   * Организация, а соответственно и название БД есть на сервере.
   */
  async doWorkImport(tasks: TaskImport[], projectId: string, workspaceName: string): Promise<Process> {
    const url = `${await this.serverProp.organizationsUrl}/${this.storageService.getOrgId()}/projects/${projectId}/import`;
    const payload = {
      wsUiId: this.wsService.getId(),
      targetSchema: workspaceName,
      importTasks: tasks
    };

    return this.httpq.post<Process>(url, payload);
  }

  clearCache() {
    this._projects$.next(undefined);
  }

  changeProject() {
    this.storageService.clearProject();
  }

  async getCurrent(route?: ActivatedRouteSnapshot): Promise<Project> {
    route = route || getRoute().snapshot;
    const projectId = route.params.projectId;

    if (this.currentProject) {
      const project = await this.currentProject;
      if (String(project.id) === projectId) {
        return project;
      }
    }

    this.currentProject = this.getById(projectId);

    return this.currentProject;
  }

  private fetchProjectsLayers(projects: Project[]): Observable<Project[]> {
    if (!projects || projects.length === 0) {
      return of([]);
    }

    return this.layerService
      .getAllLayers()
      .pipe(
        map((layers: NameHrefProjection[]) => {
          projects.forEach((project: Project) => project.layersCount = this.countLayers(project, layers));

          return projects;
        }),
        catchError(err => {
          this.log.error('Cant get layers from geoserver: ', err);
          return [];
        })
      );
  }

  private countLayers(project: Project, layers: NameHrefProjection[]): number {
    let counter = 0;
    layers.forEach((layer: NameHrefProjection) => {
      const projectName = layer.name.split(':')[0];
      if (projectName) {
        if (project.workspaceName === projectName) {
          counter++;
        }
      } else {
        this.log.warn('projects', 'Incorrect layer name');
      }
    });

    return counter;
  }
}
