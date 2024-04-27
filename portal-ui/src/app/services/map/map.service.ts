import { reaction } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep, debounce } from 'lodash';
import { Map, View } from 'ol';
import { defaults as defaultControls } from 'ol/control';
import { Coordinate } from 'ol/coordinate';
import BaseEvent from 'ol/events/Event';
import { Extent, getTopLeft, getWidth } from 'ol/extent';
import Feature from 'ol/Feature';
import { Geometry, MultiPolygon, SimpleGeometry } from 'ol/geom';
import ImageWrapper from 'ol/Image';
import { Draw, Modify } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import { ModifyEvent } from 'ol/interaction/Modify';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import BaseLayer from 'ol/layer/Base';
import ImageLayer from 'ol/layer/Image';
import { get as getProjection } from 'ol/proj';
import { ImageWMS, OSM, TileArcGISRest, TileImage, TileWMS, Vector as VectorSource, WMTS, XYZ } from 'ol/source';
import ImageSource from 'ol/source/Image';
import TileSource from 'ol/source/Tile';
import { ServerType } from 'ol/source/wms';
import { Circle, Fill, Stroke, Style } from 'ol/style.js';
import Tile from 'ol/Tile';
import WMTSTileGrid from 'ol/tilegrid/WMTS';

import { FILTER_BY_SELECTION } from '../../components/Attributes/Table/Attributes-Table';
import { Toast } from '../../components/Toast/Toast';
import { attributesTableStore } from '../../stores/AttributesTable.store';
import { basemapsStore } from '../../stores/Basemaps.store';
import { mapStore } from '../../stores/Map.store';
import { route } from '../../stores/Route.store';
import { Emitter } from '../common/Emitter';
import { communicationService } from '../communication.service';
import { Basemap, SourceType } from '../data/basemaps/basemaps.models';
import { defaultOlCrs, Epsg } from '../data/epsg/epsg.models';
import { getFeatureEpsg, getOlEpsg } from '../data/epsg/epsg.service';
import { transformExtent, transformGeometry } from '../data/epsg/epsg.util';
import { Schema } from '../data/schema/schema.models';
import { applyView } from '../data/schema/schema.utils';
import { CoordinateEdited, GeometryType, WfsFeature } from '../geoserver/wfs/wfs.models';
import { getFeatureExtent, mergeExtents } from '../geoserver/wfs/wfs.util';
import { wmsClient } from '../geoserver/wms/wms.client';
import { getMap } from '../geoserver/wms/wms.service';
import { CrgExternalLayer, CrgLayer, CrgLayerType } from '../gis/layers/layers.models';
import { getLayerSchema } from '../gis/layers/layers.service';
import { ScaleLine } from '../ol/ScaleLine';
import { services } from '../services';
import { cqlBuild } from '../util/cqlBuild';
import { cqlConcat } from '../util/cqlConcat';
import { getFieldFilterValue, modifyFieldFilterValue } from '../util/filterObjects';
import { Mime } from '../util/Mime';
import { notFalsyFilter } from '../util/NotFalsyFilter';
import { wfsFeatureToFeature } from '../util/open-layers.util';
import { sleep } from '../util/sleep';
import { FilterBySelection, MapPosition } from './map.models';

// WMS request parameters. At least a LAYERS param is required.
interface CrgWmsParams {
  LAYERS: string;
  FORMAT?: string;
  STYLES?: string;
  CQL_FILTER?: string;
  featureId?: string;
  featureIdsNegative?: string;
}

interface CrgAdditionalLayerInfo {
  isUserLayer: boolean;
}

interface LayerAdditionalProps {
  crgInfo: CrgAdditionalLayerInfo;
}

class MapService {
  private static _instance: MapService;

  private readonly isTiledWms: boolean;

  private readonly debouncedZoomEvent: () => void;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  mapClick = new Emitter<Coordinate>();
  mapMoved = new Emitter<MapPosition>();
  mapCreate = new Emitter();
  zoomChanged = new Emitter<number>();
  modificationEnabled = new Emitter();
  modificationDisabled = new Emitter();
  modificationDone = new Emitter<Geometry>();

  private _map?: Map;

  get map(): Map {
    if (!this._map) {
      throw new Error('Map is not initialized');
    }

    return this._map;
  }

  set map(map: Map) {
    this._map = map;
  }

  get mapInited(): boolean {
    return !!this._map;
  }

  view?: View;
  scaleLine?: ScaleLine;
  draftSource?: VectorSource<Feature<SimpleGeometry>>;

  // Подложка
  private basemapLayer = new TileLayer();

  private markersSource?: VectorSource<Feature<SimpleGeometry>>;
  private zoom?: number;

  private center?: number[];
  private draftStyle?: Style;
  private draftSourceModify?: Modify;
  private draftSourceDraw?: Draw;
  private drawHandler?: (e: DrawEvent) => void;

  private isModifying = false;

  // Кол-во десятичных в координатах
  private PRECISION = 4;

  // Hit-detection tolerance. Pixels inside the square around the given position will be checked for features.
  private HIT_TOLERANCE = 10;

  readonly DRAFT_LAYER_ZINDEX = 10_000;
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
        this.mapCreate.once(() => {
          resolve();
        });
      }
    });
  }

  createMap(): void {
    this.markersSource = new VectorSource<Feature<SimpleGeometry>>({
      features: []
    });

    this.draftSource = new VectorSource<Feature<SimpleGeometry>>({
      features: []
    });

    this.draftSourceModify = new Modify({ source: this.draftSource });

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

    const { imageColor, strokeColor } = this.getDraftColors();
    this.draftStyle = new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 0, 0.5)'
      }),
      stroke: new Stroke({
        color: strokeColor,
        width: 2
      }),
      image: new Circle({
        radius: 7,
        fill: new Fill({
          color: imageColor
        })
      })
    });

    this.scaleLine = new ScaleLine({ bar: true, text: true, minWidth: 100 });

    this.map = new Map({
      target: 'fiz-openLayer-map',
      view: this.view,
      controls: defaultControls().extend([this.scaleLine]),
      layers: [
        this.basemapLayer,
        new VectorLayer({
          source: this.draftSource,
          zIndex: this.DRAFT_LAYER_ZINDEX,
          style: this.draftStyle,
          properties: { name: 'draft' }
        }),
        new VectorLayer({
          source: this.markersSource,
          zIndex: this.MARKERS_LAYER_ZINDEX,
          properties: { name: 'markers' }
        })
      ]
    });

    this.map.on('moveend', () => {
      const view = this.map?.getView();
      const center = view?.getCenter();
      const zoom = view?.getZoom();

      if (center && zoom) {
        this.mapMoved.emit({ zoom, center });
      }
    });

    this.map.on('singleclick', e => {
      const originalEvent = e.originalEvent as MouseEvent;
      if (!originalEvent.shiftKey && !originalEvent.ctrlKey) {
        if (e.coordinate) {
          if (!this.isModifying && !this.draftSourceDraw && !mapStore.measureMode) {
            this.mapClick.emit(e.coordinate);
          }
        } else {
          this.mapClick.emit([0, 0]);
        }
      }
    });
    this.view.on('change:resolution', this.debouncedZoomEvent);
    this.debouncedZoomEvent();
    this.mapCreate.emit();
  }

  destroyMap() {
    if (!this.map) {
      throw new Error('Невозможно выполнить destroyMap. Карта не создана');
    }
    communicationService.beforeMapDestroy.emit();
    this.drawOff();
    this.map.unset('target');
    delete this._map;
    delete this.view;
  }

  hideUserLayers() {
    this.getUserLayers()?.forEach(layer => {
      layer.setVisible(false);
    });
  }

  addExternalGeoserverLayer(layer: CrgExternalLayer, zIndex: number) {
    const { tableName, transparency = 100, dataSourceUri } = layer;

    if (!this.map) {
      throw new Error('Невозможно выполнить addExternalGeoserverLayer. Карта не создана');
    }

    const layerOnMap = this.getLayerByName(tableName);
    if (layerOnMap) {
      layerOnMap.setVisible(true);
      layerOnMap.setOpacity(transparency / 100);
      layerOnMap.setZIndex(zIndex);
    } else {
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
  }

  addExternalLayer(layer: CrgExternalLayer, zIndex: number) {
    const layerOnMap = this.getLayerByName(layer.tableName);
    if (layerOnMap) {
      layerOnMap.setVisible(true);
      layerOnMap.setOpacity((layer.transparency ?? 100) / 100);
      layerOnMap.setZIndex(zIndex);
    } else {
      const tileLayer = new TileLayer({
        source: new TileArcGISRest({
          url: layer.dataSourceUri,
          params: {
            LAYERS: layer.tableName
          },
          tileLoadFunction: this.externalGisMapServerLoadFunction
        }),
        visible: true,
        opacity: (layer.transparency ?? 100) / 100,
        zIndex: zIndex
      });

      const props: LayerAdditionalProps = {
        crgInfo: { isUserLayer: true }
      };

      tileLayer.setProperties(props);

      this.map.addLayer(tileLayer);
    }
  }

  async addLayer(layer: CrgLayer, zIndex: number, opacity: number): Promise<void> {
    const { tableName, complexName, styleName, view, type } = layer;

    if (!tableName || !complexName) {
      throw new Error('Некорректный слой в методе addLayers');
    }

    const params: CrgWmsParams = {
      STYLES: styleName,
      LAYERS: complexName,
      FORMAT: Mime.VND_JPEG_PNG8
    };

    const filter = cloneDeep(attributesTableStore.getLayerFilter(tableName));
    const filterBySelection = getFieldFilterValue(filter, FILTER_BY_SELECTION);
    modifyFieldFilterValue(filter, FILTER_BY_SELECTION);

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

    if (attributesTableStore.isLayerFiltered(layer)) {
      if (Object.keys(filter).length) {
        params.CQL_FILTER = cqlConcat(cqlBuild(filter), params.CQL_FILTER);
      }

      if (
        filterBySelection === FilterBySelection.ONLY_SELECTED ||
        filterBySelection === FilterBySelection.ONLY_NOT_SELECTED
      ) {
        params.featureId = mapStore.selectedFeaturesByTableName[tableName]?.map(({ id }) => id)?.join(',');
      }

      if (filterBySelection === FilterBySelection.ONLY_NOT_SELECTED && params.featureId) {
        params.featureIdsNegative = 'true';
      }
    }

    const commonLayerParams = {
      visible: true,
      opacity,
      zIndex
    };

    const commonWMSParams = {
      url: wmsClient.getWmsUrl(),
      params,
      serverType: 'geoserver' as ServerType,
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

    olLayer.setProperties(props);

    this.map.addLayer(olLayer);
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

  // Принудительный рефреш
  refreshAllLayers() {
    this.getUserLayers().forEach(layer => layer.getSource()?.refresh());
  }

  // Очистить карту от слоя, который отображал объект.
  clearDraft() {
    if (!this.draftSource) {
      throw new Error('Draft source is not created');
    }
    const collection = this.draftSource.getFeaturesCollection();
    const count = collection ? collection.getLength() : 0;
    this.draftSource.clear(count > 10);
  }

  // Очистить карту от всех слоёв.
  clearMap() {
    this.getUserLayers().forEach(layer => this.map.removeLayer(layer));
  }

  /**
   * Подсвечивает объект. (очищает черновой слой)
   */
  async highlightFeatures(features: WfsFeature<Coordinate | CoordinateEdited>[], epsg?: Epsg) {
    if (!this.draftSource) {
      throw new Error('Draft source is not created');
    }

    const featuresInOlProjection: WfsFeature[] = await Promise.all(
      [...features]
        .filter(({ geometry }) => geometry)
        .map(async (feature: WfsFeature<Coordinate | CoordinateEdited>): Promise<WfsFeature> => {
          const currentEpsg = epsg || (await getFeatureEpsg(feature));
          const olEpsg = await getOlEpsg();

          if (!currentEpsg || !olEpsg) {
            throw new Error('Не найдена проекция выбранного объекта');
          }
          const geometry = feature.geometry && transformGeometry(feature.geometry, currentEpsg, olEpsg);

          if (!geometry) {
            throw new Error('Геометрия не определена');
          }

          return {
            ...feature,
            geometry
          };
        })
    );

    this.clearDraft();

    const olFeatures: Feature<SimpleGeometry>[] = [];
    for (const wfsFeature of featuresInOlProjection) {
      if (!wfsFeature.geometry) {
        Toast.error({
          message: 'Ошибка отображения объекта',
          details: `ID: ${wfsFeature.id}.
                      Нет геометрии.`
        });

        continue;
      }

      try {
        const olFeature = wfsFeatureToFeature(wfsFeature);
        if (olFeature) {
          olFeatures.push(olFeature);
        }
      } catch (error) {
        services.logger.error(`Can't highlight feature: '${wfsFeature.id}'`, error);
      }
    }

    this.draftSource.addFeatures(olFeatures);
  }

  private getSystemLayer(name: string): BaseLayer | undefined {
    return this.map
      .getLayers()
      .getArray()
      .find(layer => layer.getProperties().name === name);
  }

  hideSystemLayer(name: string) {
    this.getSystemLayer(name)?.setOpacity(0);
  }

  showSystemLayer(name: string) {
    this.getSystemLayer(name)?.setOpacity(1);
  }

  showSelectionMarker(coordinates: Coordinate[][][]) {
    if (!this.draftSource) {
      throw new Error('Невозможно выполнить showSelectionMarker. Карта не создана');
    }
    const feature: WfsFeature = {
      type: 'Feature',
      geometry: {
        type: GeometryType.MULTI_POLYGON,
        coordinates
      },
      id: '',
      geometry_name: '',
      properties: {}
    };

    const olFeature = wfsFeatureToFeature(feature);
    if (olFeature) {
      this.draftSource.addFeature(olFeature);

      setTimeout(() => {
        try {
          this.draftSource?.removeFeature(olFeature);
        } catch {}
      }, 500);
    }
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

  private round(n: number) {
    return Number(n.toFixed(this.PRECISION));
  }

  getBufferByCoordinates(pos: Coordinate): MultiPolygon {
    const res = this.round(this.getResolution() * this.HIT_TOLERANCE);

    pos = pos.map(num => this.round(num));

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

  enableDraftModification() {
    if (!this.draftSourceModify) {
      throw new Error('Невозможно выполнить enableDraftModification');
    }

    this.isModifying = true;
    this.selectDraftColor();
    this.draftSourceModify.on('modifyend', this.modificationHandler);
    this.map.addInteraction(this.draftSourceModify);
    this.modificationEnabled.emit();
  }

  disableDraftModification() {
    if (!this.draftSourceModify) {
      throw new Error('Невозможно выполнить disableDraftModification');
    }

    this.isModifying = false;
    this.selectDraftColor();
    this.draftSourceModify.un('modifyend', this.modificationHandler);
    this.map.removeInteraction(this.draftSourceModify);
    this.modificationDisabled.emit();
  }

  @boundMethod
  modificationHandler(e: ModifyEvent) {
    const geometry = (e.features.item(0) as Feature<SimpleGeometry>).getGeometry();
    this.modificationDone.emit(geometry);
  }

  draw(geometryType: GeometryType, handler: (e: DrawEvent) => void) {
    this.drawOff();
    document.body.classList.add('global-crosshair-cursor');

    this.draftSourceDraw = new Draw({
      source: this.draftSource,
      type: geometryType
    });

    this.drawHandler = async (e: DrawEvent) => {
      handler(e);
      await sleep(500);
      this.modificationDone.emit();
    };

    this.draftSourceDraw.on('drawend', this.drawHandler);
    this.map.addInteraction(this.draftSourceDraw);
  }

  drawOff() {
    document.body.classList.remove('global-crosshair-cursor');
    if (this.draftSourceDraw && this.drawHandler) {
      this.draftSourceDraw.un(['drawend'], this.drawHandler as (event: BaseEvent | Event) => unknown);
      this.map.removeInteraction(this.draftSourceDraw);
      delete this.draftSourceDraw;
    }
  }

  async positionToFeature(feature: WfsFeature, epsg?: Epsg) {
    if (!epsg) {
      epsg = await getFeatureEpsg(feature);
    }
    const extent = getFeatureExtent(feature);
    const olEpsg = await getOlEpsg();
    if (extent && olEpsg && epsg) {
      const transformedExtent = transformExtent(extent, epsg, olEpsg);
      this.positionToExtent(transformedExtent, feature.geometry?.type === GeometryType.POINT);
    }
  }

  async positionToFeatures(features: WfsFeature[], epsg?: Epsg) {
    const olEpsg = await getOlEpsg();
    const extents = await Promise.all(
      features
        .map(async feature => {
          const extent = getFeatureExtent(feature);
          const proj = epsg || (await getFeatureEpsg(feature));
          if (extent && proj && olEpsg) {
            return transformExtent(extent, proj, olEpsg);
          }
        })
        .filter(notFalsyFilter)
    );
    const isSinglePoint = features.length === 1 && features[0].geometry?.type === GeometryType.POINT;

    if (extents.length) {
      this.positionToExtent(mergeExtents(extents), isSinglePoint);
    }
  }

  private positionToExtent(extent: Extent, pointMode?: boolean) {
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

  drawMarkers(features: Feature<SimpleGeometry>[]) {
    this.markersSource?.addFeatures(features);
  }

  clearMarkers() {
    this.markersSource?.clear();
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

  private async externalGisMapServerLoadFunction(tile: Tile | ImageWrapper, url: string) {
    mapStore.enrollLoadingStart();
    let data: Blob = new Blob();

    const replacedUrl = url
      .replace('256%2C256', '1024%2C1024')
      .replace('DPI=90', 'DPI=360')
      .replace('BBOXSR=3857', 'bboxSR=102100')
      .replace('IMAGESR=3857', 'imageSR=102100');

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
          projection: basemap.projection || defaultOlCrs
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
    const resolutions = [];
    const matrixIds = [];
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

  private selectDraftColor() {
    const { imageColor, strokeColor } = this.getDraftColors();

    // ошибка в типах openlayers
    /* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unsafe-call */
    // @ts-ignore
    const fill = this.draftStyle.getImage().getFill() as Fill;
    /* eslint-enable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unsafe-call */

    fill.setColor(imageColor);
    this.draftStyle?.getStroke()?.setColor(strokeColor);

    this.draftSource?.addFeatures([]); // repaint
  }

  private getDraftColors(): { strokeColor: string; imageColor: string } {
    if (this.isModifying || this.draftSourceDraw) {
      return { strokeColor: '#66f', imageColor: 'rgba(55, 55, 255, 0.8)' };
    }

    return { strokeColor: '#ff0018', imageColor: 'rgba(255, 55, 55, 0.8)' };
  }
}

export const mapService = MapService.instance;

// for autotests
if (typeof window !== 'undefined') {
  Object.assign(window, { mapService });
}
