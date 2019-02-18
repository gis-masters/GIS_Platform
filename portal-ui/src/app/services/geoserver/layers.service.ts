import {NGXLogger} from 'ngx-logger';
import {GeoUtil} from "../util/GeoUtil";
import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {NameHrefProjection} from './projections';
import {DatastoreService} from "./datastore.service";
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {FgistpRulesService} from "../gis/fgistp-rules.service";
import {publishReplay} from "rxjs/internal/operators/publishReplay";
import {ServerPropertiesService} from '../server-properties.service';
import {catchError, filter, flatMap, map, refCount} from 'rxjs/operators';

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
          map((layers: NameHrefProjection[]) => {
            return layers.filter((layer: NameHrefProjection) => !layer.name.includes(environment.scratchWorkspaceName));
          }),
          map((layers: NameHrefProjection[]) => this.mergeWithRules(layers)),
          catchError(this.baseService.handleError('getAllLayers', []))
        )
        .subscribe(this._layers$);
  }

  /**
   * Получить полную информацию о слое
   * @param layer Простое предствление слоя
   */
  getLayer(layer: NameHrefProjection): Observable<Layer> {
    return this.http
               .get<Layer>(layer.href);
  }

  /**
   * Получить полную информацию о слоях
   * @param layers Список слоев
   */
  getLayers(layers: NameHrefProjection[]) {
    const observableTasks = [];
    layers.forEach((layer: NameHrefProjection) => {
      observableTasks.push(this.getLayer(layer));
    });

    return forkJoin(observableTasks);
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

  fetchLayerConnectionInfo(layer: NameHrefProjection) {
    return this.getLayer(layer)
               .pipe(
                 filter((layer: Layer) => !!layer),
                 flatMap((layer: Layer) => this.datastoreService.getByLayerResource(layer)),
                 map((data: any) => GeoUtil.getDbInfo(data.dataStore.connectionParameters, layer.name)),
               );
  }

  private mergeWithRules(layers: NameHrefProjection[]) {
    const crgLayers: CrgLayer[] = [];

    layers.forEach((layer: NameHrefProjection) => {
      let layerName = layer.name.split(':')[1];
      let layerTitle = this.ruleService.getLayerTitle(layerName);

      crgLayers.push({
        name: layerName,
        complexName: layer.name,
        href: layer.href,
        title: layerTitle
      })
    });

    return crgLayers;
  }
}

export interface CrgLayer {
  name: string;
  complexName: string;
  title: string;
  href: string;
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
