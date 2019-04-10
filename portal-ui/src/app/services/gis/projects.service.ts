import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {filter, map, publishReplay, refCount} from 'rxjs/operators';
import {ServerPropertiesService} from '../server-properties.service';

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

}

export interface CrgProject {
  id: string;
  geoserverName: string;
  internalName: string;
  href?: string;
  type?: string;
}
