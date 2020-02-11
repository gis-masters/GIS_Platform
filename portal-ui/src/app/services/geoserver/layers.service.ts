import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, publishReplay, refCount, tap } from 'rxjs/operators';

import { NameHrefProjection } from './projections';
import { CrgLayer, Project } from '../../stores/ProjectsList.store';
import { Environment, getEnvironment } from '../environment';
import { dataSchemaService } from '../crg/data-schema.service';
import { serverProperties } from '../server-properties.service';
import { HttpQueue } from '../util/HttpQueue';

export interface GeoserverLayer {
  name: string;
  type: string;
  defaultStyle: NameHrefProjection;
  resource: any;
  attribution: any;
}

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
              private httpq: HttpQueue) {
    this.getEnv();
    this.layers$.subscribe();
    serverProperties.geoServerUrl.then((geoServerUrl) => {
      this.layersUrl = geoServerUrl + '/rest/layers';
    });
  }

  /**
   * Собираем все о слоях.
   */
  fetchLayers(project: Project): Observable<CrgLayer[]> {
    return of(project.layers)
      .pipe(
        map(layers => this.mergeWithSchemas(layers)),
        tap(result => {
          this._layers$.next(result);
        })
      );
  }

  deleteLayer(layer: CrgLayer): Promise<Object> {
    const crgLayers = this._layers$.getValue();
    const index = crgLayers.indexOf(layer);
    if (index > -1) {
      crgLayers.splice(index, 1);
    }

    this._layers$.next(crgLayers);

    return this.httpq.delete(this.layersUrl + '/' + layer.internalName);
  }

  /**
   * Получить полную информацию о слое
   * @param layer Простое предствление слоя
   */
  getFullLayer(layer: CrgLayer): Observable<{ layer: GeoserverLayer }> {
    return this.http
               .get<{ layer: GeoserverLayer }>(layer.href);
  }

  private async getEnv() {
    this.environment = await getEnvironment();
  }

  private mergeWithSchemas(layers: CrgLayer[]): CrgLayer[] {
    layers.forEach((layer: CrgLayer) => {
      layer.schema = dataSchemaService.getFeatureSchemaByName(layer.schemaId);
    });

    return layers;
  }
}
