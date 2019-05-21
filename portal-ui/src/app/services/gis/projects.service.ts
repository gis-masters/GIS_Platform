import {NGXLogger} from 'ngx-logger';
import {WsService} from '../ws.service';
import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {HttpClient} from '@angular/common/http';
import {ProcessStatus} from '../process-status';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {WorkImport} from '../geoserver/import/workImport';
import {LayersService} from '../geoserver/layers.service';
import {NameHrefProjection} from '../geoserver/projections';
import {LocalStorageService} from '../local-storage.service';
import {ServerPropertiesService} from '../server-properties.service';
import {catchError, filter, flatMap, map, publishReplay, refCount} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private projectsUrl = this.serverProp.baseUrl + '/projects';

  private _projects$: BehaviorSubject<CrgProject[]> = new BehaviorSubject<CrgProject[]>(undefined);
  public projects$: Observable<CrgProject[]> = this._projects$.asObservable()
    .pipe(
      // компоненты при подписке должны видеть одно последнее значение в потоке
      publishReplay(1),
      refCount(),
      filter(data => !!data)
    );

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private wsService: WsService,
              private layerService: LayersService,
              private baseService: BaseService,
              private storageService: LocalStorageService,
              private serverProp: ServerPropertiesService) {
    logger.info('WorkspacesService start');

    this.projects$.subscribe();
  }

  fetchProjects(): void {
    this.http
        .get<CrgProject[]>(this.projectsUrl)
        .pipe(
          flatMap((projects: CrgProject[]) => this.fetchProjectsLayers(projects)),
        )
        .subscribe((projects: CrgProject[]) => {
          this._projects$.next(projects);
        });
  }

  getById(id: string): Observable<CrgProject> {
    return this.http.get<CrgProject>(this.projectsUrl + '/' + id);
  }

  create(name: string): Observable<any> {
    return this.http.post(this.projectsUrl + '/' + name, {});
  }

  delete(name: string): Observable<any> {
    return this.http.delete(this.projectsUrl + '/' + name);
  }

  /**
   * Для выполнения импорта передаем на бекенд geoserverName(то имя под которым создам workspace на геосервере,
   * то имя под которым создана схема в БД) проекта в который хотим импортировать.
   * Организация, а соответственно и название БД есть на сервере.
   * К какой организации привязан пользователь тоже разберется бекенд.
   */
  doWorkImport(workImport: WorkImport) {
    this.logger.info('doWorkImport: ', workImport);

    const payload = {
      wsUiId: this.wsService.getId(),
      targetSchema: workImport.projectModel.crgProject.geoserverName,
      importTasks: workImport.tasks
    };

    return this.http.post(this.projectsUrl + '/import', payload);
  }

  changeProject() {
    this.storageService.clearProject();
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
          this.logger.error('Cant get layers from geoserver: ', err);
          return [];
        })
      );
  }

  private countLayers(project: CrgProject, layers: NameHrefProjection[]): number {
    let counter = 0;
    layers.forEach((layer: NameHrefProjection) => {
      const projectName = layer.name.split(':')[0];
      if (projectName) {
        if (project.geoserverName === projectName) {
          counter++;
        }
      } else {
        this.logger.warn('Incorrect layer name');
      }
    });

    return counter;
  }

}

export interface CrgProject {
  id: string;
  geoserverName: string;
  internalName: string;
  href?: string;
  type?: string;
  layersCount?: number;
  status?: ProcessStatus;
}
