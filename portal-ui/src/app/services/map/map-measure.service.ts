import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { reaction } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { Feature, MapBrowserEvent, Overlay } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { EventsKey } from 'ol/events';
import BaseEvent from 'ol/events/Event';
import { LineString, Polygon, SimpleGeometry } from 'ol/geom';
import { Draw, Modify } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import { ModifyEvent } from 'ol/interaction/Modify';
import VectorLayer from 'ol/layer/Vector';
import { unByKey } from 'ol/Observable';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';

import { MapMeasureTooltip } from '../../components/MapMeasureTooltip/MapMeasureTooltip';
import { mapStore } from '../../stores/Map.store';
import { communicationService } from '../communication.service';
import { Projection } from '../data/projections/projections.models';
import { getOlProjection } from '../data/projections/projections.service';
import { GeometryType } from '../geoserver/wfs/wfs.models';
import { UnitsOfAreaMeasurement } from '../util/open-layers.util';
import { MapMode } from './map.models';
import { mapService } from './map.service';

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
  private draw?: Draw;
  private featureGeometryChangeListenersKeys?: EventsKey | EventsKey[];
  private sketchItem?: MeasureItem;
  private markFillColor = 'rgba(255, 255, 255, 0.5)';
  private helpTooltipElement?: HTMLDivElement;
  private helpTooltip?: Overlay;
  private helpMsg?: string;
  private projection?: Projection;

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
    try {
      if (mapService.map) {
        this.addMapEventsListeners();
      }
    } catch {
      // do nothing
    }

    mapService.mapCreate.on((): void => {
      this.addMapEventsListeners();
    });

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

    this.initUnitsOfAreaMeasurement();
  }

  async measureOn(mode: MeasureMode) {
    mapService.drawOff();
    this.measureOff();
    mapStore.setMode(MapMode.MEASURE);
    mapStore.setMeasureMode(mode);
    if (!this.inited) {
      await this.init();
    }

    this.draw = this.getDraw(mode);

    this.draw.on('drawstart', this.handleMeasureDrawStart);
    this.draw.on('drawend', this.handleDrawEnd);

    mapService.map.addInteraction(this.draw);
  }

  private async init() {
    this.projection = await getOlProjection();
    mapService.map.addLayer(this.layer);
    const modify = new Modify({ source: this.source });
    mapService.map.addInteraction(modify);

    modify.on('modifystart', (e: ModifyEvent) => {
      this.featureGeometryChangeListenersKeys = this.featureGeometryChangeListenersKeys || [];
      if (!Array.isArray(this.featureGeometryChangeListenersKeys)) {
        this.featureGeometryChangeListenersKeys = [this.featureGeometryChangeListenersKeys];
      }
      // eslint-disable-next-line no-unused-expressions -- @FIXME хз, что тут происходит
      [
        ...this.featureGeometryChangeListenersKeys,
        ...(e.features.getArray() as Feature<SimpleGeometry>[]).map(feature => {
          return feature.getGeometry()?.on('change', (e: BaseEvent) => {
            const modifyingItem = mapStore.measureItems.find(item => item.feature === feature);
            this.handleFeatureGeometryChange(e, modifyingItem);
          });
        })
      ];
    });
  }

  @boundMethod
  private handleMeasureDrawStart(e: DrawEvent) {
    this.sketchItem = this.createItem(e.feature);
    this.featureGeometryChangeListenersKeys = (e.feature as Feature<SimpleGeometry>)
      .getGeometry()
      ?.on('change', this.handleFeatureGeometryChange);
  }

  @boundMethod
  private handleFeatureGeometryChange(e: BaseEvent, item: MeasureItem | undefined = this.sketchItem) {
    const geom = e.target as SimpleGeometry;
    let tooltipCoord: Coordinate | undefined;

    if (geom instanceof Polygon) {
      tooltipCoord = geom.getInteriorPoint().getCoordinates();
    } else if (geom instanceof LineString) {
      tooltipCoord = geom.getLastCoordinate();
    }

    if (!item || !tooltipCoord) {
      return;
    }

    item.feature.setGeometry(geom);

    this.renderTooltip(item, item === this.sketchItem);
    item.tooltipOverlay.setPosition(tooltipCoord);
  }

  @boundMethod
  private handleDrawEnd() {
    if (!this.sketchItem) {
      return;
    }
    this.setHelpMsg('клик для начала измерения');
    this.sketchItem.tooltipOverlay.setOffset([0, -6]);
    this.renderTooltip(this.sketchItem, false);
    mapStore.addMeasureItem(this.sketchItem);
    if (this.featureGeometryChangeListenersKeys) {
      unByKey(this.featureGeometryChangeListenersKeys);
    }
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
    if (this.draw) {
      this.draw.un('drawend', this.handleDrawEnd);
      if (this.featureGeometryChangeListenersKeys) {
        unByKey(this.featureGeometryChangeListenersKeys);
      }
      if (this.sketchItem) {
        this.clearItem(this.sketchItem);
      }
      mapService.map.removeInteraction(this.draw);
      delete this.draw;
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

  private getDraw(mode: MeasureMode): Draw {
    return new Draw({
      source: this.source,
      type: mode === 'length' ? GeometryType.LINE_STRING : GeometryType.POLYGON,
      style: new Style({
        fill: new Fill({
          color: this.markFillColor
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          lineDash: [10, 10],
          width: 2
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: '#ffcc33'
          }),
          fill: new Fill({
            color: this.markFillColor
          })
        })
      })
    });
  }

  private renderTooltip(item: MeasureItem, sketch: boolean) {
    if (!this.projection) {
      return;
    }

    const reactElement = createElement(MapMeasureTooltip, {
      item: { ...item },
      sketch,
      projection: this.projection,
      onClear: this.clearItem
    });

    item.tooltipRoot.render(reactElement);
  }

  private initUnitsOfAreaMeasurement() {
    const storedUnits =
      (localStorage.getItem('UnitsOfAreaMeasurement') as UnitsOfAreaMeasurement) || UnitsOfAreaMeasurement.HECTARE;
    if (mapStore.unitsOfAreaMeasurement !== storedUnits) {
      mapStore.setUnitsOfAreaMeasurement(storedUnits);
    }
  }

  setHelpMsg(helpMsg: string) {
    this.helpMsg = helpMsg;
  }

  removeHelpMsg() {
    this.helpTooltipElement?.remove();
  }

  createMeasureStartTooltip() {
    this.helpMsg = 'клик для начала измерения';
    this.helpTooltipElement = document.createElement('div');
    this.helpTooltipElement.className = 'HelpMessage';
    this.helpTooltip = new Overlay({
      element: this.helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left'
    });

    mapService.map.addOverlay(this.helpTooltip);
  }

  handlePointerMove(evt: MapBrowserEvent<UIEvent>) {
    if (evt.dragging) {
      return;
    }
    if (this.helpTooltipElement && this.helpMsg) {
      this.helpTooltipElement.innerHTML = this.helpMsg;
      this.helpTooltip?.setPosition(evt.coordinate);
    }
  }

  private addMapEventsListeners() {
    // ошибка в типах ol
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mapService.map.on('pointerdown', () => {
      this.setHelpMsg('двойной клик для завершения измерения');
    });

    mapService.map.on('pointermove', (e: MapBrowserEvent<UIEvent>) => {
      this.handlePointerMove(e);
    });
  }
}

export const mapMeasureService = MapMeasureService.instance;
