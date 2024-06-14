import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { reaction } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { debounce } from 'lodash';
import { Feature, MapBrowserEvent, Overlay } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Point } from 'ol/geom';
import { Draw, Modify } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { v4 as uuid } from 'uuid';

import { MapLabelToolbox } from '../../components/MapLabelToolbox/MapLabelToolbox';
import { currentProject } from '../../stores/CurrentProject.store';
import { currentUser } from '../../stores/CurrentUser.store';
import { mapStore } from '../../stores/Map.store';
import { communicationService } from '../communication.service';
import { GeometryType, WfsFeature } from '../geoserver/wfs/wfs.models';
import { featureToWfsFeature, wfsFeatureToFeature } from '../util/open-layers.util';
import { sleep } from '../util/sleep';
import { prompto } from '../utility-dialogs.service';
import { LabelType, MapMode } from './map.models';
import { mapService } from './map.service';
import { mapMeasureService } from './map-measure.service';

const MARK_FILL_COLOR = 'rgba(255, 255, 255, 0.5)';

class MapLabelsService {
  private static _instance: MapLabelsService;
  private draw?: Draw;
  private modify?: Modify;
  private source = new VectorSource();
  private sourceForPrintLabels = new VectorSource();
  private selectedFeature?: Feature;
  private modifyingNow = false;
  private currentToolboxRoot?: Root;
  private currentOverlay?: Overlay;
  private layer = new VectorLayer({
    source: this.source,
    zIndex: mapService.LABELS_LAYER_ZINDEX,
    properties: { name: 'labels' }
  });
  private layerForPrintLabels = new VectorLayer({
    source: this.sourceForPrintLabels,
    zIndex: mapService.LABELS_LAYER_ZINDEX,
    properties: { name: 'printLabels' }
  });
  private renderLabelToolboxDebounced = debounce(this.renderLabelToolbox, 500);
  private removeLabelToolboxDebounced = debounce(this.removeLabelToolbox, 500);
  private toolboxHovered = false;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    reaction(
      () => mapStore.mode,
      mode => {
        if (mode !== MapMode.ADDING_LABEL && this.shown) {
          this.drawOff();
        }
      }
    );

    reaction(
      () => mapStore.labelsVisible,
      async labelsVisible => {
        await mapService.waitForMap();

        if (!labelsVisible && this.shown) {
          this.hide();
        }

        if (labelsVisible && !this.shown) {
          await this.show();
        }
      }
    );

    communicationService.beforeMapDestroy.on(() => {
      this.hide();

      this.removeLabelToolboxDebounced.cancel();
      this.renderLabelToolboxDebounced.cancel();
      this.removeLabelToolbox();
      mapService.map.un('pointermove', this.handlePointerMove);
    });
  }

  private get shown(): boolean {
    for (const layer of mapService.map.getLayers().getArray()) {
      if (layer === this.layer) {
        return true;
      }
    }

    return false;
  }

  async addingLabelOn(type: LabelType) {
    this.drawOff();
    mapService.drawOff();
    mapMeasureService.measureOff();
    mapStore.setMode(MapMode.ADDING_LABEL);
    mapStore.setCurrentLabelType(type);

    await this.show();

    this.draw = this.getDraw(type);
    this.draw.on('drawend', this.handleDrawEnd);
    mapService.map.addInteraction(this.draw);
  }

  addingLabelOff() {
    mapStore.setCurrentLabelType();
    mapStore.setMode(MapMode.DEFAULT);
  }

  private drawOff() {
    if (this.draw) {
      this.draw.un('drawend', this.handleDrawEnd);
      mapService.map.removeInteraction(this.draw);
      delete this.draw;
    }
  }

  private modifyOff() {
    if (this.modify) {
      this.modify.un(['modifystart'], this.handleModifyStart);
      this.modify.un(['modifyend'], this.handleModifyEnd);
      mapService.map.removeInteraction(this.modify);
      delete this.modify;
    }
  }

  private getDraw(type: LabelType): Draw {
    return new Draw({
      source: this.source,
      type: type === 'line' ? GeometryType.LINE_STRING : GeometryType.POINT,
      style: new Style({
        fill: new Fill({
          color: MARK_FILL_COLOR
        }),
        stroke: new Stroke({
          color: '#3399ff',
          lineDash: [10, 10],
          width: 2
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: '#3399ff'
          }),
          fill: new Fill({
            color: MARK_FILL_COLOR
          })
        })
      })
    });
  }

  @boundMethod
  private async handleDrawEnd(e: DrawEvent) {
    const feature = e.feature;
    feature.setId(uuid());
    feature.setProperties({ type: mapStore.currentLabelType });
    if (mapStore.currentLabelType === 'label') {
      await this.editLabel(feature);
    } else {
      await sleep(0);
      this.saveToStorages();
    }
    feature.setStyle(this.createStyle(feature));
    this.addingLabelOff();
  }

  @boundMethod
  private async editLabel(feature: Feature) {
    const currentText = feature.getProperties().text as string | undefined;
    const text = await prompto({ title: 'Текст аннотации:', defaultValue: currentText || '', multiline: true });

    if (!text) {
      if (!currentText) {
        this.removeItem(feature);
      }

      return;
    }

    feature.setProperties({ ...feature.getProperties(), text });
    this.saveToStorages();
  }

  @boundMethod
  private removeItem(feature: Feature) {
    if (this.source.hasFeature(feature)) {
      this.source.removeFeature(feature);
    }
    this.saveToStorages();
    this.removeLabelToolbox();
  }

  clearAll() {
    for (const feature of this.source.getFeatures()) {
      this.source.removeFeature(feature);
    }
    this.saveToStorages();
  }

  async show() {
    await mapService.waitForMap();

    if (this.shown) {
      return;
    }

    mapService.map.addLayer(this.layer);
    this.modify = new Modify({ source: this.source });
    mapService.map.addInteraction(this.modify);
    this.modify.on(['modifystart'], this.handleModifyStart);
    this.modify.on(['modifyend'], this.handleModifyEnd);

    this.restoreLabelsState();

    mapService.map.on('pointermove', this.handlePointerMove);
  }

  private restoreLabelsState() {
    let wfsFeatures: WfsFeature[] = [];

    try {
      wfsFeatures = (JSON.parse(localStorage.getItem(this.getStorageKey('labels')) || '') || []) as WfsFeature[];
    } catch {
      // do nothing
    }

    const olFeatures = wfsFeatures.map(wfsFeature => {
      const feature = wfsFeatureToFeature(wfsFeature);

      if (!feature) {
        throw new Error('feature error');
      }

      feature.setStyle(this.createStyle(feature));

      return feature;
    });

    this.source.clear();
    this.source.addFeatures(olFeatures);
    mapStore.setLabels(olFeatures);
  }

  hide() {
    this.drawOff();
    this.modifyOff();
    mapService.map.removeLayer(this.layer);
  }

  @boundMethod
  private handleModifyStart() {
    this.modifyingNow = true;
    this.removeLabelToolbox();
  }

  @boundMethod
  private handleModifyEnd() {
    this.modifyingNow = false;
    this.saveToStorages();
  }

  private saveToStorages() {
    const olFeatures = this.source.getFeatures();
    const wfsFeatures: WfsFeature[] = olFeatures.map(featureToWfsFeature);

    mapStore.setLabels(olFeatures);
    localStorage.setItem(this.getStorageKey('labels'), JSON.stringify(wfsFeatures));
  }

  getStorageKey(key: string): string {
    return `mapLabels_${key}_${currentUser.id}_${currentProject.id}`;
  }

  private createStyle(feature: Feature, selected?: boolean): Style {
    if (this.getLabelType(feature) === 'line') {
      return this.createLineStyle(selected);
    }

    if (this.getLabelType(feature) === 'label') {
      return this.createLabelStyle(feature, selected);
    }

    throw new Error(`Unknown label type: ${this.getLabelType(feature)}`);
  }

  private createLineStyle(selected?: boolean): Style {
    return new Style({
      stroke: new Stroke({
        color: selected ? '#1177dd' : '#3399ff',
        width: 2
      })
    });
  }

  private createLabelStyle(feature: Feature, selected?: boolean): Style {
    const properties = feature.getProperties();
    if (typeof properties.text !== 'string') {
      throw new TypeError('Текст не текст');
    }
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/></svg>';

    return new Style({
      image: new Icon({
        src: 'data:image/svg+xml,' + encodeURIComponent(svg),
        opacity: selected ? 0.5 : 0
      }),
      text: new Text({
        font: '16px sans-serif',
        textAlign: 'left',
        justify: 'left',
        offsetX: 17,
        offsetY: 2,
        text: properties.text,
        fill: new Fill({
          color: [20, 20, 20, 1]
        }),
        backgroundFill: new Fill({
          color: [255, 255, 255, selected ? 0.9 : 0.6]
        }),
        padding: [5, 5, 3, 5]
      })
    });
  }

  private createPrintLabelStyle(feature: Feature): Style {
    const properties = feature.getProperties();
    if (typeof properties.text !== 'string') {
      throw new TypeError('Текст не текст');
    }

    return new Style({
      text: new Text({
        font: '16px sans-serif',
        textAlign: 'center',
        justify: 'center',
        offsetX: 0,
        offsetY: 0,
        text: properties.text,
        fill: new Fill({
          color: [20, 20, 20, 1]
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 3
        })
      })
    });
  }

  private getLabelType(feature: Feature): LabelType {
    const properties = feature.getProperties();

    return properties.type as LabelType;
  }

  @boundMethod
  private handlePointerMove(e: MapBrowserEvent<PointerEvent>) {
    const wasSelected = this.selectedFeature;
    delete this.selectedFeature;
    let selectedAgain = false;

    if (!this.modifyingNow) {
      mapService.map.forEachFeatureAtPixel(
        e.pixel,
        feature => {
          if (!(feature instanceof Feature)) {
            throw new TypeError('Label feature error');
          }
          if (feature === wasSelected) {
            selectedAgain = true;
          } else {
            feature.setStyle(this.createStyle(feature, true));
          }

          if (e.dragging || this.toolboxHovered) {
            this.renderLabelToolboxDebounced.cancel();
            if (this.toolboxHovered) {
              this.removeLabelToolboxDebounced.cancel();
            }
          } else {
            this.renderLabelToolboxDebounced(feature, e.coordinate);
          }
          this.selectedFeature = feature;

          return true; // так будет подсвечена только одна фича
        },
        { layerFilter: layer => layer === this.layer, hitTolerance: 10 }
      );

      if (!selectedAgain && wasSelected && !this.toolboxHovered) {
        wasSelected.setStyle(this.createStyle(wasSelected));
        this.removeLabelToolboxDebounced();
      }
    }
  }

  private renderLabelToolbox(feature: Feature, position: Coordinate) {
    this.removeLabelToolbox();

    const toolboxNode = document.createElement('div');
    toolboxNode.className = 'MapLabelToolboxRoot';
    this.currentToolboxRoot = createRoot(toolboxNode);
    const reactElement = createElement(MapLabelToolbox, {
      feature,
      labelType: this.getLabelType(feature),
      onEdit: this.editLabel,
      onRemove: this.removeItem,
      onMouseEnter: this.handleToolboxMouseEnter,
      onMouseLeave: this.handleToolboxMouseLeave
    });
    this.currentToolboxRoot.render(reactElement);

    this.currentOverlay = new Overlay({
      element: toolboxNode,
      position,
      positioning: 'bottom-left'
    });

    mapService.map.addOverlay(this.currentOverlay);
  }

  private removeLabelToolbox() {
    this.renderLabelToolboxDebounced.cancel();
    if (this.currentOverlay) {
      this.currentToolboxRoot?.unmount();
      mapService.map.removeOverlay(this.currentOverlay);
      delete this.currentOverlay;
      delete this.currentToolboxRoot;
      this.toolboxHovered = false;
    }
  }

  @boundMethod
  private handleToolboxMouseEnter() {
    this.toolboxHovered = true;
    this.removeLabelToolboxDebounced.cancel();
  }

  @boundMethod
  private handleToolboxMouseLeave() {
    this.toolboxHovered = false;
  }

  showPrintLabels() {
    mapService.map.addLayer(this.layerForPrintLabels);
  }

  hidePrintLabels() {
    mapService.map.removeLayer(this.layerForPrintLabels);
    this.sourceForPrintLabels.clear();
  }

  addPrintLabel(center: Coordinate, text: string | number) {
    const feature = new Feature({
      geometry: new Point(center),
      type: 'label',
      text: String(text)
    });
    feature.setStyle(this.createPrintLabelStyle(feature));
    this.sourceForPrintLabels.addFeatures([feature]);
  }
}

export const mapLabelsService = MapLabelsService.instance;
