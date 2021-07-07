import { chunk, debounce } from 'lodash';
import { reaction } from 'mobx';
import { Map, MapBrowserEvent, View } from 'ol';
import { defaults as defaultControls } from 'ol/control';
import { Coordinate } from 'ol/coordinate';
import { Extent, getTopLeft, getWidth } from 'ol/extent';
import Feature from 'ol/Feature';
import { Geometry, MultiPolygon } from 'ol/geom';
import GeometryType from 'ol/geom/GeometryType';
import ImageWrapper from 'ol/Image';
import { Draw, Modify } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import { ModifyEvent } from 'ol/interaction/Modify';
import { Layer, Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import BaseLayer from 'ol/layer/Base';
import { get as getProjection } from 'ol/proj';
import { ImageWMS, OSM, TileArcGISRest, TileImage, TileWMS, Vector as VectorSource, WMTS, XYZ } from 'ol/source';
import { Circle, Fill, Stroke, Style } from 'ol/style.js';
import Tile from 'ol/Tile';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import ImageLayer from 'ol/layer/Image';
import { boundMethod } from 'autobind-decorator';

import { mapStore } from '../../stores/Map.store';
import { currentMap } from '../../stores/CurrentMap.store';
import { basemapsStore } from '../../stores/Basemaps.store';
import { route } from '../../stores/Route.store';
import { communicationService } from '../communication.service';
import { wfsFeatureToFeature } from '../util/open-layers.util';
import { Basemap, SourceType } from '../crg/basemaps.models';
import { CrgLayer } from '../crg/projects.models';
import { WfsFeature } from '../geoserver/wfs.models';
import { getWmsUrl } from '../server-urls.service';
import { ScaleLine } from '../ol/ScaleLine';
import { Emitter } from '../util/Emitter';
import { services } from '../services';
import { http } from '../http.service';
import {
  CrgProjection,
  getFeatureProjection,
  olProjection,
  transform,
  transformGeometry
} from '../geoserver/projections.service';

// исправление ошибки в типах openlayers
// актуально для ol: 6.4.3, @types/ol: ^6.4.1, typescript: ~3.8.3
declare module '../../../../node_modules/@types/ol/Geolocation' {
  type GeolocationPositionError = Error;
}

// WMS request parameters. At least a LAYERS param is required.
interface CrgWmsParams {
  LAYERS: string;
  FORMAT?: string;
}

interface CrgAdditionalLayerInfo {
  isUserLayer: boolean;
}

interface MapPosition {
  zoom: number;
  center: string;
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
  zoomChanged = new Emitter<number>();
  modificationEnabled = new Emitter();
  modificationDisabled = new Emitter();
  modificationDone = new Emitter<Geometry>();

  // Подложка
  private basemapLayer = new TileLayer();

  map: Map;
  view: View;
  scaleLine: ScaleLine;
  private markersSource: VectorSource;

  private zoom: number;
  private center: number[];

  private draftStyle: Style;
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

    this.debouncedZoomEvent = debounce(() => this.zoomChanged.emit(this.view.getZoom()), 100);

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

    const queryParams = route.queryParams as { [key: string]: string };

    if (queryParams.zoom && queryParams.center) {
      this.zoom = Number(queryParams.zoom);
      this.center = [Number(queryParams.center.split(',')[0]), Number(queryParams.center.split(',')[1])];
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
        center: this.map.getView().getCenter().join(',')
      });
    });

    this.map.on('singleclick', e => {
      if (this.pickHandler) {
        this.pickHandler(e);
        delete this.pickHandler;

        return;
      }

      if (e.coordinate) {
        if (!this.isModifying && !this.draftSourceDraw && !mapStore.measureMode) {
          this.mapClick.emit(e.coordinate);
        }
      } else {
        this.mapClick.emit([0, 0]);
      }
    });

    this.view.on('change:resolution', this.debouncedZoomEvent);
    this.debouncedZoomEvent();
  }

  destroyMap() {
    communicationService.beforeMapDestroy.emit();
    this.drawOff();
    this.pickingOff();
    this.map.unset('target');
    delete this.map;
    delete this.view;
  }

  hideUserLayers() {
    this.getUserLayers().forEach(layer => {
      layer.setVisible(false);
    });
  }

  addExternalLayers(layers: CrgLayer[], zIndex: number) {
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
            tileLoadFunction: this.arcGisMapServerLoadFunction
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
    if (layerOnMap) {
      layerOnMap.setVisible(true);
      layerOnMap.setOpacity(opacity);
      layerOnMap.setZIndex(zIndex);
    } else {
      const params: CrgWmsParams = {
        LAYERS: resultName,
        FORMAT: imageFormat
      };

      const commonLayerParams = {
        visible: true,
        opacity,
        zIndex
      };

      const commonWMSParams = {
        url: await getWmsUrl(),
        params,
        serverType: 'geoserver',
        crossOrigin: 'anonymous'
      };

      const layer: ImageLayer | TileLayer = this.isTiledWms
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

  private calcLayerName(layers: CrgLayer[]) {
    return layers.map(layer => layer.complexName).join(',');
  }

  deleteLayerFromMap(complexLayerName: string) {
    const layerByName = this.getLayerByName(complexLayerName);
    this.map.removeLayer(layerByName);
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

  /**
   * @param complexLayerName Название слоя в формате 'workspace:layerName'
   */
  private getLayerByName(complexLayerName: string): ImageLayer | TileLayer | undefined {
    return this.getUserLayers().find(layer => {
      const source = layer.getSource() as TileWMS;

      return source && (source.getParams() as CrgWmsParams).LAYERS === complexLayerName;
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
    this.getUserLayers().forEach(layer => this.map.removeLayer(layer));
  }

  /**
   * Подсвечивает объект. (очищает черновой слой)
   */
  highlightFeatures(features: WfsFeature[], projection?: CrgProjection) {
    const featuresInOlProjection: WfsFeature[] = [features]
      .flat()
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
        coordinates: coordinates
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

  getZoom() {
    return this.view.getZoom();
  }

  private round(n: number) {
    return Number(n.toFixed(this.PRECISION));
  }

  getBufferByCoordinates(pos: Coordinate) {
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
    this.modificationDone.emit(e.features.item(0).getGeometry());
  }

  draw(geometryType: GeometryType, handler: (e: DrawEvent) => void) {
    this.drawOff();
    document.body.classList.add('global-crosshair-cursor');

    this.draftSourceDraw = new Draw({
      source: this.draftSource,
      type: geometryType
    });

    this.drawHandler = handler;

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

  pickPoint(handler: (e: MapBrowserEvent) => void) {
    this.pickHandler = handler;
  }

  pickingOff() {
    delete this.pickHandler;
  }

  positionToFeature(wfsFeature: WfsFeature, projection?: CrgProjection) {
    projection = projection || getFeatureProjection(wfsFeature);
    const olFeature: Feature = wfsFeatureToFeature(wfsFeature, true);
    if (!olFeature) {
      services.logger.warn('Incorrect feature: ', wfsFeature);

      return;
    }

    const view = this.map.getView();
    const size = this.map.getSize();

    const geometry = olFeature.getGeometry();
    const extent = chunk(geometry.getExtent(), 2).flatMap(coord =>
      transform(projection, olProjection, coord)
    ) as Extent;

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

  drawMarkers(features: Feature[]) {
    this.markersSource.addFeatures(features);
  }

  clearMarkers() {
    this.markersSource.clear();
  }

  private async crgLayersLoadFunction(tile: Tile | ImageWrapper, url: string) {
    currentMap.enrollLoadingStart();
    let data: Blob;
    try {
      data = await http.get<Blob>(url, { responseType: 'blob' });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      data = error.error;
    }
    const blob = new Blob([data], { type: imageFormat });
    ((tile as ImageWrapper).getImage() as HTMLImageElement).src = URL.createObjectURL(blob);
    currentMap.enrollLoadingFinish();
  }

  private async arcGisMapServerLoadFunction(tile: Tile | ImageWrapper, url: string) {
    currentMap.enrollLoadingStart();
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
    currentMap.enrollLoadingFinish();
  }

  /**
   * Все слои которые являются пользовательскими
   */
  private getUserLayers(): TileLayer[] {
    return this.map
      .getLayers()
      .getArray()
      .filter(layer => this.isUserLayer(layer)) as TileLayer[];
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
      case SourceType.XYZ:
        return new XYZ({ crossOrigin: 'Anonymous', url: basemap.url || undefined });
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
