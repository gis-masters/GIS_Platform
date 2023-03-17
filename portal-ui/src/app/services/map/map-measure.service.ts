import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { reaction } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { LineString, Polygon, SimpleGeometry } from 'ol/geom';
import { ModifyEvent } from 'ol/interaction/Modify';
import { DrawEvent } from 'ol/interaction/Draw';
import { Fill, Stroke, Style } from 'ol/style';
import { Draw, Modify } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import { Coordinate } from 'ol/coordinate';
import VectorLayer from 'ol/layer/Vector';
import CircleStyle from 'ol/style/Circle';
import BaseEvent from 'ol/events/Event';
import { unByKey } from 'ol/Observable';
import { Feature, Overlay } from 'ol';
import { EventsKey } from 'ol/events';

import { MapMode, mapStore } from '../../stores/Map.store';
import { UnitsOfAreaMeasurement } from '../util/open-layers.util';
import { communicationService } from '../communication.service';
import { GeometryType } from '../geoserver/wfs/wfs.models';
import { mapService } from './map.service';
import { MapMeasureTooltip } from '../../components/MapMeasureTooltip/MapMeasureTooltip';

export type MeasureMode = 'area' | 'length';

export interface MeasureItem {
  id: symbol;
  feature: Feature;
  tooltipRoot: Root;
  tooltipNode: HTMLElement;
  tooltipOverlay: Overlay;
}

class MapMeasureService {
  private static _instance: MapMeasureService;

  private source = new VectorSource();
  private sourceDraw?: Draw;
  private featureGeometryChangeListeners: EventsKey | EventsKey[];
  private sketchItem?: MeasureItem;
  private markFillColor = 'rgba(255, 255, 255, 0.5)';

  private layer = new VectorLayer({
    source: this.source,
    zIndex: mapService.MEASURE_LAYER_ZINDEX,
    properties: { name: 'measure' },
    style: new Style({
      fill: new Fill({
        color: this.markFillColor
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 2
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33'
        })
      })
    })
  });

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    this.initUnitsOfAreaMeasurement();

    communicationService.beforeMapDestroy.on(() => {
      this.clearAll();
      mapStore.setMeasureMode(null);
    });

    reaction(
      () => mapStore.mode,
      mode => {
        if (mode === MapMode.SELECTION || mode === MapMode.DEFAULT || mode === MapMode.PICK) {
          this.measureOff();
        }
      }
    );
  }

  measureOn(mode: MeasureMode) {
    mapService.drawOff();
    this.measureOff();
    mapStore.setMode(MapMode.MEASURE);
    mapStore.setMeasureMode(mode);
    if (!this.inited) {
      this.init();
    }

    this.sourceDraw = this.getSourceDraw(mode);

    this.sourceDraw.on('drawstart', this.measureDrawStartHandler);
    this.sourceDraw.on('drawend', this.drawEndHandler);

    mapService.map.addInteraction(this.sourceDraw);
  }

  private init() {
    mapService.map.addLayer(this.layer);
    const modify = new Modify({ source: this.source });
    mapService.map.addInteraction(modify);

    modify.on('modifystart', (e: ModifyEvent) => {
      this.featureGeometryChangeListeners = this.featureGeometryChangeListeners || [];
      if (!Array.isArray(this.featureGeometryChangeListeners)) {
        this.featureGeometryChangeListeners = [this.featureGeometryChangeListeners];
      }
      // eslint-disable-next-line no-unused-expressions -- @FIXME хз, что тут происходит
      [
        ...this.featureGeometryChangeListeners,
        ...(e.features.getArray() as Feature<SimpleGeometry>[]).map(feature => {
          return feature.getGeometry().on('change', (e: BaseEvent) => {
            const modifyingItem = mapStore.measureItems.find(item => item.feature === feature);
            this.featureGeometryChangeHandler(e, modifyingItem);
          });
        })
      ];
    });

    modify.on('modifyend', () => {
      unByKey(this.featureGeometryChangeListeners);
    });
  }

  @boundMethod
  private measureDrawStartHandler(e: DrawEvent) {
    this.sketchItem = this.createItem(e.feature);
    this.featureGeometryChangeListeners = (e.feature as Feature<SimpleGeometry>)
      .getGeometry()
      .on('change', this.featureGeometryChangeHandler);
  }

  @boundMethod
  private featureGeometryChangeHandler(e: BaseEvent, item: MeasureItem = this.sketchItem) {
    const geom = e.target as SimpleGeometry;
    let tooltipCoord: Coordinate;

    if (geom instanceof Polygon) {
      tooltipCoord = geom.getInteriorPoint().getCoordinates();
    } else if (geom instanceof LineString) {
      tooltipCoord = geom.getLastCoordinate();
    }

    item.feature.setGeometry(geom);

    this.renderTooltip(item, item === this.sketchItem);
    item.tooltipOverlay.setPosition(tooltipCoord);
  }

  @boundMethod
  private drawEndHandler() {
    this.sketchItem.tooltipOverlay.setOffset([0, -6]);
    this.renderTooltip(this.sketchItem, false);
    mapStore.addMeasureItem(this.sketchItem);
    unByKey(this.featureGeometryChangeListeners);
    delete this.sketchItem;
  }

  private createItem(feature: Feature): MeasureItem {
    const tooltipNode = document.createElement('div');
    tooltipNode.className = 'MapMeasureTooltipRoot';
    const tooltipOverlay = new Overlay({
      element: tooltipNode,
      offset: [0, -10],
      positioning: 'bottom-center'
    });
    mapService.map.addOverlay(tooltipOverlay);

    return {
      id: Symbol('id'),
      feature,
      tooltipRoot: createRoot(tooltipNode),
      tooltipNode,
      tooltipOverlay
    };
  }

  measureOff() {
    if (this.sourceDraw) {
      this.sourceDraw.un('drawend', this.drawEndHandler);
      unByKey(this.featureGeometryChangeListeners);
      if (this.sketchItem) {
        this.clearItem(this.sketchItem);
      }
      mapService.map.removeInteraction(this.sourceDraw);
      delete this.sourceDraw;
      mapStore.setMeasureMode(null);
    }
  }

  @boundMethod
  clearAll() {
    [...mapStore.measureItems].forEach(this.clearItem);
  }

  @boundMethod
  private clearItem(item: MeasureItem) {
    if (this.source.hasFeature(item.feature)) {
      this.source.removeFeature(item.feature);
    }
    item.tooltipRoot.unmount();
    mapService.map.removeOverlay(item.tooltipOverlay);
    mapStore.removeMeasureItem(item);
  }

  private get inited(): boolean {
    let connected = false;

    mapService.map.getLayers().forEach(layer => {
      if (layer === this.layer) {
        connected = true;
      }
    });

    return connected;
  }

  private getSourceDraw(mode: MeasureMode): Draw {
    return new Draw({
      source: this.source,
      type: mode === 'length' ? GeometryType.LINE_STRING : GeometryType.POLYGON,
      style: new Style({
        fill: new Fill({
          color: this.markFillColor
        }),
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.5)',
          lineDash: [10, 10],
          width: 2
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.7)'
          }),
          fill: new Fill({
            color: this.markFillColor
          })
        })
      })
    });
  }

  private renderTooltip(item: MeasureItem, sketch: boolean) {
    const reactElement = createElement(MapMeasureTooltip, { item: { ...item }, sketch, onClear: this.clearItem });

    item.tooltipRoot.render(reactElement);
  }

  private initUnitsOfAreaMeasurement() {
    const storedUnits =
      (localStorage.getItem('UnitsOfAreaMeasurement') as UnitsOfAreaMeasurement) || UnitsOfAreaMeasurement.HECTARE;
    if (mapStore.unitsOfAreaMeasurement !== storedUnits) {
      mapStore.setUnitsOfAreaMeasurement(storedUnits);
    }
  }
}

export const mapMeasureService = MapMeasureService.instance;
