import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';

import {FizLogger} from '../logger/fiz.logger';
import {NameHrefProjection} from './projections';
import {Project} from '../crg/projects.service';
import {filter, flatMap, map, publishReplay, refCount, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {DataSchemaService} from '../crg/data-schema.service';
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class LayersService {

  private layersUrl = this.serverProp.geoServerUrl + '/rest/layers';

  private _layers$: BehaviorSubject<CrgLayer[]> = new BehaviorSubject<CrgLayer[]>(undefined);
  public layers$: Observable<CrgLayer[]> = this._layers$.asObservable()
    .pipe(
      // компоненты при подписке должны видеть одно последнее значение в потоке
      publishReplay(1),
      refCount(),
      filter(data => !!data)
    );

  constructor(private http: HttpClient,
              private log: FizLogger,
              private ruleService: DataSchemaService,
              private serverProp: ServerPropertiesService) {
    this.log.debug('setUp', 'LayersService constructor');

    this.layers$.subscribe();
  }

  /**
   * Собираем все о слоях.
   */
  fetchLayers(project: Project): Observable<CrgLayer[]> {
    return this.http
      .get<GeoLayer>(this.layersUrl)
      .pipe(
        filter(value => value && !!value['layers']),
        map((geoLayer: GeoLayer) => geoLayer.layers.layer as NameHrefProjection[]),
        map((layers: NameHrefProjection[]) => this.filterScratchLayers(layers)),
        map((layers: NameHrefProjection[]) => this.filterProjectLayers(project, layers)),
        flatMap((layers: NameHrefProjection[]) => this.fetchLayersDescription(layers)),
        map(([layers, layersDescription]) => this.mergeWithRules(layers)),
        tap((result) => {
          this._layers$.next(result);
        })
      );
  }

  /**
   * Все слоя с геосервера в виде наименования и ссылки
   * (без scrath слоев)
   */
  getAllLayers(): Observable<NameHrefProjection[]> {
    return this.http
               .get<GeoLayer>(this.layersUrl)
               .pipe(
                 filter(value => !!value),
                 map((geoLayer: GeoLayer) => geoLayer.layers.layer as NameHrefProjection[]),
                 map((layers: NameHrefProjection[]) => this.filterScratchLayers(layers)),
               );
  }

  deleteLayer(layer: CrgLayer) {
    return this.http.delete(this.layersUrl + '/' + layer.name);
  }

  addStyle(styleName: string, fileName: string, layer: string): Observable<any> {
    const params = new HttpParams();
    params.append('default', 'true');

    const payload = {
      style: {
        name: 'functionalzone_style',
        filename: 'functionalzone_style.sld'
      }
    };

    // this.logger.info('payload: ', payload);

    return this.http
      .post(this.layersUrl + '/' + layer + '/styles', payload, {params: params});
  }

  private fetchLayersDescription(layers: NameHrefProjection[]): any {
    if (layers.length === 0) {
      return of([]);
    }

    return combineLatest(
      of(layers),
      this.ruleService.getFeaturesDefinition()
    );
  }

  private mergeWithRules(layers: NameHrefProjection[]): CrgLayer[] {
    const crgLayers: CrgLayer[] = [];

    if (!layers || !layers.length) {
      return crgLayers;
    }

    layers.forEach((layer: NameHrefProjection) => {
      const layerName = layer.name.split(':')[1];
      const layerTitle = this.ruleService.getLayerTitle(layerName);

      crgLayers.push({
        name: layerName,
        complexName: layer.name,
        href: layer.href,
        title: layerTitle
      });
    });

    return crgLayers;
  }

  /**
   * Получить полную информацию о слое
   * @param layer Простое предствление слоя
   */
  getFullLayer(layer: NameHrefProjection): Observable<{layer: Layer}> {
    return this.http
      .get<{layer: Layer}>(layer.href);
  }

  private filterScratchLayers(layers: NameHrefProjection[]) {
    if (!layers) {
      return [];
    }

    return layers.filter((layer: NameHrefProjection) => !layer.name.includes(environment.scratchWorkspaceName));
  }

  private filterProjectLayers(project: Project, layers: NameHrefProjection[]) {
    return layers.filter((layer: CrgLayer) => {
      const projectName = layer.name.split(':')[0];

      return projectName === project.workspaceName;
    });
  }
}

export interface CrgLayer {
  name: string;         // Like: functionalzone
  complexName: string;  // Like: work_workspace:functionalzone
  title: string;        // Like: Функциональные зоны
  href: string;
}

export interface ConnectionInfo {
  dbName: string;
  schemaName: string;
  tableName: string;
}

export interface GeoLayer {
  layers: {
    layer: NameHrefProjection[]
  };
}

export interface Layer {
  name: string;
  type: string;
  defaultStyle: NameHrefProjection;
  resource: any;
  attribution: any;
}
