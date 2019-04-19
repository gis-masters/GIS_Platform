import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {filter, flatMap, map, publishReplay, refCount, tap} from 'rxjs/operators';
import {ServerPropertiesService} from '../server-properties.service';
import {WorkImport} from '../geoserver/import/workImport';
import {LayersService} from '../geoserver/layers.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private projectsUrl = this.serverProp.baseUrl + '/projects';

  private _projects$: BehaviorSubject<CrgProject[]> = new BehaviorSubject<CrgProject[]>([]);
  public projects$: Observable<CrgProject[]> = this._projects$.asObservable()
    .pipe(
      // компоненты при подписке должны видеть одно последнее значение в потоке
      publishReplay(1),
      refCount()
    );

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private layerService: LayersService,
              private baseService: BaseService,
              private serverProp: ServerPropertiesService) {
    logger.info('WorkspacesService start');

    this.projects$.subscribe();
  }

  fetchProjects(): void {
    this.http
        .get<CrgProject[]>(this.projectsUrl)
        .pipe(
          filter((projects: CrgProject[]) => !!projects),
          flatMap((projects: CrgProject[]) => this.fetchProjectsLayers(projects)),
          tap(console.log),
        )
        .subscribe((projects: CrgProject[]) => {
          this._projects$.next(projects);
        });
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
      targetSchema: workImport.projectModel.crgProject.geoserverName,
      importTasks: workImport.tasks
    };

    return this.http.post(this.projectsUrl + '/import', payload);
  }

  private fetchProjectsLayers(projects: CrgProject[]) {
    const observableTasks = [];
    projects.forEach((project: CrgProject) => {
      observableTasks.push(this.fetchProjectLayers(project));
    });

    return forkJoin(observableTasks);
  }

  private fetchProjectLayers(project: CrgProject): Observable<CrgProject> {
    return this.layerService
               .countProjectLayers(project)
               .pipe(
                 map((value: number) => {
                   if (value) {
                     project.layersCount = value;
                   } else {
                     project.layersCount = 0;
                   }

                   return project;
                 })
               );
  }

}

export interface CrgProject {
  id: string;
  geoserverName: string;
  internalName: string;
  href?: string;
  type?: string;
  layersCount?: number;
}
