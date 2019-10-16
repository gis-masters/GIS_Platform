import {WsService} from '../ws.service';
import {Injectable} from '@angular/core';
import {FizLogger} from '../logger/fiz.logger';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {WorkImport} from '../geoserver/import/workImport';
import {LayersService} from '../geoserver/layers.service';
import {NameHrefProjection} from '../geoserver/projections';
import {LocalStorageService} from '../local-storage.service';
import {ProjectModel} from '../geoserver/import/projectModel';
import {ServerPropertiesService} from '../server-properties.service';
import {catchError, filter, flatMap, map, publishReplay, refCount} from 'rxjs/operators';
import {Process, ProcessStatus} from './models';
import {StorageKeys} from '../storage-keys';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private orgUrl: string;

  private _projects$: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>(undefined);
  public projects$: Observable<Project[]> = this._projects$.asObservable()
    .pipe(
      // компоненты при подписке должны видеть одно последнее значение в потоке
      publishReplay(1),
      refCount(),
      filter(data => !!data)
    );

  constructor(private http: HttpClient,
              private router: Router,
              private log: FizLogger,
              private wsService: WsService,
              private layerService: LayersService,
              private storageService: LocalStorageService,
              private serverProp: ServerPropertiesService) {
    this.projects$.subscribe();
    this.serverProp.organizationsUrl.then((organizationsUrl) => {
      // TODO выдернуть этот костыль при рефакторинге импорта (уже в процессе)
      this.orgUrl = organizationsUrl + '/';
    });
  }

  openProject (project: Project) {
    const projectModel = new ProjectModel(project);
    this.storageService.saveByKey(StorageKeys.projectKey, JSON.stringify(projectModel));

    if (project.layersCount > 0) {
      this.router.navigateByUrl('/workspace/map');
    } else {
      this.router.navigateByUrl('/workspace/data_import');
    }
  }

  fetchProjects(): void {
    const url = this.orgUrl + this.storageService.getOrgId() + '/projects';

    this.http
        .get<Project[]>(url)
        .pipe(
          flatMap((projects: Project[]) => this.fetchProjectsLayers(projects)),
        )
        .subscribe((projects: Project[]) => {
          this._projects$.next(projects);
        });
  }

  getById(id: string): Observable<Project> {
    const url = this.orgUrl + this.storageService.getOrgId() + '/projects/' + id;

    return this.http.get<Project>(url);
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

    return this.http.post<Process>(url, payload);
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
