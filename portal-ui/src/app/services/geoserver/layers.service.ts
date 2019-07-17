import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BaseService} from '../base.service';
import {FizLogger} from '../logger/fiz.logger';
import {NameHrefProjection} from './projections';
import {CrgProject} from '../crg/projects.service';
import {DatastoreService} from './datastore.service';
import {delay, filter, map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {FgistpRulesService} from '../crg/fgistp-rules.service';
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class LayersService {

  private layersUrl = this.serverProp.geoServerUrl + '/rest/layers';

  constructor(private http: HttpClient,
              private log: FizLogger,
              private baseService: BaseService,
              private ruleService: FgistpRulesService,
              private datastoreService: DatastoreService,
              private serverProp: ServerPropertiesService) {
    this.log.debug('setUp', 'LayersService constructor');
  }

  /**
   * Собираем все о слоях.
   */
  fetchLayers(project: CrgProject): Observable<CrgLayer[]> {
    return this.http
      .get<GeoLayer>(this.layersUrl)
      .pipe(
        filter(value => value && !!value['layers']),
        map((geoLayer: GeoLayer) => geoLayer.layers.layer as NameHrefProjection[]),
        map((layers: NameHrefProjection[]) => this.filterScratchLayers(layers)),
        map((layers: NameHrefProjection[]) => this.filterProjectLayers(project, layers)),
        delay(1000), // wait rules
        map((layers: NameHrefProjection[]) => this.mergeWithRules(layers)),
        // flatMap((crgLayers: CrgLayer[]) => this.fetchLayersConnectionInfo(crgLayers)),
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

  // fetchLayerConnectionInfo(layer: CrgLayer) {
  //   return this.getLayer(layer)
  //              .pipe(
  //                filter((data: Layer) => !!data),
  //                flatMap((data: Layer) => this.datastoreService.getByLayerResource(data)),
  //                map((data: any) => {
  //                  if (data && data.dataStore) {
  //                    layer.connectionInfo = GeoUtil.getDbInfo(data.dataStore.connectionParameters, layer.name);
  //                  } else {
  //                    this.log.warn('layers', 'Error fetching connection info for layer', layer.name);
  //                  }
  //
  //                  return layer;
  //                }),
  //              );
  // }

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

  /**
   * Получить полную информацию о слое
   * @param layer Простое предствление слоя
   */
  private getLayer(layer: NameHrefProjection): Observable<Layer> {
    return this.http
      .get<Layer>(layer.href);
  }

  private filterScratchLayers(layers: NameHrefProjection[]) {
    if (!layers) {
      return [];
    }

    return layers.filter((layer: NameHrefProjection) => !layer.name.includes(environment.scratchWorkspaceName));
  }

  private filterProjectLayers(project: CrgProject, layers: NameHrefProjection[]) {
    return layers.filter((layer: CrgLayer) => {
      const projectName = layer.name.split(':')[0];

      return projectName === project.workspaceName;
    });
  }

  // private fetchLayersConnectionInfo(crgLayers: CrgLayer[]) {
  //   const observableTasks = [];
  //   crgLayers.forEach((layer: CrgLayer) => {
  //     observableTasks.push(this.fetchLayerConnectionInfo(layer));
  //   });
  //
  //   return forkJoin(observableTasks);
  // }

  private mergeWithRules(layers: NameHrefProjection[]) {
    const crgLayers: CrgLayer[] = [];

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
