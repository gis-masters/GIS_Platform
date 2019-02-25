import {NGXLogger} from 'ngx-logger';
import {GeoUtil} from '../util/GeoUtil';
import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {NameHrefProjection} from './projections';
import {DatastoreService} from './datastore.service';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {filter, flatMap, map, refCount} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {FgistpRulesService} from '../gis/fgistp-rules.service';
import {publishReplay} from 'rxjs/internal/operators/publishReplay';
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class LayersService {

  private _layers$: BehaviorSubject<CrgLayer[]> = new BehaviorSubject<CrgLayer[]>([]);
  public layers$: Observable<CrgLayer[]> = this._layers$.asObservable()
    .pipe(
      // компоненты при подписке должны видеть одно последнее значение в потоке
      publishReplay(1),
      refCount()
    );

  private layersUrl = this.serverProp.geoServerUrl + '/rest/layers';

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private baseService: BaseService,
              private ruleService: FgistpRulesService,
              private datastoreService: DatastoreService,
              private serverProp: ServerPropertiesService) {
    logger.info('LayersService start');
  }

  /**
   * Получаем слоя с геосервера.
   */
  fetchLayers(): void {
    this.http
        .get<GeoLayer>(this.layersUrl)
        .pipe(
          filter(value => value && !!value['layers']),
          map((geoLayer: GeoLayer) => geoLayer.layers.layer as NameHrefProjection[]),
          map((layers: NameHrefProjection[]) => this.filterScratchLayers(layers)),
          map((layers: NameHrefProjection[]) => this.mergeWithRules(layers)),
          flatMap((crgLayers: CrgLayer[]) => this.fetchLayersConnectionInfo(crgLayers))
        )
        .subscribe(value => {
          this.logger.info('NEXT: ', value);

          this._layers$.next(value);
        });
  }

  fetchLayerConnectionInfo(layer: CrgLayer) {
    return this.getLayer(layer)
               .pipe(
                 filter((data: Layer) => !!data),
                 flatMap((data: Layer) => this.datastoreService.getByLayerResource(data)),
                 map((data: any) => {
                   if (data && data.dataStore) {
                     layer.connectionInfo = GeoUtil.getDbInfo(data.dataStore.connectionParameters, layer.name);
                   } else {
                     this.logger.warn('Error fetching connection info for layer', layer.name);
                   }

                   return layer;
                 }),
               );
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

    this.logger.info('payload: ', payload);

    return this.http
      .post(this.layersUrl + '/' + layer + '/styles', payload, {params: params});
  }

  /**
   * Получить полную информацию о слое
   * @param layer Простое предствление слоя
   */
  private getLayer(layer: NameHrefProjection): Observable<Layer> {
    return this.http
      .get<Layer>(layer.href);
  }

  private filterScratchLayers(layers: NameHrefProjection[]) {
    return layers.filter((layer: NameHrefProjection) => !layer.name.includes(environment.scratchWorkspaceName));
  }

  private fetchLayersConnectionInfo(crgLayers: CrgLayer[]) {
    const observableTasks = [];
    crgLayers.forEach((layer: CrgLayer) => {
      observableTasks.push(this.fetchLayerConnectionInfo(layer));
    });

    return forkJoin(observableTasks);
  }

  private mergeWithRules(layers: NameHrefProjection[]) {
    const crgLayers: CrgLayer[] = [];

    layers.forEach((layer: NameHrefProjection) => {
      const layerName = layer.name.split(':')[1];
      const layerTitle = this.ruleService.getLayerTitle(layerName);

      crgLayers.push({
        name: layerName,
        complexName: layer.name,
        href: layer.href,
        title: layerTitle,
        connectionInfo: {
          dbName: '',
          schemaName: '',
          tableName: ''
        }
      });
    });

    return crgLayers;
  }
}

export interface CrgLayer {
  name: string;
  complexName: string;
  title: string;
  href: string;
  connectionInfo: ConnectionInfo;
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
