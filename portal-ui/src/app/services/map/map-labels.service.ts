import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { reaction } from 'mobx';
import { withRegistry } from '@bem-react/di';
import { bearing, point, toWgs84 } from '@turf/turf';
import { boundMethod } from 'autobind-decorator';
import { debounce } from 'lodash';
import { Feature, MapBrowserEvent, Overlay } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { LineString, Point, Polygon } from 'ol/geom';
import { Draw, Modify } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style, Text } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { v4 as uuid } from 'uuid';

import { MapLabelToolbox } from '../../components/MapLabelToolbox/MapLabelToolbox';
import { currentProject } from '../../stores/CurrentProject.store';
import { currentUser } from '../../stores/CurrentUser.store';
import { mapStore } from '../../stores/Map.store';
import { communicationService } from '../communication.service';
import { defaultOlProjectionCode, Projection } from '../data/projections/projections.models';
import { getOlProjection } from '../data/projections/projections.service';
import { Coord, transformCoord, transformGroup } from '../data/projections/projections.util';
import { registry } from '../di-registry';
import { GeometryType, WfsFeature } from '../geoserver/wfs/wfs.models';
import { isLinear, isPolygonal } from '../geoserver/wfs/wfs.util';
import { notFalsyFilter } from '../util/NotFalsyFilter';
import { featureToWfsFeature, UnitsOfAreaMeasurement, wfsFeatureToFeature } from '../util/open-layers.util';
import { sleep } from '../util/sleep';
import { createStyle, getLabelType } from '../util/style.util';
import { isAnnotationsFontProperties } from '../util/typeGuards/isAnnotationsFontProperties';
import { isArrayOf } from '../util/typeGuards/isArrayOf';
import { isCoordinate, isCoordinateArray, isCoordinateArrayArray } from '../util/typeGuards/isCoordinate';
import { isNumberArray } from '../util/typeGuards/isNumberArray';
import { prompto } from '../utility-dialogs.service';
import { MapMode } from './map.models';
import { mapService } from './map.service';
import { AnnotationsFontProperties, Distance, FontProperties, LabelType } from './map-labels.models';
import {
  getFeatureArea,
  getFeatureLength,
  getLabelPosition,
  getMiddlePoints,
  getPointsWithAngles,
  getRotationByAzimuth,
  getSelectedFeatureProjection,
  getSelectedOrActiveFeature,
  transformAnyCoordinates
} from './map-labels.util';
import { mapMeasureService } from './map-measure.service';

const baseStyle: FontProperties = {
  isBold: false,
  isItalic: false,
  fontSize: 18,
  fontColor: '#141414',
  textAlign: 'left'
};
const MARK_FILL_COLOR = 'rgba(255, 255, 255, 0.5)';

class MapLabelsService {
  private static _instance: MapLabelsService;
  private draw?: Draw;
  private modify?: Modify;
  private selectedFeature?: Feature;
  private modifyingNow = false;
  private currentToolboxRoot?: Root;
  private currentOverlay?: Overlay;

  private labelsSource = new VectorSource();
  private layerForLabels = new VectorLayer({
    source: this.labelsSource,
    zIndex: mapService.LABELS_LAYER_ZINDEX,
    properties: { name: 'labels' }
  });
  private turningPointsSource = new VectorSource();
  private layerForTurningPoints = new VectorLayer({
    source: this.turningPointsSource,
    zIndex: mapService.LABELS_LAYER_ZINDEX,
    properties: { name: 'turningPoints' }
  });
  private sourceForPrintLabels = new VectorSource();
  private layerForPrintLabels = new VectorLayer({
    source: this.sourceForPrintLabels,
    zIndex: mapService.LABELS_LAYER_ZINDEX,
    properties: { name: 'printLabels' }
  });

  private renderLabelToolboxDebounced = debounce(this.renderLabelToolbox, 500);
  private removeLabelToolboxDebounced = debounce(this.removeLabelToolbox, 500);
  private toolboxHovered = false;

  userLabelsSettings: AnnotationsFontProperties = {
    area: { ...baseStyle },
    length: { ...baseStyle },
    turningPoints: { ...baseStyle },
    distances: { ...baseStyle, fontSize: 14 },
    annotations: { ...baseStyle }
  };

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
      if (layer === this.layerForLabels) {
        return true;
      }
    }

    return false;
  }

  private getDistancesByCoords(coordinates: Coord[], projFrom: Projection, projTo: Projection): Distance[] {
    if (!isCoordinateArray(coordinates)) {
      throw new Error('Указанные координаты не являются полигоном');
    }

    const polygon = new Polygon([coordinates]);
    const distances = [];

    for (let i = 0; i < coordinates.length; i += 1) {
      const pointA = coordinates[i];
      const pointB = coordinates[i === coordinates.length - 1 ? 0 : i + 1];

      const lineString = new LineString([pointA, pointB]);
      const [value, units] = getFeatureLength({ geometry: lineString, projection: projFrom });
      const center = lineString.getFlatMidpoint();
      const perpendicularPoint = [center[0], center[1] + 10];
      const isLabelInPolygon = polygon.intersectsCoordinate(perpendicularPoint);
      const azimuth = bearing(
        toWgs84(point(pointA, { crs: { type: 'pointA', properties: { name: defaultOlProjectionCode } } })),
        toWgs84(point(pointB, { crs: { type: 'pointB', properties: { name: defaultOlProjectionCode } } }))
      );

      distances.push({
        distance: { value, units },
        center: transformCoord(center, projFrom, projTo) as number[],
        isLabelInPolygon,
        azimuth
      });
    }

    return distances;
  }

  private getFlatGroups(coordinates: Coordinate[] | Coordinate[][] | Coordinate[][][]): Coordinate[][] {
    if (isArrayOf(coordinates, isCoordinate)) {
      return [coordinates];
    } else if (isCoordinateArrayArray(coordinates)) {
      return coordinates;
    }

    return this.getFlatGroups(coordinates.flat());
  }

  private getDistancesFeatures({
    projFrom,
    olProjection: projTo,
    coordinates,
    properties
  }: {
    projFrom: Projection;
    olProjection: Projection;
    coordinates: Coordinate[] | Coordinate[][] | Coordinate[][][];
    properties?: Record<string, unknown>;
  }): Feature<Point>[] {
    let distances: Distance[] = [];

    for (const group of this.getFlatGroups(coordinates)) {
      distances.push(...this.getDistancesByCoords(group, projFrom, projTo));
    }

    if (!distances?.length) {
      return [];
    }

    distances = distances.filter(({ distance }) => distance.value > 0);

    return distances
      .map(coord => {
        if (isNumberArray(coord.center)) {
          const rotation = getRotationByAzimuth(coord.azimuth);

          const feature = new Feature({
            geometry: new Point(coord.center),
            type: 'label',
            text: `${coord.distance.value} ${coord.distance.units}`,
            textProperties: properties ? { ...properties } : undefined,
            rotation,
            isLabelInPolygon: coord.isLabelInPolygon,
            centred: true
          });

          feature.setId(uuid());
          feature.setStyle(createStyle(feature));

          return feature;
        }
      })
      .filter(notFalsyFilter);
  }

  async addFeatureArea(): Promise<void> {
    this.dropInteractions();
    const wfsFeature = this.getSelectedOrActiveFeatureOrThrow();
    const feature = wfsFeatureToFeature(wfsFeature);
    const geometry = feature.getGeometry();

    if (!geometry) {
      throw new Error('Ошибка геометрии объекта');
    }

    const [value, units] = getFeatureArea(geometry, UnitsOfAreaMeasurement.HECTARE, 4);
    const middlePoints = getMiddlePoints(feature);

    for (const point of middlePoints) {
      const pointCoordinates = transformCoord(
        point.getCoordinates().slice(0, 2),
        await getSelectedFeatureProjection(),
        await getOlProjection()
      );

      if (!isCoordinate(pointCoordinates) || !isNumberArray(pointCoordinates)) {
        throw new Error('Координаты точки некорректны');
      }

      const feature = new Feature({
        geometry: new Point(pointCoordinates),
        type: 'label',
        text: `S = ${value} ${units}`,
        isLabelInPolygon: true,
        textProperties: { ...this.userLabelsSettings.area }
      });

      feature.setId(uuid());
      feature.setStyle(createStyle(feature));

      this.labelsSource.addFeature(feature);
    }

    await sleep(0);
    this.saveToStorages();
  }

  async addFeatureLength(): Promise<void> {
    this.dropInteractions();

    const wfsFeature = this.getSelectedOrActiveFeatureOrThrow();
    const feature = wfsFeatureToFeature(wfsFeature);
    const geometry = feature.getGeometry();

    if (!geometry) {
      throw new Error('Ошибка геометрии объекта');
    }

    const currentLayerProjection = await getSelectedFeatureProjection();
    const [value, units] = getFeatureLength({ geometry, projection: currentLayerProjection, precision: 4 });
    const middlePoints = getMiddlePoints(feature);

    const olMiddlePoints = transformAnyCoordinates(
      middlePoints.map(point => point.getCoordinates()),
      currentLayerProjection,
      await getOlProjection()
    );

    if (!olMiddlePoints || !isCoordinateArray(olMiddlePoints)) {
      throw new Error('Координаты точки некорректны');
    }

    for (const point of olMiddlePoints) {
      const feature = new Feature({
        geometry: new Point(point),
        type: 'label',
        text: `${!!wfsFeature.geometry?.type && isLinear(wfsFeature.geometry?.type) ? 'L' : 'P'} = ${value} ${units}`,
        textProperties: { ...this.userLabelsSettings.length }
      });

      feature.setId(uuid());
      feature.setStyle(createStyle(feature));

      this.labelsSource.addFeature(feature);
    }

    await sleep(0);
    this.saveToStorages();
  }

  async addPointsDistances(): Promise<void> {
    this.dropInteractions();

    const coordinates = getSelectedOrActiveFeature()?.geometry?.coordinates;
    if (!coordinates || isNumberArray(coordinates)) {
      return;
    }

    const features = this.getDistancesFeatures({
      projFrom: await getSelectedFeatureProjection(),
      olProjection: await getOlProjection(),
      coordinates,
      properties: { ...this.userLabelsSettings.distances }
    });

    this.labelsSource.addFeatures(features);

    await sleep(0);
    this.saveToStorages();
  }

  async addTurningPoints() {
    this.dropInteractions();

    const wfsFeature = this.getSelectedOrActiveFeatureOrThrow();
    const coordinates = wfsFeature.geometry?.coordinates;
    const geometryType = wfsFeature.geometry?.type;

    if (!coordinates || !geometryType) {
      throw new Error('Отсутствие координат объекта');
    }

    const pointsCoordinates = this.getTurningPointsFromCoordinates(coordinates, geometryType);
    const transformedCoordinates = transformGroup(
      pointsCoordinates,
      await getSelectedFeatureProjection(),
      await getOlProjection()
    );

    if (!isCoordinateArray(transformedCoordinates)) {
      return;
    }

    const angles = getPointsWithAngles(transformedCoordinates);
    const labelsFeatures = angles
      .map(({ angle, point, isLabelInPolygon }, index) => {
        const position = getLabelPosition(angle, isLabelInPolygon);

        const feature = new Feature({
          geometry: new Point(point),
          type: 'label',
          text: String(index + 1),
          position,
          textProperties: { ...this.userLabelsSettings.turningPoints }
        });

        feature.setId(uuid());
        feature.setStyle(createStyle(feature));

        return feature;
      })
      .filter(notFalsyFilter);

    const turningPoints = this.createFeatures(transformedCoordinates, 'turningPoints');
    this.turningPointsSource.addFeatures(turningPoints);
    this.labelsSource.addFeatures(labelsFeatures);

    await sleep(0);
    this.saveToStorages();
  }

  private getTurningPointsFromCoordinates(
    coordinates: Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][],
    geometryType: GeometryType
  ): Coordinate[] {
    if (isNumberArray(coordinates)) {
      return [coordinates];
    }

    const resultCoordinates: Coordinate[] = [];

    if (isCoordinateArray(coordinates)) {
      resultCoordinates.push(...coordinates);
      if (isPolygonal(geometryType)) {
        resultCoordinates.pop();
      }
    } else {
      for (const subgroup of coordinates) {
        resultCoordinates.push(...this.getTurningPointsFromCoordinates(subgroup, geometryType));
      }
    }

    return resultCoordinates;
  }

  dropInteractions() {
    this.drawOff();
    mapService.drawOff();
    mapMeasureService.measureOff();
  }

  createFeatures(transformedCoordinates: Coord[], type: LabelType): Feature<Point>[] {
    return transformedCoordinates
      .map((coord, index) => {
        if (isNumberArray(coord)) {
          const feature = new Feature({
            geometry: new Point(coord),
            type,
            text: String(index + 1)
          });

          feature.setId(uuid());
          feature.setStyle(createStyle(feature));

          return feature;
        }
      })
      .filter(notFalsyFilter);
  }

  async addingLabelOn(type: LabelType) {
    this.dropInteractions();

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
      source: this.labelsSource,
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
    if (mapStore.currentLabelType === 'label' || mapStore.currentLabelType === 'turningPoints') {
      await this.editLabel(feature);
    } else {
      await sleep(0);
      this.saveToStorages();
    }
    feature.setStyle(createStyle(feature));
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

    feature.setProperties({
      ...feature.getProperties(),
      text,
      textProperties: this.userLabelsSettings.annotations
    });
    this.saveToStorages();
  }

  @boundMethod
  private removeItem(feature: Feature) {
    if (this.labelsSource.hasFeature(feature)) {
      this.labelsSource.removeFeature(feature);
    }

    if (this.turningPointsSource.hasFeature(feature)) {
      this.turningPointsSource.removeFeature(feature);
    }

    this.saveToStorages();
    this.removeLabelToolbox();
  }

  clearAll() {
    for (const feature of this.labelsSource.getFeatures()) {
      this.labelsSource.removeFeature(feature);
    }

    for (const feature of this.turningPointsSource.getFeatures()) {
      this.turningPointsSource.removeFeature(feature);
    }

    this.saveToStorages();
  }

  async show() {
    await mapService.waitForMap();

    if (this.shown) {
      return;
    }

    mapService.map.addLayer(this.layerForLabels);
    mapService.map.addLayer(this.layerForTurningPoints);

    this.modify = new Modify({ source: this.labelsSource });

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

      const userLabelsStyles: unknown = JSON.parse(
        localStorage.getItem(this.getStorageKey('userLabelsSettings')) || ''
      );

      if (!!userLabelsStyles && isAnnotationsFontProperties(userLabelsStyles)) {
        this.setLabelsSettings(userLabelsStyles);
      }
    } catch {
      // do nothing
    }

    const olFeatures = wfsFeatures.map(wfsFeature => {
      const feature = wfsFeatureToFeature(wfsFeature);

      if (!feature) {
        throw new Error('feature error');
      }

      feature.setStyle(createStyle(feature));

      return feature;
    });

    this.labelsSource.clear();
    this.labelsSource.addFeatures(
      olFeatures.filter(feature => feature.getProperties().type === 'label' || feature.getProperties().type === 'line')
    );

    this.turningPointsSource.clear();
    this.turningPointsSource.addFeatures(
      olFeatures.filter(features => features.getProperties().type === 'turningPoints')
    );

    mapStore.setLabels(olFeatures);
  }

  hide() {
    this.drawOff();
    this.modifyOff();
    mapService.map.removeLayer(this.layerForLabels);
    mapService.map.removeLayer(this.layerForTurningPoints);
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

  saveToStorages() {
    const olFeatures = [...this.labelsSource.getFeatures(), ...this.turningPointsSource.getFeatures()];
    const wfsFeatures: WfsFeature[] = olFeatures.map(featureToWfsFeature);

    mapStore.setLabels(olFeatures);
    localStorage.setItem(this.getStorageKey('labels'), JSON.stringify(wfsFeatures));
  }

  getStorageKey(key: string): string {
    return `mapLabels_${key}_${currentUser.id}_${currentProject.id}`;
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

  setLabelsSettings(fontProperties: AnnotationsFontProperties): void {
    this.userLabelsSettings = fontProperties;
    localStorage.setItem(this.getStorageKey('userLabelsSettings'), JSON.stringify(fontProperties)); // do something
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
            feature.setStyle(createStyle(feature, true));
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
        { layerFilter: layer => layer === this.layerForLabels, hitTolerance: 10 }
      );

      if (!selectedAgain && wasSelected && !this.toolboxHovered) {
        wasSelected.setStyle(createStyle(wasSelected));
        this.removeLabelToolboxDebounced();
      }
    }
  }

  private renderLabelToolbox(feature: Feature, position: Coordinate) {
    this.removeLabelToolbox();

    const toolboxNode = document.createElement('div');
    toolboxNode.className = 'MapLabelToolboxRoot';
    this.currentToolboxRoot = createRoot(toolboxNode);
    const MapLabelToolboxWithRegistry = withRegistry(registry)(MapLabelToolbox);
    const reactElement = createElement(MapLabelToolboxWithRegistry, {
      feature,
      labelType: getLabelType(feature),
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

  removeLabelToolbox() {
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

  private getSelectedOrActiveFeatureOrThrow() {
    const wfsFeature = getSelectedOrActiveFeature();
    if (!wfsFeature) {
      throw new Error('Отсутствует выделенная/активная фича');
    }

    return wfsFeature;
  }
}

export const mapLabelsService = MapLabelsService.instance;
