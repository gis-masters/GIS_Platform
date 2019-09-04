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
import {WmsService} from '../geoserver/wms.service';
import {WfsFeature} from '../geoserver/wfs.service';
import {EventEmitter, Injectable} from '@angular/core';
import {TokenStorageService} from '../token-storage.service';
import {UsedGeometryType} from './GeometryType';
import GeometryType from 'ol/geom/GeometryType';
import TileArcGISRest from 'ol/source/TileArcGISRest';

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
}

@Injectable({
  providedIn: 'root'
})
export class OpenLayersService {

  mapClick$ = new EventEmitter<number[]>();

  private currentTileSource: XYZ = new TileArcGISRest({
    urls: ['http://10.10.10.56:6080/arcgis/rest/services/SimfRegGP_Pro/OFP_80cm_Summary/MapServer']
  });

  private tileSources: TileSource[] = [
    {
      name: 'OSM',
      title: 'Open street map',
      source: new OSM(),
      thumbnail: 'osmThumbnail.png'
    },
    {
      name: 'ESRI',
      title: 'ESRI',
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
      }),
      thumbnail: 'esriThumbnail.png'
    },
    {
      name: 'SimfReg',
      title: 'Наша какаша',
      source: this.currentTileSource,
      thumbnail: 'ourThumbnail.png'
    },
  ];

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
              private wmsService: WmsService) {
    BEARER_TOKEN = tokenStorage.getAccessToken();
  }

  createMap() {
    this.draftSource = new VectorSource({
      features: []
    });

    this.view = new View({
      center: this.defaultViewPoint,
      zoom: this.defaultZoomValue
    });

    this.tileLayer = new TileLayer({
      source: this.getTileSource('SimfReg')
    });

    this._map = new Map({
      target: 'fiz-openLayer-map',
      view: this.view,
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
    const params: CrgWmsParams = {
      LAYERS: complexLayerName
    };

    const imageLayer = new ImageLayer({
      source: new ImageWMS({
        url: this.wmsService.baseUrl,
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
      layerByName.getOpacity();
    }
  }

  /**
   * Принимает список включенных слоев.
   * Проходит по всем слоям на карте проставляет true для всех переданных слоев и false для всех остальных.
   *
   * @param complexLayerNames - Навания включенных слоев.
   */
  changeLayersVisibility(complexLayerNames: string[]) {
    this.getImageLayers().forEach((bLayer: BaseLayer) => {
      const source: ImageWMS = bLayer.get('source');

      if (source && source.getParams()) {
        const layerName = source.getParams().LAYERS;
        let isExist = false;
        complexLayerNames.forEach(complexLayerName => {
          if (layerName === complexLayerName) {
            isExist = true;
          }
        });

        if (isExist) {
          bLayer.setVisible(true);
        } else {
          bLayer.setVisible(false);
        }
      }
    });
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
   * @param tileName Название положки.
   */
  setTileSource(tileName?: string) {
    this.currentTileSource = this.getTileSource(tileName);
    this.tileLayer.setSource(this.currentTileSource);
  }

  getCurrentTileSource() {
    return this.currentTileSource;
  }

  getTileSources() {
    return this.tileSources;
  }

  private positionToFeature(wfsFeature: WfsFeature) {
    const olFeature: Feature = MapperUtil.mapWfsFeatureToFeature(wfsFeature);
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

  private getTileSource(tileName?: string) {
    if (tileName) {
      const foundSource = this.tileSources.find((tSource: TileSource) => tSource.name === tileName);
      if (foundSource) {
        return foundSource.source;
      } else {
        this.logger.warn('Not found tileSource by name: ', tileName);

        return this.tileSources[0].source;
      }
    } else {
      return this.tileSources[0].source;
    }
  }

  private crgImageLoadFunction(tile, src) {
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

  /**
   * Все слоя типа 'IMAGE'
   */
  private getImageLayers(): BaseLayer[] {
    return this._map
               .getLayers().getArray()
               .filter((bLayer: BaseLayer) => bLayer.getType() === LayerType.IMAGE);
  }

}
