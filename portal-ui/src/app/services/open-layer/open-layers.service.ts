import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import {NGXLogger} from 'ngx-logger';
import ImageWMS from 'ol/source/ImageWMS.js';
import {Fill, Stroke, Style} from 'ol/style.js';
import {createStringXY} from 'ol/coordinate.js';
import MultiPolygon from 'ol/geom/MultiPolygon.js';
import {WmsService} from '../geoserver/wms.service';
import {WfsFeature} from '../geoserver/wfs.service';
import {EventEmitter, Injectable} from '@angular/core';
import MousePosition from 'ol/control/MousePosition.js';
import MultiLineString from 'ol/geom/MultiLineString.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {defaults as defaultControls} from 'ol/control.js';
import {TokenStorageService} from '../token-storage.service';
import {Image as ImageLayer, Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';

export let BEARER_TOKEN = '';

@Injectable({
  providedIn: 'root'
})
export class OpenLayersService {

  mapClick$ = new EventEmitter<[number, number]>();

  private _map;
  view: View;

  bugObjectLayer: VectorLayer;

  mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: 'EPSG:4326',
    undefinedHTML: '&nbsp;'
  });

  constructor(private logger: NGXLogger,
              private tokenStorage: TokenStorageService,
              private wmsService: WmsService) {
    BEARER_TOKEN = tokenStorage.getAccessToken();
  }

  createMap() {
    const layers = [
      // Слой подложка
      new TileLayer({
        source: new OSM()
      })
    ];

    this.view = new View({
      center: [3803333, 5542377],
      zoom: 13
    });

    this._map = new Map({
      controls: defaultControls().extend([this.mousePositionControl]),
      layers: layers,
      target: 'fiz-openLayer-map',
      view: this.view
    });

    const mapClick = this.mapClick$;
    this._map.on('singleclick', function(event) {
      if (event.coordinate) {
        mapClick.emit(event.coordinate);
      } else {
        console.warn('No coordinate', event.coordinate);
        mapClick.emit([0, 0]);
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

  // Очистить карту от слоя, который отображал обьект.
  removeBugObjectsLayer() {
    if (this.bugObjectLayer) {
      this._map.removeLayer(this.bugObjectLayer);
    }
  }

  /**
   * позиционируемся и подсвечиваем.
   */
  showFeature(wfsFeature: WfsFeature) {
    this.positionToFeature(wfsFeature);
    this.paintFeature(wfsFeature);
  }

  fitToBbox(bbox: any, padding: [number, number, number, number]) {
    this._map
      .getView()
      .fit(bbox, {padding: padding, constrainResolution: false});
  }

  /**
   * Возвращает видимые слоя. (Без подлжки)
   */
  getVisibleLayers() {
    this._map.getLayers()
        .forEach((vrLayer) => {
          if (vrLayer.getVisible()) {
            console.log('--------', vrLayer);
          }
        });
  }

  private positionToFeature(feature: WfsFeature) {
    const view = this._map.getView();
    const size = this._map.getSize();

    if (feature.geometry.type === 'Point') {
      view.centerOn(feature.geometry.coordinates, size, [570, 500]);
    } else if (feature.geometry.type === 'MultiLineString') {
      this.fitToBbox(this.getBbox(feature), [50, 650, 50, 50]);
    } else if (feature.geometry.type === 'MultiPolygon') {
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

  private paintFeature(feature: WfsFeature) {
    this.removeBugObjectsLayer();
    let drawFeature;
    if (feature.geometry.type === 'Point') {
      drawFeature = new Feature({
        geometry: new Point(feature.geometry.coordinates),
      });
    } else if (feature.geometry.type === 'MultiLineString') {
      drawFeature = new Feature({
        geometry: new MultiLineString(feature.geometry.coordinates),
      });
    } else if (feature.geometry.type === 'MultiPolygon') {
      drawFeature = new Feature({
        geometry: new MultiPolygon(feature.geometry.coordinates),
      });
    } else {
      console.warn('Not supported geometry type: ', feature.geometry);
    }

    const vector = new VectorLayer({
      source: new VectorSource({
        features: [drawFeature]
      }),
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.3)'
        }),
        stroke: new Stroke({
          color: '#ff0018',
          width: 2
        })
      })
    });

    this.bugObjectLayer = vector;

    this._map.addLayer(vector);
  }

}

