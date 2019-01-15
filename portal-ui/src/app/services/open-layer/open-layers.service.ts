import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import ImageWMS from 'ol/source/ImageWMS.js';
import {WmsService} from '../geoserver/wms.service';
import {TokenStorageService} from '../token-storage.service';
import {Image as ImageLayer, Tile as TileLayer} from 'ol/layer.js';

export let BEARER_TOKEN = '';

@Injectable({
  providedIn: 'root'
})
export class OpenLayersService {

  private _map;

  constructor(private logger: NGXLogger,
              private tokenStorage: TokenStorageService,
              private wmsService: WmsService) {
    BEARER_TOKEN = tokenStorage.getAccessToken();
  }

  createMap() {
    const layers = [
      // Слой подлжка
      new TileLayer({
        source: new OSM()
      }),
    ];

    this._map = new Map({
      layers: layers,
      target: 'fiz-openLayer-map',
      view: new View({
        center: [3803333, 5542377],
        zoom: 13
      })
    });
  }

  addLayer(layerName: string) {
    this.logger.debug('addLayer: ', layerName);

    const imageLayer = new ImageLayer({
      source: new ImageWMS({
        url: this.wmsService.baseUrl,
        params: {'LAYERS': layerName},
        imageLoadFunction: this.fizImageLoadFunction,
        ratio: 1,
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
      })
    });

    imageLayer.setVisible(false);
    this._map.addLayer(imageLayer);

    return imageLayer;
  }

  /**
   * Принимает список включенных слоев.
   * Проходит по всем слоям на карте проставляет true для всех переданных слоев и false для всех остальных.
   *
   * @param layers - Навания включенных слоев.
   */
  changeLayersVisibility(layers: any[]) {
    this._map.getLayers().forEach((vrLayer: any) => {
      const source = vrLayer.getSource();
      if (source && source.params_ && source.params_['LAYERS']) {
        const layerName = source.params_['LAYERS'];
        let isExist = false;
        layers.forEach(value => {
          if (layerName.includes(value)) {
            isExist = true;
          }
        });

        if (isExist) {
          vrLayer.setVisible(true);
        } else {
          vrLayer.setVisible(false);
        }
      }
    });
  }

  public set_ZIndex(layerName: string, index: number) {
    this.getLayerByName(layerName)
        .setZIndex(index);
  }

  /**
   * Все слоя карты включая подложку.
   */
  public allLayers() {
    return this._map.getLayers();
  }

  /**
   * Все слоя типа 'IMAGE'
   */
  public imageLayers() {
    // return this.map.getLayers().filter((vrLayer) => vrLayer.type === 'IMAGE');

    const result = [];
    this._map.getLayers().forEach((vrLayer) => {
      if (vrLayer.type === 'IMAGE') {
        result.push(vrLayer);
      }
    });

    return result;
  }

  fizImageLoadFunction(tile, src) {
    const client = new XMLHttpRequest();

    client.open('GET', src);
    client.responseType = 'arraybuffer';
    client.setRequestHeader('Authorization', 'Bearer ' + BEARER_TOKEN);

    client.onload = function () {
      const arrayBufferView = new Uint8Array(this.response);
      const blob = new Blob([arrayBufferView], { type: 'image/png' });
      const urlCreator = window.URL || (window as any).webkitURL;

      tile.getImage().src = urlCreator.createObjectURL(blob);
    };

    client.send();
  }

  public getLayerByName(layerName: string) {
    let layer;
    this.imageLayers().forEach((vrLayer) => {
      const source = vrLayer.getSource();
      if (source && source.params_ && source.params_['LAYERS'].includes(layerName)) {
        layer = vrLayer;
      }
    });

    if (layer) {
      return layer;
    } else {
      this.logger.warn('Not found layer: ', layerName);

      return undefined;
    }
  }

  public getMap() {
    return this._map;
  }

  public setMap(value) {
    this._map = value;
  }

}
