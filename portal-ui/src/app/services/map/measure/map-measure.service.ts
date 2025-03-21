import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
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

import { MapMeasureTooltip } from '../../../components/MapMeasureTooltip/MapMeasureTooltip';
import { mapStore } from '../../../stores/Map.store';
import { mapMeasureStore } from '../../../stores/MapMeasure.store';
import { projectionsStore } from '../../../stores/Projections.store';
import { communicationService } from '../../communication.service';
import { GeometryType } from '../../geoserver/wfs/wfs.models';
import { UnitsOfAreaMeasurement } from '../../util/open-layers.util';
import { mapDrawService } from '../draw/map-draw.service';
import { ToolMode } from '../map.models';
import { mapService } from '../map.service';
import { getStyle, KnownStyleKey } from '../styles/map-styles';
import { MeasureItem } from './map-measure.models';

class MapMeasureService {
  private static _instance: MapMeasureService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private source = new VectorSource();
  private draw?: Draw;
  private featureGeometryChangeListenersKeys?: EventsKey | EventsKey[];
  private sketchItem?: MeasureItem;
  private helpTooltipElement?: HTMLDivElement;
  private helpTooltip?: Overlay;
  private helpMsg?: string;

  private layer = new VectorLayer({
    source: this.source,
    zIndex: mapService.MEASURE_LAYER_ZINDEX,
    properties: { name: 'measure' },
    style: getStyle(KnownStyleKey.MeasureLayerStyles)
  });

  private constructor() {
    communicationService.beforeMapDestroy.on(() => {
      this.clearAll();
    });

    reaction(
      () => mapStore.toolMode,
      mode => {
        if (mode === ToolMode.SELECTION || mode === ToolMode.NONE || mode === ToolMode.ADDING_LABEL) {
          this.measureOff();
        }
      }
    );

    this.initUnitsOfAreaMeasurement();
  }

  measureOn(mode: ToolMode) {
    mapDrawService.drawOff();

    this.measureOff();

    if (!this.inited) {
      this.init();
    }

    this.draw = this.getDraw(mode);

    this.draw.on('drawstart', this.handleMeasureDrawStart);
    this.draw.on('drawend', this.handleDrawEnd);

    mapService.map.addInteraction(this.draw);

    // @ts-expect-error - ошибка в типах ol
    mapService.map.on('pointerdown', this.handlePointerDown);
    mapService.map.on('pointermove', this.handlePointerMove);
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
    }

    // @ts-expect-error - ошибка в типах ol
    mapService.map.un('pointerdown', this.handlePointerDown);
    mapService.map.un('pointermove', this.handlePointerMove);
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

  @boundMethod
  private handleMeasureDrawStart(e: DrawEvent) {
    this.sketchItem = this.createItem(e.feature);
    this.featureGeometryChangeListenersKeys = (e.feature as Feature<SimpleGeometry>)
      .getGeometry()
      ?.on('change', this.handleFeatureGeometryChange);
  }

  private init() {
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
            const modifyingItem = mapMeasureStore.measureItems.find(item => item.feature === feature);
            this.handleFeatureGeometryChange(e, modifyingItem);
          });
        })
      ];
    });
  }

  @boundMethod
  private handleDrawEnd() {
    if (!this.sketchItem) {
      return;
    }

    this.setHelpMsg('клик для начала измерения');
    this.sketchItem.tooltipOverlay.setOffset([0, -6]);
    this.renderTooltip(this.sketchItem, false);
    mapMeasureStore.addMeasureItem(this.sketchItem);
    if (this.featureGeometryChangeListenersKeys) {
      unByKey(this.featureGeometryChangeListenersKeys);
    }
    delete this.sketchItem;
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
  clearAll() {
    [...mapMeasureStore.measureItems].forEach(this.clearItem);
  }

  @boundMethod
  private clearItem(item: MeasureItem) {
    if (this.source.hasFeature(item.feature)) {
      this.source.removeFeature(item.feature);
    }
    item.tooltipRoot.unmount();
    mapService.map.removeOverlay(item.tooltipOverlay);
    mapMeasureStore.removeMeasureItem(item);
  }

  @boundMethod
  private handlePointerDown() {
    this.setHelpMsg('двойной клик для завершения измерения');
  }

  @boundMethod
  private handlePointerMove(e: MapBrowserEvent<UIEvent>) {
    if (e.dragging) {
      return;
    }

    if (this.helpTooltipElement && this.helpMsg) {
      this.helpTooltipElement.innerHTML = this.helpMsg;
      this.helpTooltip?.setPosition(e.coordinate);
    }
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

  private get inited(): boolean {
    let connected = false;

    mapService.map.getLayers().forEach(layer => {
      if (layer === this.layer) {
        connected = true;
      }
    });

    return connected;
  }

  private getDraw(mode: ToolMode): Draw {
    return new Draw({
      source: this.source,
      type: mode === ToolMode.MEASURE_LENGTH ? GeometryType.LINE_STRING : GeometryType.POLYGON,
      style: getStyle(KnownStyleKey.MeasureDrawStyles)
    });
  }

  private renderTooltip(item: MeasureItem, sketch: boolean) {
    if (!projectionsStore.olProjection) {
      return;
    }

    const reactElement = createElement(MapMeasureTooltip, {
      item: { ...item },
      sketch,
      projection: projectionsStore.olProjection,
      onClear: this.clearItem
    });

    item.tooltipRoot.render(reactElement);
  }

  private initUnitsOfAreaMeasurement() {
    const storedUnits =
      (localStorage.getItem('UnitsOfAreaMeasurement') as UnitsOfAreaMeasurement) || UnitsOfAreaMeasurement.HECTARE;
    if (mapMeasureStore.unitsOfAreaMeasurement !== storedUnits) {
      mapMeasureStore.setUnitsOfAreaMeasurement(storedUnits);
    }
  }
}

export const mapMeasureService = MapMeasureService.instance;
