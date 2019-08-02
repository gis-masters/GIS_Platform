import {MultiPolygon} from 'ol/geom';
import {Map, View} from 'ol';
import {NGXLogger} from 'ngx-logger';
import {Fill, Stroke, Style} from 'ol/style.js';
import {ImageWMS, OSM} from 'ol/source';
import {WmsService} from '../geoserver/wms.service';
import {WfsFeature} from '../geoserver/wfs.service';
import {EventEmitter, Injectable} from '@angular/core';
import {TokenStorageService} from '../token-storage.service';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import ImageLayer from 'ol/layer/Image';
import BaseLayer from 'ol/layer/Base';
import {MapperUtil} from './MapperUtil';
import {UsedGeometryType} from './GeometryType';

export let BEARER_TOKEN = '';

@Injectable({
  providedIn: 'root'
})
export class OpenLayersService {

  mapClick$ = new EventEmitter<number[]>();

  private _map: Map;
  private view: View;
  private draftSource: VectorSource;

  // Кол-во десятичных в координатах
  private PRECISION = 4;

  // Hit-detection tolerance. Pixels inside the square around the given position will be checked for features.
  private HIT_TOLERANCE = 10;

  // ZIndex чернового слоя который используется для подсвечивания обьектов
  private DRAFT_LAYER_ZINDEX = 10000;

  constructor(private logger: NGXLogger,
              private tokenStorage: TokenStorageService,
              private wmsService: WmsService) {
    BEARER_TOKEN = tokenStorage.getAccessToken();
  }

  createMap() {
    this.draftSource = new VectorSource({
      features: []
    });

    this.view = new View({
      center: [3803333, 5542377],
      zoom: 13
    });

    this._map = new Map({
      target: 'fiz-openLayer-map',
      view: this.view,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new VectorLayer({
          source: this.draftSource,
          zIndex: this.DRAFT_LAYER_ZINDEX,
          style: new Style({
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.3)'
            }),
            stroke: new Stroke({
              color: '#ff0018',
              width: 2
            })
          })
        })
      ]
    });

    // MAP EVENTS
    this._map.on('singleclick', event =>  {
      if (event.coordinate) {
        this.mapClick$.emit(event.coordinate);
      } else {
        console.warn('No coordinate', event.coordinate);
        this.mapClick$.emit([0, 0]);
      }
    });
  }

  addLayerToMap(complexLayerName: string) {
    const imageLayer = new ImageLayer({
      source: new ImageWMS({
        url: this.wmsService.baseUrl,
        params: {'LAYERS': complexLayerName},
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
   * @param layerNames - Навания включенных слоев.
   */
  changeLayersVisibility(layerNames: any[]) {
    this._map.getLayers().forEach((vrLayer: any) => {
      const source = vrLayer.getSource();

      if (source && source.params_ && source.params_['LAYERS']) {
        const layerName = source.params_['LAYERS'];
        let isExist = false;
        layerNames.forEach(value => {
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
    const result = [];
    this._map.getLayers().forEach((vrLayer) => {
      if (vrLayer.getType() === 'IMAGE') {
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

  // Очистить карту от слоя, который отображал обьект.
  clearDraft() {
    this.draftSource.clear();
  }

  /**
   * позиционируемся и подсвечиваем.
   */
  showFeature(wfsFeature: WfsFeature) {
    this.positionToFeature(wfsFeature);

    this.clearDraft();
    this.paintFeature(wfsFeature);
  }

  drawPolygon(coordinates) {
    const feature = {
      geometry: {type: UsedGeometryType.MULTIPOLYGON, coordinates: coordinates},
      type: '',
      id: '',
      geometry_name: '',
      properties: ''
    };

    this.paintFeature(feature);
  }

  fitToBbox(bbox: any, padding: [number, number, number, number]) {
    this._map
      .getView()
      .fit(bbox, {padding: padding, constrainResolution: false});
  }

  /**
   * Возвращает видимые слоя. (Без подложки: TILE)
   */
  getVisibleLayers(): BaseLayer[] {
    const result = [];
    this._map.getLayers()
        .forEach(vrLayer => {
          if (vrLayer.getVisible() && vrLayer.getType() !== 'TILE') {
            result.push(vrLayer);
          }
        });

    return result;
  }

  getResolution() {
    return this.view.getResolution();
  }

  getBufferByCoordinates(pos: [number, number]) {
    pos[0] = Number(pos[0].toFixed(this.PRECISION));
    pos[1] = Number(pos[1].toFixed(this.PRECISION));

    const res = Number(Number(this.getResolution() * this.HIT_TOLERANCE).toFixed(this.PRECISION));

    // console.log('pos/res', pos, res);

    const d = 2;
    const buffer = [[[
      [pos[0] + (res / d),        pos[1] + (res / d)],
      [pos[0] + (res / d) - res,  pos[1] + (res / d)],
      [pos[0] + (res / d) - res,  pos[1] + (res / d) - res],
      [pos[0] + (res / d),        pos[1] + (res / d) - res],
      [pos[0] + (res / d),        pos[1] + (res / d)]
    ]]];

    // console.log('buffer', buffer);

    return new MultiPolygon(buffer);
  }

  private positionToFeature(feature: WfsFeature) {
    const view = this._map.getView();
    const size = this._map.getSize();

    if (feature.geometry.type === UsedGeometryType.POINT) {
      view.centerOn(feature.geometry.coordinates, size, [570, 500]);
    } else if (feature.geometry.type === UsedGeometryType.MULTILINE_STRING) {
      this.fitToBbox(this.getBbox(feature), [50, 650, 50, 50]);
    } else if (feature.geometry.type === UsedGeometryType.MULTIPOLYGON) {
      this.fitToBbox(this.getBbox(feature), [50, 650, 50, 50]);
    } else {
      console.warn('Not supported geometry type: ', feature.geometry);
    }
  }

  private getBbox(feature: WfsFeature): [] {
    for (const key in feature.properties) {
      if (key === 'bbox') {
        return feature.properties[key];
      }
    }

    return [];
  }

  paintFeature(wfsFeature: WfsFeature) {
    this.draftSource
        .addFeature(MapperUtil.mapWfsFeatureToFeature(wfsFeature));
  }
}
