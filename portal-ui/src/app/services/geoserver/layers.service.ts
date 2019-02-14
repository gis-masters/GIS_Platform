import {forkJoin, Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {NameHrefProjection} from './projections';
import {catchError, filter, flatMap, map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {ServerPropertiesService} from '../server-properties.service';
import {GeoUtil} from "../util/GeoUtil";
import {ValidationRequest} from "../gis/validation.service";
import {DatastoreService} from "./datastore.service";
import {FgistpRulesService} from "../gis/fgistp-rules.service";

@Injectable({
  providedIn: 'root'
})
export class LayersService {

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
   * Получить слоя в простом виде: имя и сслыка на полное представление
   */
  getAll(): Observable<NameHrefProjection[] | any> {
    return this.http
               .get<GeoLayer>(this.layersUrl)
               .pipe(
                 filter(value => value && !!value['layers']),
                 map((geoLayer: GeoLayer) => geoLayer.layers.layer as NameHrefProjection[]),
                 map((layers: NameHrefProjection[]) => {
                   return layers.filter((layer: NameHrefProjection) => !layer.name.includes(environment.scratchWorkspaceName));
                 }),
                 catchError(this.baseService.handleError('getAllLayers', []))
               );
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
