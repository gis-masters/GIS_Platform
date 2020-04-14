import { HttpParams } from '@angular/common/http';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, publishReplay, refCount } from 'rxjs/operators';

import { NameHrefProjection } from './projections';
import { serverProperties } from '../server-properties.service';
import { services } from '../services';
import { CrgLayer, CrgGroup, Rule } from '../crg/projects.models';
import { currentProject } from '../../stores/CurrentProject.store';

export interface GeoserverLayer {
  name: string;
  type: string;
  defaultStyle: NameHrefProjection;
  resource: any;
  attribution: any;
}

class LayersService {
  private static _instance: LayersService;
  private _layers$: BehaviorSubject<CrgLayer[]> = new BehaviorSubject<CrgLayer[]>(undefined);
  public layers$: Observable<CrgLayer[]> = this._layers$.asObservable()
    .pipe(
      // компоненты при подписке должны видеть одно последнее значение в потоке
      publishReplay(1),
      refCount(),
      filter(data => !!data)
    );

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    this.layers$.subscribe();
  }

  async deleteLayer(layer: CrgLayer) {
    await services.httpq.delete(`${await serverProperties.projectsUrl}/${currentProject.id}/layers/${layer.id}`);
    currentProject.deleteLayer(layer);
  }

  /**
   * Получить полную информацию о слое
   * @param layer Простое предствление слоя
   */
  async getFullLayer(layer: CrgLayer): Promise<GeoserverLayer> {
    return (await services.httpq.get<{ layer: GeoserverLayer }>(layer.href)).layer;
  }

  async updateLayerOrGroup <T extends (CrgLayer | CrgGroup)>(item: T, patch: Partial<T>, isGroup: boolean) {
    await services.provided;
    const backup = cloneDeep(item);
    const path = isGroup ? 'groups' : 'layers';
    currentProject.patch(item, patch);

    try {
      const url = `${await serverProperties.projectsUrl}/${currentProject.id}/${path}/${item.id}`;
      await services.httpq.patch(url, patch);
    } catch (err) {
      currentProject.patch(item, backup);
    }
  }

  async loadLayerLegend (layer: CrgLayer) {
    if (layer.legend || layer.legendIsFetching) {
      return;
    }

    currentProject.patch(layer, { legendIsFetching: true });

    const fullLayer = await layersService.getFullLayer(layer);
    const styleSld: string = await this.getStyleSld(fullLayer.defaultStyle.name);
    const xmlDoc = new DOMParser().parseFromString(styleSld, 'text/xml');
    const rules: Rule[] = Array.from(xmlDoc.querySelectorAll('Rule'))
      .filter(rule => rule.querySelector('Name') && rule.querySelector('Title'))
      .map(rule => ({
        name: rule.querySelector('Name').innerHTML,
        title: rule.querySelector('Title').innerHTML
      }));
    const rulesWithLegend = await Promise.all(rules.map(async rule => {
      const blob = await layersService.getLegendGraphicByRuleName(layer.complexName, rule.name);
      const img = await this.createImageFromBlob(blob);

      return {
        ...rule,
        legend: img
      };
    }));

    currentProject.patch(layer, {
      legend: rulesWithLegend,
      legendIsFetching: false,
    });
  }

  private createImageFromBlob(image: Blob): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        resolve(reader.result as string);
      }, false);

      if (image) {
        reader.readAsDataURL(image);
      }
    });
  }

  /**
   * Get a graphic that is representative of specific rule by their name.
   *
   * @param complexLayerName  Название слоя в формате 'workspace:layerName'
   * @param ruleName          Название правила в стиле. Ожидаем что в названии стиля будет использован атрибут на
   *                          основе которого сделан фильтр.
   */
  private async getLegendGraphicByRuleName(complexLayerName: string, ruleName: string): Promise<Blob> {
    const params = new HttpParams()
      .set('REQUEST', 'GetLegendGraphic')
      .set('VERSION', '1.3.0')
      .set('FORMAT', 'image/png')
      .set('WIDTH', '40')
      .set('HEIGHT', '20')
      .set('LAYER', complexLayerName)
      .set('RULE', ruleName);

    return services.httpq.get(`${await serverProperties.geoServerUrl}/wms`, { responseType: 'blob', params });
  }

    /**
   * Get the style SLD definition body.
   *
   * @param complexStyleName style name or complex style name ("workspace_name:style_name")
   */
  private async getStyleSld(complexStyleName: string): Promise<string> {
    const styleNameArr = complexStyleName.split(':');
    const styleName = styleNameArr.pop();
    const geoServerUrl = await serverProperties.geoServerUrl;
    const workspacesUrl = geoServerUrl + '/rest/workspaces/';
    const workspaceName = styleNameArr[0];
    const url: string = workspaceName ?
              workspacesUrl + workspaceName + '/styles/' + styleName + '.sld' :
              geoServerUrl + '/rest/styles/' + styleName + '.sld';

    return services.httpq.get<string>(
        url,
        { headers: { 'Content-Type': 'application/vnd.ogc.sld+xml' }, responseType: 'text' }
    );
  }
}

export const layersService = LayersService.instance;
