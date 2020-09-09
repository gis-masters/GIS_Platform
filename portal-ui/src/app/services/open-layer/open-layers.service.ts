import { EventEmitter } from '@angular/core';
import jsPDF from 'jspdf';
import { chunk } from 'lodash';
import { reaction } from 'mobx';
import { Map, MapBrowserEvent, View } from 'ol';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import { Coordinate } from 'ol/coordinate';
import { Extent, getTopLeft, getWidth } from 'ol/extent';
import Feature from 'ol/Feature';
import { MultiPolygon } from 'ol/geom';
import GeometryType from 'ol/geom/GeometryType';
import ImageWrapper from 'ol/Image';
import { Draw, Modify } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import { ModifyEvent } from 'ol/interaction/Modify';
import { Image as ImageLayer, Layer, Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import BaseLayer from 'ol/layer/Base';
import { get as getProjection } from 'ol/proj';
import { ImageWMS, OSM, TileArcGISRest, TileImage, Vector as VectorSource, WMTS, XYZ } from 'ol/source';
import { Options as XYZOptions } from 'ol/source/XYZ';
import { Circle, Fill, Stroke, Style } from 'ol/style.js';
import Tile from 'ol/Tile';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { CrgLayer } from '../../services/crg/projects.models';
import { baseMapsStore } from '../../stores/BaseMaps.store';
import { printSettings } from '../../stores/PrintSettings.store';
import { CrgBaseMap, SourceType } from '../crg/base-maps.models';
import {
  CrgProjection,
  getFeatureProjection,
  olProjection,
  transform,
  transformGeometry
} from '../geoserver/projections.service';
import { WfsFeature } from '../geoserver/wfs-models';
import { serverProperties } from '../server-properties.service';
import { services } from '../services';

import { MapperUtil } from './MapperUtil';

// WMS request parameters. At least a LAYERS param is required.
export interface CrgWmsParams {
  LAYERS: string;
  FORMAT?: string;
}

export interface CrgAdditionalLayerInfo {
  isUserLayer: boolean;
}

class OpenLayersService {
  private static _instance: OpenLayersService;

  private CRG_INFO_PROP_NAME = 'crgInfo';

  constructor() {
    reaction(
      () => baseMapsStore.currentBaseMap,
      currentBaseMap => {
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
      },
      { fireImmediately: true }
    );
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  mapClick$ = new EventEmitter<Coordinate>();

  // Подлдожка
  private baseMapLayer = new TileLayer();

  private _map: Map;
  private view: View;
  private markersSource: VectorSource;
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
  private MARKERS_LAYER_ZINDEX = 10100;

  // Default view options
  private defaultZoomValue = 9;
  private defaultViewPoint = [3844444, 5644444];

  async createMap() {
    this.markersSource = new VectorSource({
      features: []
    });

    this.draftSource = new VectorSource({
      features: []
    });

    this.draftSourceModify = new Modify({ source: this.draftSource });

    this.view = new View({
      center: this.defaultViewPoint,
      zoom: this.defaultZoomValue,
      minZoom: 3,
      maxZoom: 19
    });

    this._map = new Map({
      target: 'fiz-openLayer-map',
      view: this.view,
      controls: defaultControls().extend([new ScaleLine()]),
      layers: [
        this.baseMapLayer,
        new VectorLayer({
          source: this.markersSource,
          zIndex: this.MARKERS_LAYER_ZINDEX
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
            }),
            image: new Circle({
              radius: 7,
              fill: new Fill({
                color: 'rgba(255, 55, 55, 0.8)'
              })
            })
          })
        })
      ]
    });

    this._map.on('singleclick', event => {
      if (event.coordinate) {
        if (!this.isModifying && !this.draftSourceDraw) {
          this.mapClick$.emit(event.coordinate);
        }
      } else {
        console.warn('No coordinate', event.coordinate);
        this.mapClick$.emit([0, 0]);
      }
    });
  }

  destroyMap() {
    this.drawOff();
    this.pickingOff();
    this._map.unset('target');
    delete this._map;
    delete this.view;
  }

  hideUserLayers() {
    this.getUserLayers().forEach(layer => {
      layer.setVisible(false);
    });
  }

  addExternalLayers(layers: CrgLayer[], zIndex: number) {
    layers.forEach(layer => {
      const layerOnMap = this.getLayerByName(layer.internalName);
      if (layerOnMap) {
        layerOnMap.setVisible(true);
        layerOnMap.setOpacity(layer.transparency / 100);
        layerOnMap.setZIndex(zIndex);
      } else {
        const tileLayer = new TileLayer({
          source: new TileArcGISRest({
            url: layer.dataSourceUri,
            params: {
              LAYERS: layer.internalName
            },
            tileLoadFunction: this.arcGisMapServerLoadFunction
          }),
          visible: true,
          opacity: layer.transparency / 100,
          zIndex: zIndex
        });

        const props: { [key: string]: CrgAdditionalLayerInfo } = {
          [this.CRG_INFO_PROP_NAME]: { isUserLayer: true }
        };

        tileLayer.setProperties(props);

        this._map.addLayer(tileLayer);
      }
    });
  }

  async addLayers(layers: CrgLayer[], zIndex: number, opacity: number) {
    const resultName = this.calcLayerName(layers);

    const layerOnMap = this.getLayerByName(resultName);
    if (layerOnMap) {
      layerOnMap.setVisible(true);
      layerOnMap.setOpacity(opacity);
      layerOnMap.setZIndex(zIndex);
    } else {
      const params: CrgWmsParams = {
        LAYERS: resultName,
        FORMAT: 'image/vnd.jpeg-png8'
      };

      const imageLayer = new ImageLayer({
        source: new ImageWMS({
          url: await serverProperties.wmsUrl,
          params: params,
          imageLoadFunction: this.crgImageLoadFunction,
          ratio: 1,
          serverType: 'geoserver',
          crossOrigin: 'anonymous'
        }),
        visible: true,
        opacity,
        zIndex
      });

      const props: { [key: string]: CrgAdditionalLayerInfo } = {
        [this.CRG_INFO_PROP_NAME]: { isUserLayer: true }
      };

      imageLayer.setProperties(props);

      this._map.addLayer(imageLayer);
    }
  }

  private calcLayerName(layers: CrgLayer[]) {
    return layers.map(layer => layer.complexName).join(',');
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

  set_ZIndex(complexLayerName: string, index: number) {
    const layerByName = this.getLayerByName(complexLayerName);
    if (layerByName) {
      layerByName.setZIndex(index);
    }
  }

  /**
   * @param complexLayerName Название слоя в формате 'workspace:layerName'
   */
  getLayerByName(complexLayerName: string): ImageLayer | undefined {
    return this.getUserLayers().find(layer => {
      const source = layer.getSource() as ImageWMS;

      return source && source.getParams().LAYERS === complexLayerName;
    });
  }

  // Принудительный рефреш
  refreshLayers() {
    this.getUserLayers().forEach(layer => (layer as Layer).getSource().refresh());
  }

  // Очистить карту от слоя, который отображал объект.
  clearDraft() {
    const collection = this.draftSource.getFeaturesCollection();
    const count = collection ? collection.getLength() : 0;
    this.draftSource.clear(count > 10);
  }

  // Очистить карту от всех слоёв.
  clearMap() {
    this.getUserLayers().forEach(layer => this._map.removeLayer(layer));
  }

  /**
   * Подсвечивает обьект. (очищает черновой слой)
   */
  highlightFeature(features: WfsFeature | WfsFeature[], projection?: CrgProjection) {
    const featuresInOlProjection: WfsFeature[] = [].concat(features).map((feature: WfsFeature) => ({
      ...feature,
      geometry: transformGeometry(feature.geometry, projection || getFeatureProjection(feature), olProjection)
    }));

    this.clearDraft();

    const olFeatures = featuresInOlProjection.map(feature => MapperUtil.mapWfsFeatureToFeature(feature));
    this.draftSource.addFeatures(olFeatures);
  }

  showSelectionMarker(coordinates: Coordinate[][][]) {
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

    const olFeature = MapperUtil.mapWfsFeatureToFeature(feature);
    if (olFeature) {
      this.draftSource.addFeature(olFeature);

      setTimeout(() => {
        try {
          this.draftSource.removeFeature(olFeature);
        } catch (e) {}
      }, 500);
    }
  }

  fitToBbox(bbox: Extent, padding: [number, number, number, number]) {
    this._map.getView().fit(bbox, { padding }); // constrainResolution Ломает view на слоях с геометрией Point
  }

  getResolution() {
    return this.view.getResolution();
  }

  getBufferByCoordinates(pos: Coordinate) {
    const round = (n: number) => Number(n.toFixed(this.PRECISION));
    const res = round(this.getResolution() * this.HIT_TOLERANCE);
    pos = pos.map(round);

    const x1 = pos[0] + res / 2;
    const x2 = x1 - res;
    const y1 = pos[1] + res / 2;
    const y2 = y1 - res;

    const buffer = [
      [
        [
          [x1, y1],
          [x2, y1],
          [x2, y2],
          [x1, y2],
          [x1, y1]
        ]
      ]
    ];

    return new MultiPolygon(buffer);
  }

  enableDraftModification(handler: (e: ModifyEvent) => void) {
    this.isModifying = true;
    this.draftSourceModify.on('modifyend', handler);
    this._map.addInteraction(this.draftSourceModify);
  }

  disableDraftModification(handler: (e: ModifyEvent) => void) {
    this.isModifying = false;
    this.draftSourceModify.un('modifyend', handler);
    this._map.removeInteraction(this.draftSourceModify);
  }

  draw(geometryType: GeometryType, handler: (e: DrawEvent) => void) {
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

  drawOff() {
    if (this.draftSourceDraw) {
      this.draftSourceDraw.un('drawend', this.drawHandler);
      this._map.removeInteraction(this.draftSourceDraw);
      delete this.draftSourceDraw;
    }
  }

  pickPoint(handler: (e: MapBrowserEvent) => void) {
    this.pickHandler = e => {
      handler(e);
      this.pickingOff();
    };

    this._map.once('singleclick', this.pickHandler);
  }

  pickingOff() {
    if (this.pickHandler) {
      this._map.un('singleclick', this.pickHandler);
      delete this.pickHandler;
    }
  }

  positionToFeature(wfsFeature: WfsFeature, projection?: CrgProjection) {
    projection = projection || getFeatureProjection(wfsFeature);
    const olFeature: Feature = MapperUtil.mapWfsFeatureToFeature(wfsFeature, true);
    if (!olFeature) {
      services.logger.warn('Incorrect feature: ', wfsFeature);
      return;
    }

    const view = this._map.getView();
    const size = this._map.getSize();

    const geometry = olFeature.getGeometry();
    const extent = chunk(geometry.getExtent(), 2)
      .map(coord => transform(projection, olProjection, coord))
      .flat() as Extent;

    switch (geometry.getType()) {
      case GeometryType.POINT:
        view.centerOn(extent, size, [size[0] / 2, size[1] / 2]);
        break;
      case GeometryType.MULTI_LINE_STRING:
        this.fitToBbox(extent, [50, 50, 50, 50]);
        break;
      case GeometryType.MULTI_POLYGON:
        this.fitToBbox(extent, [50, 50, 50, 50]);
        break;
      default:
        services.logger.error('Unsupported geometry type: ', geometry.getType());
    }
  }

  print() {
    const size = this._map.getSize();
    const viewResolution = this._map.getView().getResolution();
    const { pageWidth, pageHeight, resolution, pageFormat } = printSettings;
    const width = Math.round((pageWidth * resolution) / 25.4);
    const height = Math.round((pageHeight * resolution) / 25.4);

    printSettings.setPrintingStatus(true);

    this._map.once('rendercomplete', () => {
      const mapCanvas = document.createElement('canvas');
      mapCanvas.width = width;
      mapCanvas.height = height;
      const mapContext = mapCanvas.getContext('2d');
      document.querySelectorAll('.ol-layer canvas').forEach((canvas: HTMLCanvasElement) => {
        if (canvas.width > 0) {
          const opacity = canvas.parentElement.style.opacity;
          mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
          const transform = canvas.style.transform;
          // Get the transform parameters from the style's transform matrix
          const matrix = transform
            .match(/^matrix\(([^\(]*)\)$/)[1]
            .split(',')
            .map(Number);
          // Apply the transform to the export map context
          CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
          mapContext.drawImage(canvas, 0, 0);
        }
      });
      const pdf = new jsPDF(printSettings.orientation, undefined, pageFormat.id);
      pdf.addImage(mapCanvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, pageWidth, pageHeight);
      pdf.save('map.pdf');
      // Reset original map size
      this._map.setSize(size);
      this._map.getView().setResolution(viewResolution);

      printSettings.setPrintingStatus(false);
    });

    // Set print size
    this._map.setSize([width, height]);
    const scaling = Math.min(width / size[0], height / size[1]);
    this._map.getView().setResolution(viewResolution / scaling);
  }

  drawMarkers(features: Feature[]) {
    this.markersSource.addFeatures(features);
  }

  clearMarkers() {
    this.markersSource.clear();
  }

  private async crgImageLoadFunction(tile: Tile | ImageWrapper, url: string) {
    let data: Blob | any;
    try {
      data = await services.httpq.get<Blob>(url, { responseType: 'blob' });
    } catch (errorResponse) {
      data = errorResponse.error;
    }
    const blob = new Blob([data], { type: 'image/vnd.jpeg-png8' });
    ((tile as ImageWrapper).getImage() as HTMLImageElement).src = URL.createObjectURL(blob);
  }

  private async arcGisMapServerLoadFunction(tile: Tile | ImageWrapper, url: string) {
    let data: Blob | any;

    const replacedUrl = url
      .replace('256%2C256', '1024%2C1024')
      .replace('BBOXSR=3857', 'bboxSR=102100')
      .replace('IMAGESR=3857', 'imageSR=102100');

    try {
      const response = await fetch(replacedUrl);
      if (response.ok) {
        data = await response.blob();
      }
    } catch (errorResponse) {
      data = errorResponse.error;
    }

    const blob = new Blob([data], { type: 'image/vnd.jpeg-png8' });
    ((tile as ImageWrapper).getImage() as HTMLImageElement).src = URL.createObjectURL(blob);
  }

  /**
   * Все слои которые являются пользовательскими
   */
  private getUserLayers(): ImageLayer[] {
    return this._map
      .getLayers()
      .getArray()
      .filter(layer => this.isUserLayer(layer)) as ImageLayer[];
  }

  private prepareTileSource(baseMap: CrgBaseMap): TileImage | undefined {
    if (!baseMap || !baseMap.type) {
      return undefined;
    }

    switch (baseMap.type) {
      case SourceType.OSM:
        return new OSM();
      case SourceType.WMTS:
        return this.prepareWMTS(baseMap);
      case SourceType.XYZ:
        const options: XYZOptions = { crossOrigin: 'Anonymous' };
        if (baseMap.url) {
          options.url = baseMap.url;
        }

        return new XYZ(options);
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
        wrapX: true,
        crossOrigin: 'Anonymous'
      });
    } catch (e) {
      return undefined;
    }
  }

  private isUserLayer(layer: BaseLayer): boolean {
    const crgInfo = layer.getProperties()[this.CRG_INFO_PROP_NAME];
    if (crgInfo) {
      return crgInfo.isUserLayer;
    } else {
      return false;
    }
  }
}

export const openLayersService = OpenLayersService.instance;
