import {EventEmitter} from '@angular/core';
import {Map, View} from 'ol';
import {MultiPolygon} from 'ol/geom';
import {ImageWMS} from 'ol/source';
import {defaults as defaultControls, ScaleLine} from 'ol/control';
import {Coordinate} from 'ol/coordinate';
import {Circle, Fill, Stroke, Style} from 'ol/style.js';
import Feature from 'ol/Feature';
import ImageWrapper from 'ol/Image';
import Layer from 'ol/layer/Layer';
import LayerType from 'ol/LayerType';
import Tile from 'ol/Tile';
import GeometryType from 'ol/geom/GeometryType';
import TileLayer from 'ol/layer/Tile';
import BaseLayer from 'ol/layer/Base';
import ImageLayer from 'ol/layer/Image';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Draw, Modify} from 'ol/interaction';
import {ModifyEvent} from 'ol/interaction/Modify';
import {DrawEvent} from 'ol/interaction/Draw';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import TileImage from 'ol/source/TileImage';
import { get as getProjection } from 'ol/proj';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import WMTS from 'ol/source/WMTS';
import {getTopLeft, getWidth} from 'ol/extent';
import WMTSTileGrid from 'ol/tilegrid/WMTS';

import {MapperUtil} from './MapperUtil';
import {WfsFeature} from '../geoserver/wfs-models';
import {serverProperties} from '../server-properties.service';
import {tokenStorageService} from '../token-storage.service';
import {CrgLayer} from '../../stores/ProjectsList.store';
import {services} from '../services';
import {reaction} from 'mobx';
import {baseMapsStore} from '../../stores/BaseMaps.store';
import {CrgBaseMap, SourceType} from '../crg/base-maps.models';

export let BEARER_TOKEN = '';

// WMS request parameters. At least a LAYERS param is required.
export interface CrgWmsParams {
  LAYERS: string;
  FORMAT?: string;
}

class OpenLayersService {
  private static _instance: OpenLayersService;

  constructor() {
    reaction(() => baseMapsStore.getCurrentBaseMap, currentBaseMap => {
      if (currentBaseMap) {
        const tileSource = this.prepareTileSource(currentBaseMap);
        if (tileSource) {
          this.baseMapLayer.setVisible(true);
          this.baseMapLayer.setSource(tileSource);
        } else {
          this.baseMapLayer.setVisible(false);
        }
      } else {
        this.baseMapLayer.setVisible(false);
      }
    });
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  mapClick$ = new EventEmitter<Coordinate>();

  // Подлдожка
  private baseMapLayer = new TileLayer();

  private _map: Map;
  private view: View;
  private draftSource: VectorSource;
  private draftSourceModify?: Modify;
  private draftSourceDraw?: Draw;
  private drawHandler: (e: DrawEvent) => void;
  private isModifying = false;
  private pickHandler: (e: MapBrowserEvent) => void;

  // Кол-во десятичных в координатах
  private PRECISION = 4;

  // Hit-detection tolerance. Pixels inside the square around the given position will be checked for features.
  private HIT_TOLERANCE = 10;

  // ZIndex чернового слоя который используется для подсвечивания объектов
  private DRAFT_LAYER_ZINDEX = 10000;

  // Default view options
  private defaultZoomValue = 9;
  private defaultViewPoint = [3844444, 5644444];
  private defaultOpacity = 0.7;

  async createMap() {
    BEARER_TOKEN = tokenStorageService.getAccessToken();

    this.draftSource = new VectorSource({
      features: []
    });

    this.draftSourceModify = new Modify({source: this.draftSource});

    this.view = new View({
      center: this.defaultViewPoint,
      zoom: this.defaultZoomValue,
      minZoom: 3,
      maxZoom: 19
    });

    this._map = new Map({
      target: 'fiz-openLayer-map',
      view: this.view,
      controls: defaultControls().extend([
        new ScaleLine()
      ]),
      layers: [
        this.baseMapLayer,
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
            }),
            image: new Circle({
              radius: 7,
              fill: new Fill({
                color: 'rgba(255, 255, 255, 0.3)'
              })
            })
          })
        })
      ]
    });

    this._map.on('movestart', () => {
      window.dispatchEvent(new Event('resize'));
    });

    this._map.on('singleclick', event => {
      if (event.coordinate) {
        if (!this.isModifying) {
          this.mapClick$.emit(event.coordinate);
        }
      } else {
        console.warn('No coordinate', event.coordinate);
        this.mapClick$.emit([0, 0]);
      }
    });
  }

  async addLayerToMap(layer: CrgLayer) {
    const params: CrgWmsParams = {
      LAYERS: layer.complexName,
      FORMAT: 'image/vnd.jpeg-png8'
    };

    const imageLayer = new ImageLayer({
      source: new ImageWMS({
        url: await serverProperties.wmsUrl,
        params: params,
        imageLoadFunction: this.crgImageLoadFunction,
        ratio: 1,
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
      }),
      opacity: layer.transparency ? (layer.transparency / 100) : this.defaultOpacity
    });

    imageLayer.setVisible(layer.enabled);

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
      services.logger.warn('Not found layer: ', complexLayerName);
    }
  }

  // Принудительный рефреш
  refreshLayer(complexLayerName: string) {
    const layerByName = this.getLayerByName(complexLayerName) as Layer;

    if (layerByName) {
      layerByName.getSource().refresh();
    }
  }

  // Очистить карту от слоя, который отображал объект.
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

  drawPolygon(coordinates: Coordinate[][][]) {
    const feature: WfsFeature = {
      type: 'Feature',
      geometry: {
        type: GeometryType.MULTI_POLYGON,
        coordinates: coordinates
      },
      id: '',
      geometry_name: '',
      properties: ''
    };

    this.paintFeature(feature);
  }

  fitToBbox(bbox: number[], padding: [number, number, number, number]) {
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

  getBufferByCoordinates(pos: Coordinate) {
    const round = (n: number) => Number(n.toFixed(this.PRECISION));
    const res = round((this.getResolution() * this.HIT_TOLERANCE));
    pos = pos.map(round);

    const x1 = pos[0] + res / 2;
    const x2 = x1 - res;
    const y1 = pos[1] + res / 2;
    const y2 = y1 - res;

    const buffer = [[[
      [x1, y1],
      [x2, y1],
      [x2, y2],
      [x1, y2],
      [x1, y1]
    ]]];

    return new MultiPolygon(buffer);
  }

  paintFeature(wfsFeature: WfsFeature) {
    const olFeature = MapperUtil.mapWfsFeatureToFeature(wfsFeature);
    if (olFeature) {
      this.draftSource.addFeature(olFeature);
    }
  }

  enableDraftModification (handler: (e: ModifyEvent) => void) {
    this.isModifying = true;
    this.draftSourceModify.on('modifyend', handler);
    this._map.addInteraction(this.draftSourceModify);
  }

  disableDraftModification (handler: (e: ModifyEvent) => void) {
    this.isModifying = false;
    this.draftSourceModify.un('modifyend', handler);
    this._map.removeInteraction(this.draftSourceModify);
  }

  draw (geometryType: GeometryType, handler: (e: DrawEvent) => void) {
    this.draftSourceDraw = new Draw({
      source: this.draftSource,
      type: geometryType
    });

    this.drawHandler = (e: DrawEvent) => {
      this.drawOff();
      setTimeout(() => handler(e), 0);
    };

    this.draftSourceDraw.on('drawend', this.drawHandler);
    this._map.addInteraction(this.draftSourceDraw);
  }

  drawOff () {
    if (this.draftSourceDraw) {
      this.draftSourceDraw.un('drawend', this.drawHandler);
      this._map.removeInteraction(this.draftSourceDraw);
      delete this.draftSourceDraw;
    }
  }

  pickPoint (handler: (e: MapBrowserEvent) => void) {
    this.pickHandler = (e) => {
      handler(e);
      this.pickingOff();
    };

    this._map.once('singleclick', this.pickHandler);
  }

  pickingOff () {
    if (this.pickHandler) {
      this._map.un('singleclick', this.pickHandler);
      delete this.pickHandler;
    }
  }

  private positionToFeature(wfsFeature: WfsFeature) {
    const olFeature: Feature = MapperUtil.mapWfsFeatureToFeature(wfsFeature, true);
    if (!olFeature) {
      services.logger.warn('Incorrect feature: ', wfsFeature);
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
        services.logger.warn('Unsupported geometry type: ', geometry.getType());
    }
  }

  private crgImageLoadFunction(tile: Tile | ImageWrapper, src: string) {
    const client = new XMLHttpRequest();

    client.open('GET', src);
    client.responseType = 'arraybuffer';
    client.setRequestHeader('Authorization', 'Bearer ' + BEARER_TOKEN);

    client.onload = function () {
      const arrayBufferView = new Uint8Array(this.response);
      const blob = new Blob([arrayBufferView], { type: 'image/vnd.jpeg-png8' });

      // Ошибка в типах openlayers
      // @ts-ignore
      (tile.getImage() as HTMLImageElement).src = URL.createObjectURL(blob);
    };

    client.send();
  }

  /**
   * Все слои типа 'IMAGE'
   */
  private getImageLayers(): BaseLayer[] {
    return this._map
               .getLayers().getArray()
               .filter((bLayer: BaseLayer) => bLayer.getType() === LayerType.IMAGE);
  }

  private prepareTileSource(baseMap: CrgBaseMap): TileImage | undefined {
    if (!baseMap || !baseMap.type) {
      return undefined;
    }

    switch (baseMap.type) {
      case SourceType.OSM:  return new OSM();
      case SourceType.WMTS: return this.prepareWMTS(baseMap);
      case SourceType.XYZ:
        if (baseMap.url) {
          return new XYZ({
            url: baseMap.url
          });
        } else {
          return new XYZ();
        }
      default:
        return undefined;
    }
  }

  private prepareWMTS(baseMap: CrgBaseMap): WMTS {
    try {
      const projection = getProjection(baseMap.projection);
      const projectionExtent = projection.getExtent();
      const size = getWidth(projectionExtent) / baseMap.size;
      const resolutions = new Array(baseMap.resolution);
      const matrixIds = new Array(baseMap.matrixIds);
      for (let z = 0; z < baseMap.resolution; ++z) {
        // generate resolutions and matrixIds arrays for this WMTS
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = baseMap.projection + ':' + z;
      }

      return new WMTS({
        tileLoadFunction: this.crgImageLoadFunction,
        urls: [baseMap.url],
        tileGrid: new WMTSTileGrid({
          origin: getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds
        }),
        style: baseMap.style,
        layer: baseMap.layerName,
        matrixSet: baseMap.projection,
        format: baseMap.format,
        projection: projection,
        wrapX: true
      });
    } catch (e) {
      return undefined;
    }
  }
}

export const openLayersService = OpenLayersService.instance;
