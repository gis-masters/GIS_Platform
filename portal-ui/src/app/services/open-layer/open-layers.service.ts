import {EventEmitter, Injectable} from '@angular/core';
import {Map, View} from 'ol';
import XYZ from 'ol/source/XYZ';
import Feature from 'ol/Feature';
import LayerType from 'ol/LayerType';
import {MultiPolygon} from 'ol/geom';
import {NGXLogger} from 'ngx-logger';
import TileLayer from 'ol/layer/Tile';
import BaseLayer from 'ol/layer/Base';
import {ImageWMS, OSM} from 'ol/source';
import ImageLayer from 'ol/layer/Image';
import {MapperUtil} from './MapperUtil';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Fill, Stroke, Style} from 'ol/style.js';
import GeometryType from 'ol/geom/GeometryType';
import {defaults as defaultControls, ScaleLine} from 'ol/control';
import {WfsFeature} from '../geoserver/wfs.service';
import {TokenStorageService} from '../token-storage.service';
import {UsedGeometryType} from './GeometryType';
import {getEnvironment} from '../environment';
import {ServerPropertiesService} from '../server-properties.service';
import {getTopLeft, getWidth} from 'ol/extent';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import WMTS from 'ol/source/WMTS';
import {get as getProjection} from 'ol/proj';
import Layer from 'ol/layer/Layer';

export let BEARER_TOKEN = '';

export interface TileSource {
  name: string;
  title: string;
  source: XYZ;
  thumbnail: string;
}

// WMS request parameters. At least a LAYERS param is required.
export interface CrgWmsParams {
  LAYERS: string;
  FORMAT?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OpenLayersService {

  mapClick$ = new EventEmitter<number[]>();

  private currentTileSource: TileSource;

  private tileSources: TileSource[];

  private _map: Map;
  private view: View;
  private tileLayer: TileLayer;

  private draftSource: VectorSource;

  // Кол-во десятичных в координатах
  private PRECISION = 4;

  // Hit-detection tolerance. Pixels inside the square around the given position will be checked for features.
  private HIT_TOLERANCE = 10;

  // ZIndex чернового слоя который используется для подсвечивания обьектов
  private DRAFT_LAYER_ZINDEX = 10000;

  // Default view options
  private defaultZoomValue = 9;
  private defaultViewPoint = [3844444, 5644444];
  private defaultOpacity = 0.7;

  constructor(private logger: NGXLogger,
              private tokenStorage: TokenStorageService,
              private serverProp: ServerPropertiesService) {
    BEARER_TOKEN = tokenStorage.getAccessToken();

    this.setupTileSources();
  }

  createMap() {
    this.draftSource = new VectorSource({
      features: []
    });

    this.view = new View({
      center: this.defaultViewPoint,
      zoom: this.defaultZoomValue,
      minZoom: 5,
      maxZoom: 19
    });

    this.tileLayer = new TileLayer({
      source: this.currentTileSource.source
    });

    this._map = new Map({
      target: 'fiz-openLayer-map',
      view: this.view,
      controls: defaultControls().extend([
          new ScaleLine()
      ]),
      layers: [
        this.tileLayer,
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
    this._map.on('postrender', () =>  {
      window.dispatchEvent(new Event('resize'));
    });
    this._map.on('singleclick', event =>  {
      if (event.coordinate) {
        this.mapClick$.emit(event.coordinate);
      } else {
        console.warn('No coordinate', event.coordinate);
        this.mapClick$.emit([0, 0]);
      }
    });
  }

  async addLayerToMap(complexLayerName: string) {
    const params: CrgWmsParams = {
      LAYERS: complexLayerName,
      FORMAT: 'image/vnd.jpeg-png8'
    };

    const imageLayer = new ImageLayer({
      source: new ImageWMS({
        url: await this.serverProp.wmsUrl,
        params: params,
        imageLoadFunction: this.crgImageLoadFunction,
        ratio: 1,
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
      }),
      opacity: this.defaultOpacity
    });

    imageLayer.setVisible(false);

    this._map.addLayer(imageLayer);

    return imageLayer;
  }

  async deleteLayerFromMap(complexLayerName: string) {
    const layerByName = this.getLayerByName(complexLayerName);

    this._map.removeLayer(layerByName);
  }

  /**
   * Установить прозрачность слоя.
   *
   * @param complexLayerName Название слоя в формате 'workspace:layerName'
   * @param opacity   The opacity of the layer, allowed values range from 0 to 1.
   */
  setLayerOpacity(complexLayerName: string, opacity?: number) {
    const layerByName = this.getLayerByName(complexLayerName);
    if (layerByName) {
      layerByName.setOpacity(opacity);
    }
  }

  /**
   * @param complexLayerName Название слоя в формате 'workspace:layerName'
   */
  getLayerOpacity(complexLayerName: string) {
    const layerByName = this.getLayerByName(complexLayerName);
    if (layerByName) {
      return layerByName.getOpacity();
    }
  }

  setLayerVisibility(complexLayerName: string, visibility: boolean) {
    const layer = this.getLayerByName(complexLayerName);
    if (layer) {
      layer.setVisible(visibility);
    }
  }

  getLayerVisibility(complexLayerName: string): boolean {
    const layer = this.getLayerByName(complexLayerName);
    if (layer) {
      return layer.getVisible();
    }
  }

  public set_ZIndex(complexLayerName: string, index: number) {
    const layerByName = this.getLayerByName(complexLayerName);
    if (layerByName) {
      layerByName.setZIndex(index);
    }
  }

  /**
   * Все слоя карты включая подложку.
   */
  public allLayers() {
    return this._map.getLayers();
  }

  /**
   * @param complexLayerName Название слоя в формате 'workspace:layerName'
   */
  public getLayerByName(complexLayerName: string): BaseLayer | undefined {
    let layer;

    this.getImageLayers().forEach((bLayer: BaseLayer) => {
      const source: ImageWMS = bLayer.get('source');
      if (source && source.getParams().LAYERS === complexLayerName) {
        layer = bLayer;
      }
    });

    if (layer) {
      return layer;
    } else {
      this.logger.warn('Not found layer: ', complexLayerName);
    }
  }

  // Принудительный рефреш
  refreshLayer(complexLayerName: string) {
    const layerByName = this.getLayerByName(complexLayerName) as Layer;

    if (layerByName) {
      layerByName.getSource().refresh();
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
        .fit(bbox, {padding: padding}); // constrainResolution Ломает view на слоях с геометрией Point
  }

  /**
   * Возвращает видимые слоя. (Без подложки: TILE)
   */
  getVisibleLayers(): BaseLayer[] {
    return this.getImageLayers()
               .filter((bLayer: BaseLayer) => bLayer.getVisible());
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

  paintFeature(wfsFeature: WfsFeature) {
    const olFeature = MapperUtil.mapWfsFeatureToFeature(wfsFeature);
    if (olFeature) {
      this.draftSource.addFeature(olFeature);
    }
  }

  /**
   * Задать слой подложку.
   * Перечень доступынх подложек: tileSources
   * @param tileSource
   */
  setTileSource(tileSource: TileSource) {
    this.currentTileSource = tileSource;
    this.tileLayer.setSource(this.currentTileSource.source);
  }

  getCurrentTileSource(): TileSource {
    return this.currentTileSource;
  }

  getTileSources(): TileSource[] {
    return this.tileSources;
  }

  private async setupTileSources () {
    const environment = await getEnvironment();

    const projection = getProjection('EPSG:900913');
    const projectionExtent = projection.getExtent();
    const size = getWidth(projectionExtent) / 256;
    const resolutions = new Array(21);
    const matrixIds = new Array(21);
    for (let z = 0; z < 21; ++z) {
      // generate resolutions and matrixIds arrays for this WMTS
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = 'EPSG:900913:' + z;
    }

    if (environment.platform === 'conv') {
      this.tileSources = [
        {
          name: 'OSM',
          title: 'Open street map',
          source: new OSM(),
          thumbnail: '/assets/images/thumpnail-osm.jpg'
        },
        {
          name: 'ESRI',
          title: 'ESRI',
          source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
          }),
          thumbnail: '/assets/images/thumpnail-esri.jpg'
        }
      ];

      this.currentTileSource = this.getTileSource('OSM');
    } else {
      this.tileSources = [
        {
          name: 'OSM',
          title: 'Open street map',
          source: new OSM(),
          thumbnail: '/assets/images/thumpnail-osm.jpg'
        },
        {
          name: 'ESRI',
          title: 'ESRI',
          source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
          }),
          thumbnail: '/assets/images/thumpnail-esri.jpg'
        },
        // {
        //   name: 'SimfReg',
        //   title: 'Ортофотоплан',
        //   source: new TileWMS({
        //     urls: [await this.serverProp.wmsUrl],
        //     tileLoadFunction: this.crgImageLoadFunction,
        //     params: {
        //       LAYERS: 'substrate:T_42_6',
        //       FORMAT: 'image/vnd.jpeg-png8'
        //     }
        //   }),
        //   thumbnail: '/assets/images/thumpnail-our.jpg'
        // },
        {
          name: 'SimfRegWMTS',
          title: 'Ортофотоплан WMTS',
          source: new WMTS({
            tileLoadFunction: this.crgImageLoadFunction,
            urls: [await this.serverProp.wmtsUrl],
            tileGrid: new WMTSTileGrid({
              origin: getTopLeft(projectionExtent),
              resolutions: resolutions,
              matrixIds: matrixIds
            }),
            style: 'default',
            layer: 'substrate:T_42_6',
            matrixSet: 'EPSG:900913',
            format: 'image/png',
            projection: projection,
            wrapX: true
          }),
          thumbnail: '/assets/images/thumpnail-our.jpg'
        }
      ];

      this.currentTileSource = this.getTileSource('SimfRegWMTS');
    }
  }

  private positionToFeature(wfsFeature: WfsFeature) {
    const olFeature: Feature = MapperUtil.mapWfsFeatureToFeature(wfsFeature, true);
    if (!olFeature) {
      this.logger.warn('Incorrect feature: ', wfsFeature);
      return;
    }

    const view = this._map.getView();
    const size = this._map.getSize();

    const geometry = olFeature.getGeometry();
    switch (geometry.getType()) {
      case GeometryType.POINT:
        view.centerOn(geometry.getExtent(), size, [570, 500]);
        break;
      case GeometryType.MULTI_LINE_STRING:
        this.fitToBbox(geometry.getExtent(), [50, 650, 50, 50]);
        break;
      case GeometryType.MULTI_POLYGON:
        this.fitToBbox(geometry.getExtent(), [50, 650, 50, 50]);
        break;
      default:
        this.logger.warn('Unsupported geometry type: ', geometry.getType());
    }
  }

  private getTileSource(tileName: string) {
      const foundSource = this.tileSources.find((tSource: TileSource) => tSource.name === tileName);
      if (foundSource) {
        return foundSource;
      } else {
        throw new Error('Not found tileSource by name: ' + tileName);
      }
  }

  private crgImageLoadFunction(tile, src) {
    const client = new XMLHttpRequest();

    client.open('GET', src);
    client.responseType = 'arraybuffer';
    client.setRequestHeader('Authorization', 'Bearer ' + BEARER_TOKEN);

    client.onload = function () {
      const arrayBufferView = new Uint8Array(this.response);
      const blob = new Blob([arrayBufferView], { type: 'image/vnd.jpeg-png8' });
      const urlCreator = window.URL || (window as any).webkitURL;

      tile.getImage().src = urlCreator.createObjectURL(blob);
    };

    client.send();
  }

  /**
   * Все слоя типа 'IMAGE'
   */
  private getImageLayers(): BaseLayer[] {
    return this._map
               .getLayers().getArray()
               .filter((bLayer: BaseLayer) => bLayer.getType() === LayerType.IMAGE);
  }

}
