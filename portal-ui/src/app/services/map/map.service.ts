import { debounce } from 'lodash';
import { reaction } from 'mobx';
import { Map, View } from 'ol';
import Feature from 'ol/Feature';
import ImageWrapper from 'ol/Image';
import BaseLayer from 'ol/layer/Base';
import { Coordinate } from 'ol/coordinate';
import { ServerType } from 'ol/source/wms';
import { Draw, Modify } from 'ol/interaction';
import { get as getProjection } from 'ol/proj';
import { DrawEvent } from 'ol/interaction/Draw';
import { ModifyEvent } from 'ol/interaction/Modify';
import { defaults as defaultControls } from 'ol/control';
import { Extent, getTopLeft, getWidth } from 'ol/extent';
import { Geometry, MultiPolygon, SimpleGeometry } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { ImageWMS, OSM, TileArcGISRest, TileImage, TileWMS, Vector as VectorSource, WMTS, XYZ } from 'ol/source';
import { Circle, Fill, Stroke, Style } from 'ol/style.js';
import Tile from 'ol/Tile';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import TileSource from 'ol/source/Tile';
import ImageSource from 'ol/source/Image';
import ImageLayer from 'ol/layer/Image';
import { boundMethod } from 'autobind-decorator';

import { route } from '../../stores/Route.store';
import { FilterBySelection, mapStore } from '../../stores/Map.store';
import { basemapsStore } from '../../stores/Basemaps.store';
import { communicationService } from '../communication.service';
import { wfsFeatureToFeature } from '../util/open-layers.util';
import { Basemap, SourceType } from '../data/basemaps.models';
import { CrgExternalLayer, CrgLayer } from '../gis/projects.models';
import { CoordinateEdited, GeometryType, WfsFeature } from '../geoserver/wfs.models';
import { getWmsUrl } from '../server-urls.service';
import { ScaleLine } from '../ol/ScaleLine';
import { Emitter } from '../common/Emitter';
import {
  CrgProjection,
  getFeatureProjection,
  olProjection,
  transformExtent,
  transformGeometry
} from '../geoserver/projections.service';
import { sleep } from '../util/sleep';
import { getFeatureExtent, mergeExtents } from '../geoserver/wfs.util';
import { getMap } from '../geoserver/wms.service';
import { buildCqlFilter } from '../util/cql';

// WMS request parameters. At least a LAYERS param is required.
interface CrgWmsParams {
  LAYERS: string;
  FORMAT?: string;
  CQL_FILTER?: string;
  featureId?: string;
}

interface CrgAdditionalLayerInfo {
  isUserLayer: boolean;
}

interface MapPosition {
  zoom: number;
  center: Coordinate;
}

interface LayerAdditionalProps {
  crgInfo: CrgAdditionalLayerInfo;
}

const imageFormat = 'image/vnd.jpeg-png8';

class MapService {
  private static _instance: MapService;

  private readonly isTiledWms: boolean;

  private readonly debouncedZoomEvent: () => void;

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  mapClick = new Emitter<Coordinate>();
  mapMoved = new Emitter<MapPosition>();
  mapCreate = new Emitter();
  zoomChanged = new Emitter<number>();
  modificationEnabled = new Emitter();
  modificationDisabled = new Emitter();
  modificationDone = new Emitter<Geometry>();

  // Подложка
  private basemapLayer = new TileLayer();

  map: Map;
  view: View;
  scaleLine: ScaleLine;
  private markersSource: VectorSource<SimpleGeometry>;

  private zoom: number;
  private center: number[];

  private draftStyle: Style;
  draftSource: VectorSource<SimpleGeometry>;
  private draftSourceModify?: Modify;
  private draftSourceDraw?: Draw;
  private drawHandler: (e: DrawEvent) => void;

  private isModifying = false;

  // Кол-во десятичных в координатах
  private PRECISION = 4;

  // Hit-detection tolerance. Pixels inside the square around the given position will be checked for features.
  private HIT_TOLERANCE = 10;

  // ZIndex чернового слоя который используется для подсвечивания объектов
  readonly DRAFT_LAYER_ZINDEX = 10_000;
  readonly MEASURE_LAYER_ZINDEX = 10_100;
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

  createMap(): void {
    this.markersSource = new VectorSource({
      features: []
    });

    this.draftSource = new VectorSource({
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
          style: this.draftStyle
        }),
        new VectorLayer({
          source: this.markersSource,
          zIndex: this.MARKERS_LAYER_ZINDEX
        })
      ]
    });

    this.map.on('moveend', () => {
      this.mapMoved.emit({
        zoom: this.map.getView().getZoom(),
        center: this.map.getView().getCenter()
      });
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
    communicationService.beforeMapDestroy.emit();
    this.drawOff();
    this.map.unset('target');
    delete this.map;
    delete this.view;
  }

  hideUserLayers() {
    this.getUserLayers().forEach(layer => {
      layer.setVisible(false);
    });
  }

  addExternalGeoserverLayers(layers: CrgExternalLayer[], zIndex: number) {
    layers.forEach(layer => {
      const { tableName, transparency, dataSourceUri } = layer;

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
    });
  }

  addExternalLayers(layers: CrgExternalLayer[], zIndex: number) {
    layers.forEach(layer => {
      const layerOnMap = this.getLayerByName(layer.tableName);
      if (layerOnMap) {
        layerOnMap.setVisible(true);
        layerOnMap.setOpacity(layer.transparency / 100);
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
          opacity: layer.transparency / 100,
          zIndex: zIndex
        });

        const props: LayerAdditionalProps = {
          crgInfo: { isUserLayer: true }
        };

        tileLayer.setProperties(props);

        this.map.addLayer(tileLayer);
      }
    });
  }

  async addLayers(layers: CrgLayer[], zIndex: number, opacity: number) {
    const resultName = this.calcLayerName(layers);
    const layerOnMap = this.getLayerByName(resultName);

    if (layerOnMap && this.isNotFilteredLayer(layers)) {
      layerOnMap.setVisible(true);
      layerOnMap.setOpacity(opacity);
      layerOnMap.setZIndex(zIndex);
    } else {
      const params: CrgWmsParams = {
        LAYERS: resultName,
        FORMAT: imageFormat
      };

      const { tableName } = layers[0];
      const { filterBySelection, ...filter } = mapStore.attributeTableFilter[tableName] || {};
      if (Object.keys(filter).length) {
        params.CQL_FILTER = buildCqlFilter(filter);
      }

      if (filterBySelection === FilterBySelection.ONLY_SELECTED) {
        params.featureId = mapStore.selectedFeaturesByTableName[tableName]?.map(({ id }) => id).join(',');
      }

      const commonLayerParams = {
        visible: true,
        opacity,
        zIndex
      };

      const commonWMSParams = {
        url: await getWmsUrl(),
        params,
        serverType: 'geoserver' as ServerType,
        crossOrigin: 'anonymous'
      };

      const layer: ImageLayer<ImageSource> | TileLayer<TileSource> = this.isTiledWms
        ? new TileLayer({
            source: new TileWMS({ tileLoadFunction: this.crgLayersLoadFunction, ...commonWMSParams }),
            ...commonLayerParams
          })
        : new ImageLayer({
            source: new ImageWMS({ imageLoadFunction: this.crgLayersLoadFunction, ...commonWMSParams, ratio: 1 }),
            ...commonLayerParams
          });

      const props: LayerAdditionalProps = { crgInfo: { isUserLayer: true } };

      layer.setProperties(props);

      this.map.addLayer(layer);
    }
  }

  private isNotFilteredLayer(layers: CrgLayer[]) {
    return !(layers.length === 1 && mapStore.isFiltered(layers[0]));
  }

  private calcLayerName(layers: CrgLayer[]) {
    return layers.map(layer => layer.complexName).join(',');
  }

  deleteLayerFromMap(complexLayerName: string) {
    const layerByName = this.getLayerByName(complexLayerName);
    this.map.removeLayer(layerByName);
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

  getLayerVisibility(complexLayerName: string): boolean {
    const layer = this.getLayerByName(complexLayerName);
    if (layer) {
      return layer.getVisible();
    }
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
  refreshLayers() {
    this.getUserLayers().forEach(layer => layer.getSource().refresh());
  }

  // Очистить карту от слоя, который отображал объект.
  clearDraft() {
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
  highlightFeatures(features: WfsFeature<Coordinate | CoordinateEdited>[], projection?: CrgProjection) {
    const featuresInOlProjection: WfsFeature[] = [...features]
      .filter(({ geometry }) => geometry)
      .map((feature: WfsFeature) => ({
        ...feature,
        geometry: transformGeometry(feature.geometry, projection || getFeatureProjection(feature), olProjection)
      }));

    this.clearDraft();

    const olFeatures = featuresInOlProjection.map(feature => wfsFeatureToFeature(feature));
    this.draftSource.addFeatures(olFeatures);
  }

  showSelectionMarker(coordinates: Coordinate[][][]) {
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
          this.draftSource.removeFeature(olFeature);
        } catch {}
      }, 500);
    }
  }

  fitToBbox(bbox: Extent, padding: [number, number, number, number], minResolution?: number) {
    // constrainResolution Ломает view на слоях с геометрией Point
    this.map.getView().fit(bbox, { padding, minResolution });
  }

  getResolution() {
    return this.view.getResolution();
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
    this.isModifying = true;
    this.selectDraftColor();
    this.draftSourceModify.on('modifyend', this.modificationHandler);
    this.map.addInteraction(this.draftSourceModify);
    this.modificationEnabled.emit();
  }

  disableDraftModification() {
    this.isModifying = false;
    this.selectDraftColor();
    this.draftSourceModify.un('modifyend', this.modificationHandler);
    this.map.removeInteraction(this.draftSourceModify);
    this.modificationDisabled.emit();
  }

  @boundMethod
  modificationHandler(e: ModifyEvent) {
    const geometry = (e.features.item(0) as Feature<SimpleGeometry>).getGeometry();
    this.modificationDone.emit(geometry.getType() !== GeometryType.POLYGON && geometry);
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
    if (this.draftSourceDraw) {
      this.draftSourceDraw.un('drawend', this.drawHandler);
      this.map.removeInteraction(this.draftSourceDraw);
      delete this.draftSourceDraw;
    }
  }

  positionToFeature(feature: WfsFeature, projection: CrgProjection = getFeatureProjection(feature)) {
    const extent = transformExtent(getFeatureExtent(feature), projection, olProjection);
    this.positionToExtent(extent, feature.geometry?.type === GeometryType.POINT);
  }

  positionToFeatures(features: WfsFeature[], projection?: CrgProjection) {
    const extents = features.map(feature =>
      transformExtent(getFeatureExtent(feature), projection || getFeatureProjection(feature), olProjection)
    );
    const isSinglePoint = features.length === 1 && features[0].geometry?.type === GeometryType.POINT;

    this.positionToExtent(mergeExtents(extents), isSinglePoint);
  }

  private positionToExtent(extent: Extent, pointMode?: boolean) {
    if (pointMode) {
      const size = this.map.getSize();
      this.map.getView().centerOn(extent, size, [size[0] / 2, size[1] / 2]);
    } else {
      this.fitToBbox(extent, [50, 50, 50, 50]);
    }
  }

  drawMarkers(features: Feature<SimpleGeometry>[]) {
    this.markersSource.addFeatures(features);
  }

  clearMarkers() {
    this.markersSource.clear();
  }

  private async crgLayersLoadFunction(tile: Tile | ImageWrapper, url: string) {
    mapStore.enrollLoadingStart();
    let data: Blob;
    try {
      data = await getMap(url);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      data = error?.error;
    }
    const blob = new Blob([data], { type: imageFormat });
    ((tile as ImageWrapper).getImage() as HTMLImageElement).src = URL.createObjectURL(blob);

    mapStore.enrollLoadingFinish();
  }

  private async externalGisMapServerLoadFunction(tile: Tile | ImageWrapper, url: string) {
    mapStore.enrollLoadingStart();
    let data: Blob;

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      data = error.error;
    }

    const blob = new Blob([data], { type: imageFormat });
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
      return undefined;
    }

    switch (basemap.type) {
      case SourceType.OSM:
        return new OSM();
      case SourceType.WMTS:
        return this.prepareWMTS(basemap);
      case SourceType.WMTS_P:
        return this.prepareWMTSPanorama(basemap);
      case SourceType.XYZ:
        return new XYZ({
          crossOrigin: 'Anonymous',
          url: basemap.url || undefined,
          projection: basemap.projection || 'EPSG:3857'
        });
    }
  }

  private prepareWMTSPanorama(basemap: Basemap): WMTS {
    try {
      const projection = getProjection(basemap.projection);
      const projectionExtent = projection.getExtent();
      const size = getWidth(projectionExtent) / basemap.size;
      const resolutions = [];
      const matrixIds = [];
      for (let i = 0; i < basemap.resolution; ++i) {
        // generate resolutions and matrixIds arrays for this WMTS
        resolutions[i] = size / Math.pow(2, i);
        matrixIds[i] = i;
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
    } catch {
      return undefined;
    }
  }

  private prepareWMTS(basemap: Basemap): WMTS {
    try {
      const projection = getProjection(basemap.projection);
      const projectionExtent = projection.getExtent();
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
    } catch {
      return undefined;
    }
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
    this.draftStyle.getStroke().setColor(strokeColor);

    this.draftSource.addFeatures([]); // repaint
  }

  private getDraftColors(): { strokeColor: string; imageColor: string } {
    if (this.isModifying || this.draftSourceDraw) {
      return { strokeColor: '#66f', imageColor: 'rgba(55, 55, 255, 0.8)' };
    }

    return { strokeColor: '#ff0018', imageColor: 'rgba(255, 55, 55, 0.8)' };
  }
}

export const mapService = MapService.instance;
