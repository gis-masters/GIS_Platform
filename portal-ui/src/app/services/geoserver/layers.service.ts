import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {filter, flatMap, map, publishReplay, refCount, tap} from 'rxjs/operators';

import {NameHrefProjection} from './projections';
import {Project} from '../../stores/ProjectsList.store';
import {Environment, getEnvironment} from '../environment';
import {DataSchemaService, FeatureDescription} from '../crg/data-schema.service';
import {ServerPropertiesService} from '../server-properties.service';
import {LayerGroupService} from './layer-group.service';
import {HttpQueue} from '../util/HttpQueue';
import {GeometryType, StringUtil} from '../util/StringUtil';
import {LAYERS_GROUP} from '../crg/models';

@Injectable({
  providedIn: 'root'
})
export class LayersService {
  private layersUrl: string;
  private environment: Environment;
  private _layers$: BehaviorSubject<CrgLayer[]> = new BehaviorSubject<CrgLayer[]>(undefined);
  public layers$: Observable<CrgLayer[]> = this._layers$.asObservable()
    .pipe(
      // компоненты при подписке должны видеть одно последнее значение в потоке
      publishReplay(1),
      refCount(),
      filter(data => !!data)
    );

  constructor(private http: HttpClient,
              private httpq: HttpQueue,
              private schemaService: DataSchemaService,
              private layerGroupService: LayerGroupService,
              private serverProp: ServerPropertiesService) {
    this.getEnv();
    this.layers$.subscribe();
    this.serverProp.geoServerUrl.then((geoServerUrl) => {
      this.layersUrl = geoServerUrl + '/rest/layers';
    });
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
        flatMap((layers: NameHrefProjection[]) => this.fetchFeatureSchemas(layers)),
        map(([layers, data]) => this.mergeWithSchemas(layers)),
        map((layers: CrgLayer[]) => this.fillGeometry(layers)),
        flatMap((layers: CrgLayer[]) => this.addLayerGroups(layers, project)),
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

  deleteLayer(layer: CrgLayer): Promise<Object> {
    const crgLayers = this._layers$.getValue();
    const index = crgLayers.indexOf(layer);
    if (index > -1) {
      crgLayers.splice(index, 1);
    }

    this._layers$.next(crgLayers);

    return this.httpq.delete(this.layersUrl + '/' + layer.name);
  }

  /**
   * Получить полную информацию о слое
   * @param layer Простое предствление слоя
   */
  getFullLayer(layer: NameHrefProjection): Observable<{layer: Layer}> {
    return this.http
      .get<{layer: Layer}>(layer.href);
  }

  private async getEnv () {
    this.environment = await getEnvironment();
  }

  private fetchFeatureSchemas(layers: NameHrefProjection[]): any {
    if (layers.length === 0) {
      return of([]);
    }

    return combineLatest(
      of(layers),
      this.schemaService.getFeaturesSchemas()
    );
  }

  private mergeWithSchemas(layers: NameHrefProjection[]): CrgLayer[] {
    const crgLayers: CrgLayer[] = [];

    if (!layers || !layers.length) {
      return crgLayers;
    }

    layers.forEach((layer: NameHrefProjection) => {
      const layerName = layer.name.split(':')[1];
      const featureSchema = this.schemaService.getFeatureSchemaByName(layerName);

      crgLayers.push({
        name: layerName,
        complexName: layer.name,
        href: layer.href,
        title: featureSchema ? featureSchema.title : layerName,
        schema: featureSchema
      });
    });

    return crgLayers;
  }

  private filterScratchLayers(layers: NameHrefProjection[]) {
    if (!layers) {
      return [];
    }

    return layers.filter((layer: NameHrefProjection) => !layer.name.includes(this.environment.scratchWorkspaceName));
  }

  private filterProjectLayers(project: Project, layers: NameHrefProjection[]) {
    return layers.filter((layer: CrgLayer) => {
      const projectName = layer.name.split(':')[0];

      return projectName === project.workspaceName;
    });
  }

  private async addLayerGroups(layers: CrgLayer[], project: Project): Promise<CrgLayer[]> {
    const layerGroups = await this.layerGroupService.fetchLayerGroups(project);

    if (!layerGroups) {
      return layers;
    }

    layerGroups.forEach((layerGroup: NameHrefProjection) => {
      const rightPart = layerGroup.href.split('workspaces/')[1];
      layers.push({
        title: layerGroup.name,
        name: layerGroup.name,
        complexName: rightPart.split('/')[0] + ':' + layerGroup.name,
        href: '',
        schema: LAYERS_GROUP
      });
    });

    return layers;
  }

  private fillGeometry(layers: CrgLayer[]) {
    layers.forEach(layer => {
      layer.geometry = StringUtil.defineGeomType(layer.name);
    });

    return layers;
  }
}

export interface CrgLayer {
  name: string;         // Like: functionalzone
  complexName: string;  // Like: work_workspace:functionalzone
  title: string;        // Like: Функциональные зоны
  href: string;
  schema: FeatureDescription;
  geometry?: GeometryType | undefined;
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
