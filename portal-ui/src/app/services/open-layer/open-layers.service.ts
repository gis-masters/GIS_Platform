import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Point from 'ol/geom/Point.js';
import MultiLineString from 'ol/geom/MultiLineString.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import MousePosition from 'ol/control/MousePosition.js';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {WmsService} from '../geoserver/wms.service';
import {TokenStorageService} from '../token-storage.service';
import {Image as ImageLayer, Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {WfsFeatureCollection, WfsService} from "../geoserver/wfs.service";
import {defaults as defaultControls} from 'ol/control.js';
import {createStringXY} from 'ol/coordinate.js';
import {GeometryFactory} from "./GeometryFactory";

export let BEARER_TOKEN = '';

@Injectable({
  providedIn: 'root'
})
export class OpenLayersService {

  private _map;

  view: View;

  style = new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.6)'
    }),
    stroke: new Stroke({
      color: '#319FD3',
      width: 1
    }),
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.6)'
      }),
      stroke: new Stroke({
        color: '#319FD3',
        width: 1
      })
    })
  });

  source2 = new VectorSource({
    url: 'data/geojson/switzerland.geojson',
    format: new GeoJSON()
  });

  mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: 'EPSG:4326',
    // comment the following two lines to have the mouse position
    // be placed within the map.
    // className: 'custom-mouse-position',
    // target: document.getElementById('mouse-position'),
    undefinedHTML: '&nbsp;'
  });

  constructor(private logger: NGXLogger,
              private tokenStorage: TokenStorageService,
              private wmsService: WmsService,
              private wfsService: WfsService) {
    BEARER_TOKEN = tokenStorage.getAccessToken();
  }

  createMap() {
    let vectorLayer = new VectorLayer({
      source: this.source2,
      style: this.style
    });

    const layers = [
      // Слой подлжка
      new TileLayer({
        source: new OSM()
      }),
      vectorLayer
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
  }

  addLayerToMap(layerName: string) {
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

      // this.logger.info(' - ', vrLayer);
      // this.logger.info(' - - ', source);

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

  positionToObjectById(objectId: any) {
    let view = this._map.getView();
    let size = this._map.getSize();

    this.logger.info('getProjection: ', view.getProjection());

    this.wfsService
        .getGeoJSON('work_workspace:electrictransformer', objectId)
        .subscribe((featureCollection: WfsFeatureCollection) => {
          let feature = featureCollection.features[0];

          if (feature.geometry.type === 'Point') {
            this.logger.info('Point');

            let point = new Point(feature.geometry.coordinates);

            // view.centerOn(feature.geometry.coordinates, size, [570, 500]); // работает
            view.fit(point, {minResolution: 1});
            // view.fit(point, {constrainResolution: false}); // не работает для точки
          } else if (feature.geometry.type === 'MultiLineString') {
            this.logger.info('MultiLineString');

            let multiLineString = new MultiLineString(feature.geometry.coordinates);

            // view.fit(multiLineString.getCoordinates(), {constrainResolution: false});
            view.fit(multiLineString, {constrainResolution: false});
          } else {
            console.warn('Not supported geometry type: ', feature.geometry);
          }
        });
  }
}
