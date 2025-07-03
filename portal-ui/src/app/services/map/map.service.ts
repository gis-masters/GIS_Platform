import { reaction } from 'mobx';
import { debounce } from 'lodash';
import { Map, View } from 'ol';
import { defaults as defaultControls } from 'ol/control';
import { Extent, getTopLeft, getWidth } from 'ol/extent';
import Feature from 'ol/Feature';
import { SimpleGeometry } from 'ol/geom';
import ImageWrapper from 'ol/Image';
import { DoubleClickZoom } from 'ol/interaction';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import BaseLayer from 'ol/layer/Base';
import ImageLayer from 'ol/layer/Image';
import { get as getProjection } from 'ol/proj';
import { ImageWMS, OSM, TileArcGISRest, TileImage, TileWMS, Vector as VectorSource, WMTS, XYZ } from 'ol/source';
import ImageSource from 'ol/source/Image';
import TileSource from 'ol/source/Tile';
import { Options as TileWMSOptions } from 'ol/source/TileWMS';
import { ServerType } from 'ol/source/wms';
import Tile from 'ol/Tile';
import WMTSTileGrid from 'ol/tilegrid/WMTS';

import { extractFeatureIdsFromAttributesFilter } from '../../components/Attributes/Attributes.utils';
import { attributesTableStore } from '../../stores/AttributesTable.store';
import { basemapsStore } from '../../stores/Basemaps.store';
import { mapStore } from '../../stores/Map.store';
import { route } from '../../stores/Route.store';
import { Emitter } from '../common/Emitter';
import { communicationService } from '../communication.service';
import { Basemap, SourceType } from '../data/basemaps/basemaps.models';
import { defaultOlProjectionCode, Projection } from '../data/projections/projections.models';
import { getFeatureProjection, getOlProjection } from '../data/projections/projections.service';
import { Schema } from '../data/schema/schema.models';
import { applyView } from '../data/schema/schema.utils';
import { GeometryType, WfsFeature } from '../geoserver/wfs/wfs.models';
import { getFeatureExtent, mergeExtents } from '../geoserver/wfs/wfs.util';
import { wmsClient } from '../geoserver/wms/wms.client';
import { getMap } from '../geoserver/wms/wms.service';
import { CrgExternalLayer, CrgLayer, CrgLayerType } from '../gis/layers/layers.models';
import { getLayerSchema } from '../gis/layers/layers.service';
import { ScaleLine } from '../ol/ScaleLine';
import { services } from '../services';
import { transformExtent } from '../util/coordinates-transform.util';
import { buildCql } from '../util/cql/buildCql';
import { concatCql } from '../util/cql/concatCql';
import { Mime } from '../util/Mime';
import { notFalsyFilter } from '../util/NotFalsyFilter';
import { mapDrawService } from './draw/map-draw.service';
import { CrgAdditionalLayerInfo, CrgWmsParams, CursorType, LayerAdditionalProps, MapPosition } from './map.models';

class MapService {
  private static _instance: MapService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  mapMoved = new Emitter<MapPosition>();
  mapCreated = new Emitter();
  zoomChanged = new Emitter<number>();

  view?: View;
  scaleLine?: ScaleLine;

  private _map?: Map;

  private readonly isTiledWms: boolean;
  private readonly debouncedZoomEvent: () => void;

  // Подложка
  private basemapLayer = new TileLayer();

  private markersSource?: VectorSource<Feature<SimpleGeometry>>;
  private zoom?: number;
  private center?: number[];

  // Кол-во десятичных в координатах
  readonly PRECISION = 4;

  readonly DRAFT_LAYER_Z_INDEX = 10_000;
  readonly MEASURE_LAYER_ZINDEX = 10_100;
  readonly LABELS_LAYER_ZINDEX = 10_150;
  readonly MARKERS_LAYER_ZINDEX = 10_200;

  // Default view options
  private defaultZoomValue = 9;
  private defaultViewPoint = [3_844_444, 5_644_444];

  constructor() {
    reaction(
      () => basemapsStore.currentBasemap,
      currentBaseMap => {
        if (currentBaseMap) {
          const tileSource = this.prepareTileSource(currentBaseMap);
          if (tileSource) {
            this.basemapLayer.setVisible(true);
            this.basemapLayer.setSource(tileSource);
          } else {
            this.basemapLayer.setVisible(false);
          }
        } else {
          this.basemapLayer.setVisible(false);
        }
      },
      { fireImmediately: true }
    );

    this.debouncedZoomEvent = debounce(() => this.zoomChanged.emit(this.view?.getZoom()), 100);

    this.isTiledWms = Boolean(localStorage.getItem('tiledWms'));
  }

  async waitForMap(): Promise<void> {
    return new Promise(resolve => {
      if (this.mapInited) {
        resolve();
      } else {
        this.mapCreated.once(() => {
          resolve();
        });
      }
    });
  }

  createMap(): void {
    this.markersSource = new VectorSource<Feature<SimpleGeometry>>({
      features: []
    });

    if (route.queryParams.zoom && route.queryParams.center) {
      this.zoom = Number(route.queryParams.zoom);
      this.center = [Number(route.queryParams.center.split(',')[0]), Number(route.queryParams.center.split(',')[1])];
    }

    this.view = new View({
      center:
        this.center && !Number.isNaN(this.center[0]) && !Number.isNaN(this.center[1])
          ? this.center
          : this.defaultViewPoint,
      zoom: this.zoom && !Number.isNaN(this.zoom) ? this.zoom : this.defaultZoomValue,
      minZoom: 3,
      maxZoom: 25
    });

    this.scaleLine = new ScaleLine({ bar: true, text: true, minWidth: 100 });

    this.map = new Map({
      target: 'fiz-openLayer-map',
      view: this.view,
      controls: defaultControls().extend([this.scaleLine]),
      layers: [
        this.basemapLayer,
        new VectorLayer({
          source: this.markersSource,
          zIndex: this.MARKERS_LAYER_ZINDEX,
          properties: { name: 'markers' }
        })
      ]
    });

    // Удалим с карты событие зума по-умоланию по двойному клику(DoubleClickZoom).
    const interactions = this.map.getInteractions();
    for (let i = 0; i < interactions.getLength(); i++) {
      const interaction = interactions.item(i);
      if (interaction instanceof DoubleClickZoom) {
        this.map.removeInteraction(interaction);
        break;
      }
    }

    this.map.on('moveend', () => {
      const view = this.map?.getView();
      const center = view?.getCenter();
      const zoom = view?.getZoom();

      if (center && zoom) {
        this.mapMoved.emit({ zoom, center });
      }
    });

    this.view.on('change:resolution', this.debouncedZoomEvent);
    this.debouncedZoomEvent();
    this.mapCreated.emit();
  }

  destroyMap() {
    if (!this.map) {
      throw new Error('Невозможно выполнить destroyMap. Карта не создана');
    }
    communicationService.beforeMapDestroy.emit();
    mapDrawService.drawOff();
    this.map.unset('target');
    delete this._map;
    delete this.view;
  }

  hideUserLayers() {
    this.getUserLayers()?.forEach(layer => {
      layer.setVisible(false);
    });
  }

  getCurrentExtend(): Extent {
    const extent = this.view?.calculateExtent();

    return extent === undefined ? [0, 0, 0, 0] : extent;
  }

  addExternalGeoserverLayer(extLayer: CrgExternalLayer, zIndex: number) {
    this.throwIfMapNotCreated();

    const { tableName, transparency = 100, dataSourceUri } = extLayer;
    const layerOnMap = this.getLayerByName(tableName);
    if (layerOnMap) {
      layerOnMap.setVisible(true);
      layerOnMap.setOpacity(transparency / 100);
      layerOnMap.setZIndex(zIndex);

      return;
    }

    const params: CrgWmsParams = {
      LAYERS: tableName,
      FORMAT: 'image/png8' // TODO: Вынести в настройки слоя
    };

    const commonLayerParams = {
      visible: true,
      opacity: transparency / 100,
      zIndex
    };

    const commonWMSParams = {
      url: dataSourceUri,
      params,
      serverType: 'geoserver' as ServerType,
      crossOrigin: 'anonymous'
    };

    const layer: ImageLayer<ImageSource> = new ImageLayer({
      source: new ImageWMS({
        imageLoadFunction: this.externalGisMapServerLoadFunction,
        ...commonWMSParams,
        ratio: 1
      }),
      ...commonLayerParams
    });

    const props: LayerAdditionalProps = { crgInfo: { isUserLayer: true } };

    layer.setProperties(props);

    this.map.addLayer(layer);
  }

  addExternalLayer(layer: CrgExternalLayer, zIndex: number) {
    this.throwIfMapNotCreated();

    const { tableName, transparency, dataSourceUri } = layer;
    const layerOnMap = this.getLayerByName(layer.tableName);
    if (layerOnMap) {
      layerOnMap.setVisible(true);
      layerOnMap.setOpacity((transparency ?? 100) / 100);
      layerOnMap.setZIndex(zIndex);

      return;
    }

    const tileLayer = new TileLayer({
      source: new TileArcGISRest({
        url: dataSourceUri,
        params: {
          LAYERS: tableName
        },
        tileLoadFunction: this.externalGisMapServerLoadFunction
      }),
      visible: true,
      opacity: (transparency ?? 100) / 100,
      zIndex: zIndex
    });

    const props: LayerAdditionalProps = {
      crgInfo: { isUserLayer: true }
    };

    tileLayer.setProperties(props);

    this.map.addLayer(tileLayer);
  }

  addNspdExternalLayer(layer: CrgExternalLayer, zIndex: number) {
    this.throwIfMapNotCreated();

    const { tableName, transparency, dataSourceUri } = layer;
    const layerOnMap = this.getLayerByName(tableName);
    if (layerOnMap) {
      layerOnMap.setVisible(true);
      layerOnMap.setOpacity((transparency ?? 100) / 100);
      layerOnMap.setZIndex(zIndex);

      return;
    }

    const sourceParams = {
      LAYERS: undefined,
      F: undefined,
      FORMAT: undefined,
      TRANSPARENT: undefined,
      SIZE: undefined,
      BBOXSR: undefined,
      IMAGESR: undefined,
      DPI: undefined
    };

    const tileLayer = new TileLayer({
      source: new TileArcGISRest({
        url: dataSourceUri,
        params: sourceParams,
        tileLoadFunction: undefined
      }),
      visible: true,
      opacity: (transparency ?? 100) / 100,
      zIndex: zIndex
    });

    const props: LayerAdditionalProps = {
      crgInfo: { isUserLayer: true }
    };

    tileLayer.setProperties(props);

    this.map.addLayer(tileLayer);
  }

  async addLayer(layer: CrgLayer, zIndex: number, opacity: number): Promise<void> {
    this.throwIfMapNotCreated();

    const { tableName, complexName, styleName, view, type } = layer;
    if (!tableName || !complexName) {
      throw new Error('Некорректный слой, не заданы: tableName, complexName');
    }

    const params: CrgWmsParams = {
      STYLES: type === CrgLayerType.RASTER ? 'raster' : styleName,
      LAYERS: complexName,
      FORMAT: Mime.VND_JPEG_PNG8
    };

    if (type === CrgLayerType.VECTOR) {
      const schema = await getLayerSchema(layer);
      if (!schema) {
        throw new Error(`Не удалось получить схему слоя ${layer.title}`);
      }

      const { definitionQuery }: Schema = applyView(schema, view);
      if (definitionQuery) {
        params.CQL_FILTER = definitionQuery;
      }
    }

    const [featureIds, filter, featureIdsNegative] = extractFeatureIdsFromAttributesFilter(
      attributesTableStore.getLayerFilter(tableName),
      layer
    );

    if (attributesTableStore.isLayerFiltered(layer)) {
      if (Object.keys(filter).length) {
        params.CQL_FILTER = concatCql(buildCql(filter), params.CQL_FILTER);
      }

      if (featureIds.length) {
        params.featureId = featureIds.join(',');

        if (featureIdsNegative) {
          params.featureIdsNegative = 'true';
        }
      }
    }

    const commonLayerParams = {
      visible: true,
      opacity,
      zIndex
    };

    const commonWMSParams: Pick<TileWMSOptions, 'url' | 'params' | 'serverType' | 'crossOrigin'> = {
      url: wmsClient.getWmsUrl(),
      params,
      serverType: 'geoserver',
      crossOrigin: 'anonymous'
    };

    const olLayer: ImageLayer<ImageSource> | TileLayer<TileSource> = this.isTiledWms
      ? new TileLayer({
          source: new TileWMS({ tileLoadFunction: this.crgLayersLoadFunction, ...commonWMSParams }),
          ...commonLayerParams
        })
      : new ImageLayer({
          source: new ImageWMS({ imageLoadFunction: this.crgLayersLoadFunction, ...commonWMSParams, ratio: 1 }),
          ...commonLayerParams
        });

    const props: LayerAdditionalProps = { crgInfo: { isUserLayer: true } };

    const oldLayer = this.getLayerByName(complexName);
    if (oldLayer) {
      this.map.removeLayer(oldLayer);
    }

    olLayer.setProperties(props);
    this.map.addLayer(olLayer);
  }

  refreshAllLayers() {
    this.getUserLayers().forEach(layer => layer.getSource()?.refresh());
  }

  hideSystemLayer(name: string) {
    this.getSystemLayer(name)?.setOpacity(0);
  }

  showSystemLayer(name: string) {
    this.getSystemLayer(name)?.setOpacity(1);
  }

  fitToBbox(bbox: Extent, padding: [number, number, number, number], minResolution?: number) {
    // constrainResolution Ломает view на слоях с геометрией Point
    this.map.getView().fit(bbox, { padding, minResolution });
  }

  getResolution(): number {
    if (!this.view) {
      throw new Error('Невозможно выполнить getResolution. Карта не создана');
    }

    const resolution = this.view.getResolution();

    if (!resolution) {
      throw new Error('Невозможно выполнить getResolution. Разрешение не определено');
    }

    return resolution;
  }

  async positionToFeature(feature: WfsFeature, proj?: Projection) {
    try {
      if (!proj) {
        proj = await getFeatureProjection(feature);
      }

      const extent = getFeatureExtent(feature);
      const olProjection = await getOlProjection();
      if (extent && olProjection && proj) {
        const transformedExtent = transformExtent(extent, proj, olProjection);
        this.positionToExtent(transformedExtent, feature.geometry?.type === GeometryType.POINT);
      }
    } catch (error) {
      services.logger.warn('Не удалось позиционироваться на фиче', error);
    }
  }

  async positionToFeatures(features: WfsFeature[], projection?: Projection) {
    const olProjection = await getOlProjection();
    const unfilteredExtent = await Promise.all(
      features.map(async feature => {
        const extent = getFeatureExtent(feature);
        const proj = projection || (await getFeatureProjection(feature));
        if (extent && proj && olProjection) {
          return transformExtent(extent, proj, olProjection);
        }
      })
    );
    const extents = unfilteredExtent.filter(notFalsyFilter);
    const isSinglePoint = features.length === 1 && features[0].geometry?.type === GeometryType.POINT;

    if (extents.length) {
      this.positionToExtent(mergeExtents(extents), isSinglePoint);
    }
  }

  drawMarkers(features: Feature<SimpleGeometry>[]) {
    this.markersSource?.addFeatures(features);
  }

  clearMarkers() {
    this.markersSource?.clear();
  }

  updateCursor(cursor: CursorType) {
    this.map.getViewport().style.cursor = cursor;
  }

  positionToExtent(extent: Extent, pointMode?: boolean) {
    if (pointMode) {
      const size = this.map.getSize();

      if (!size) {
        throw new Error('Невозможно выполнить positionToExtent. Размер карты не определен');
      }

      this.map.getView().centerOn(extent, size, [size[0] / 2, size[1] / 2]);
    } else {
      this.fitToBbox(extent, [50, 50, 50, 50]);
    }
  }

  private async crgLayersLoadFunction(tile: Tile | ImageWrapper, url: string) {
    mapStore.enrollLoadingStart();
    let data: Blob = new Blob();

    try {
      data = await getMap(url);
    } catch (error) {
      services.logger.error(error);
    }
    const blob = new Blob([data], { type: Mime.VND_JPEG_PNG8 });
    ((tile as ImageWrapper).getImage() as HTMLImageElement).src = URL.createObjectURL(blob);

    mapStore.enrollLoadingFinish();
  }

  /**
   * @param complexLayerName Название слоя в формате 'workspace:layerName'
   */
  private getLayerByName(complexLayerName: string): ImageLayer<ImageSource> | TileLayer<TileSource> | undefined {
    return this.getUserLayers().find(layer => {
      const source = layer.getSource() as TileWMS;

      return source && (source.getParams() as CrgWmsParams).LAYERS === complexLayerName;
    });
  }

  private async externalGisMapServerLoadFunction(tile: Tile | ImageWrapper, url: string) {
    mapStore.enrollLoadingStart();
    let data: Blob = new Blob();
    let replacedUrl = url
      .replace('256%2C256', '1024%2C1024')
      .replace('DPI=90', 'DPI=360')
      .replace('BBOXSR=3857', 'bboxSR=102100')
      .replace('IMAGESR=3857', 'imageSR=102100');

    if (url.includes('nspd.gov.ru')) {
      replacedUrl = url;
    }

    try {
      const response = await fetch(replacedUrl);
      if (response.ok) {
        data = await response.blob();
      }
    } catch (error) {
      services.logger.error(error);
    }

    const blob = new Blob([data], { type: Mime.VND_JPEG_PNG8 });
    ((tile as ImageWrapper).getImage() as HTMLImageElement).src = URL.createObjectURL(blob);
    mapStore.enrollLoadingFinish();
  }

  /**
   * Все слои которые являются пользовательскими
   */
  private getUserLayers(): (ImageLayer<ImageSource> | TileLayer<TileSource>)[] {
    return this.map
      .getLayers()
      .getArray()
      .filter(layer => this.isUserLayer(layer)) as (ImageLayer<ImageSource> | TileLayer<TileSource>)[];
  }

  private prepareTileSource(basemap: Basemap): TileImage | undefined {
    if (!basemap || !basemap.type) {
      return;
    }

    switch (basemap.type) {
      case SourceType.OSM: {
        return new OSM();
      }
      case SourceType.WMTS: {
        return this.prepareWMTS(basemap);
      }
      case SourceType.WMTS_P: {
        return this.prepareWMTSPanorama(basemap);
      }
      case SourceType.XYZ: {
        return new XYZ({
          crossOrigin: 'Anonymous',
          url: basemap.url || undefined,
          projection: basemap.projection || defaultOlProjectionCode
        });
      }
    }
  }

  private prepareWMTSPanorama(basemap: Basemap): WMTS {
    const projection = getProjection(basemap.projection);
    const projectionExtent = projection?.getExtent();

    if (!projection || !projectionExtent) {
      throw new Error('Невозможно выполнить prepareWMTSPanorama. Область проекции не определена');
    }

    if (!basemap.size || !basemap.resolution || !basemap.style || !basemap.layerName) {
      throw new Error('Невозможно выполнить prepareWMTSPanorama. Параметры подложки не определены');
    }

    const size = getWidth(projectionExtent) / basemap.size;
    const resolutions: number[] = [];
    const matrixIds: string[] = [];
    for (let i = 0; i < basemap.resolution; ++i) {
      // generate resolutions and matrixIds arrays for this WMTS
      resolutions[i] = size / Math.pow(2, i);
      matrixIds[i] = i.toString();
    }

    return new WMTS({
      tileLoadFunction: this.externalGisMapServerLoadFunction,
      url: basemap.url,
      tileGrid: new WMTSTileGrid({
        origin: getTopLeft(projectionExtent),
        resolutions,
        matrixIds
      }),
      style: basemap.style,
      layer: basemap.layerName,
      matrixSet: 'GoogleMapsCompatible',
      format: basemap.format,
      projection,
      wrapX: true,
      crossOrigin: 'Anonymous'
    });
  }

  private prepareWMTS(basemap: Basemap): WMTS {
    const projection = getProjection(basemap.projection);
    const projectionExtent = projection?.getExtent();

    if (!projection || !projectionExtent) {
      throw new Error('Невозможно выполнить prepareWMTS. Область проекции не определена');
    }

    if (
      !basemap.size ||
      !basemap.url ||
      !basemap.resolution ||
      !basemap.projection ||
      !basemap.style ||
      !basemap.layerName
    ) {
      throw new Error('Невозможно выполнить prepareWMTS. Параметры подложки не определены');
    }

    const size = getWidth(projectionExtent) / basemap.size;
    const resolutions: number[] = [];
    const matrixIds: string[] = [];
    for (let i = 0; i < basemap.resolution; ++i) {
      // generate resolutions and matrixIds arrays for this WMTS
      resolutions[i] = size / Math.pow(2, i);
      matrixIds[i] = `${basemap.projection}:${i}`;
    }

    return new WMTS({
      tileLoadFunction: this.crgLayersLoadFunction,
      urls: [basemap.url],
      tileGrid: new WMTSTileGrid({
        origin: getTopLeft(projectionExtent),
        resolutions,
        matrixIds
      }),
      style: basemap.style,
      layer: basemap.layerName,
      matrixSet: basemap.projection,
      format: basemap.format,
      projection,
      wrapX: true,
      crossOrigin: 'Anonymous'
    });
  }

  private isUserLayer(layer: BaseLayer): boolean {
    const crgInfo: CrgAdditionalLayerInfo = (layer.getProperties() as LayerAdditionalProps).crgInfo;
    if (crgInfo) {
      return crgInfo.isUserLayer;
    }

    return false;
  }

  private getSystemLayer(name: string): BaseLayer | undefined {
    return this.map
      .getLayers()
      .getArray()
      .find(layer => layer.getProperties().name === name);
  }

  private throwIfMapNotCreated() {
    if (!this.map) {
      throw new Error('Что-то пошло не так - карта не создана');
    }
  }

  get map(): Map {
    if (!this._map) {
      throw new Error('Карта не инициализирована');
    }

    return this._map;
  }

  set map(map: Map) {
    this._map = map;
  }

  get mapInited(): boolean {
    return !!this._map;
  }
}

export const mapService = MapService.instance;
