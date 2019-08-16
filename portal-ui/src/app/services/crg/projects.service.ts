import {WsService} from '../ws.service';
import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {FizLogger} from '../logger/fiz.logger';
import {HttpClient} from '@angular/common/http';
import {ProcessStatus} from '../process-status';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {WorkImport} from '../geoserver/import/workImport';
import {LayersService} from '../geoserver/layers.service';
import {NameHrefProjection} from '../geoserver/projections';
import {LocalStorageService} from '../local-storage.service';
import {ProjectModel} from '../geoserver/import/projectModel';
import {ServerPropertiesService} from '../server-properties.service';
import {catchError, filter, flatMap, map, publishReplay, refCount} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private orgUrl = this.serverProp.organizationsUrl + '/';

  private _projects$: BehaviorSubject<CrgProject[]> = new BehaviorSubject<CrgProject[]>(undefined);
  public projects$: Observable<CrgProject[]> = this._projects$.asObservable()
    .pipe(
      // компоненты при подписке должны видеть одно последнее значение в потоке
      publishReplay(1),
      refCount(),
      filter(data => !!data)
    );

  constructor(private http: HttpClient,
              private log: FizLogger,
              private wsService: WsService,
              private layerService: LayersService,
              private baseService: BaseService,
              private storageService: LocalStorageService,
              private serverProp: ServerPropertiesService) {
    this.projects$.subscribe();
  }

  fetchProjects(): void {
    const url = this.orgUrl + this.storageService.getOrgId() + '/projects';

    this.http
        .get<CrgProject[]>(url)
        .pipe(
          flatMap((projects: CrgProject[]) => this.fetchProjectsLayers(projects)),
        )
        .subscribe((projects: CrgProject[]) => {
          this._projects$.next(projects);
        });
  }

  getById(id: string): Observable<CrgProject> {
    const url = this.orgUrl + this.storageService.getOrgId() + '/projects/' + id;

    return this.http.get<CrgProject>(url);
  }

  create(name: string): Observable<any> {
    const url = this.orgUrl + this.storageService.getOrgId() + '/projects';

    const payload = {
      'projectName': name
    };

    return this.http.post(url, payload);
  }

  delete(id: string): Observable<any> {
    const url = this.orgUrl + this.storageService.getOrgId() + '/projects/' + id;

    return this.http.delete(url);
  }

  /**
   * Для выполнения импорта передаем на бекенд geoserverName(то имя под которым создан workspace на геосервере,
   * то имя под которым создана схема в БД) проекта в который хотим импортировать.
   * Организация, а соответственно и название БД есть на сервере.
   */
  doWorkImport(workImport: WorkImport) {
    this.log.info('projects', 'do Work Import', workImport);

    const projectId = workImport.projectModel.crgProject.id;
    const url = this.orgUrl + this.storageService.getOrgId() + '/projects/' + projectId + '/import';
    const payload = {
      wsUiId: this.wsService.getId(),
      targetSchema: workImport.projectModel.crgProject.workspaceName,
      importTasks: workImport.tasks
    };

    return this.http.post(url, payload);
  }

  clearCache() {
    this.log.info('projects', 'clearCache');

    this._projects$.next(undefined);
  }

  changeProject() {
    this.storageService.clearProject();
  }

  getCurrent(): ProjectModel {
    return this.storageService.getProject();
  }

  private fetchProjectsLayers(projects: CrgProject[]): Observable<CrgProject[]> {
    if (projects.length === 0) {
      return of([]);
    }

    return this.layerService
      .getAllLayers()
      .pipe(
        map((layers: NameHrefProjection[]) => {
          projects.forEach((project: CrgProject) => project.layersCount = this.countLayers(project, layers));

          return projects;
        }),
        catchError(err => {
          this.log.error('Cant get layers from geoserver: ', err);
          return [];
        })
      );
  }

  private countLayers(project: CrgProject, layers: NameHrefProjection[]): number {
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

export interface CrgProject {
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
