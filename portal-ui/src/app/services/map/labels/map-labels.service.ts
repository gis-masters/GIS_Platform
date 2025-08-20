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
import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
import { v4 as uuid } from 'uuid';

import { MapLabelToolbox } from '../../../components/MapLabelToolbox/MapLabelToolbox';
import { currentProject } from '../../../stores/CurrentProject.store';
import { currentUser } from '../../../stores/CurrentUser.store';
import { mapStore } from '../../../stores/Map.store';
import { mapLabelsStore } from '../../../stores/MapLabels.store';
import { communicationService } from '../../communication.service';
import { defaultOlProjectionCode, Projection } from '../../data/projections/projections.models';
import { getOlProjection, getProjectionByCode } from '../../data/projections/projections.service';
import { getProjectionCode } from '../../data/projections/projections.util';
import { registry } from '../../di-registry';
import { extractTableNameFromFeatureId } from '../../geoserver/featureType/featureType.util';
import { GeometryType, supportedGeometryTypes, WfsFeature } from '../../geoserver/wfs/wfs.models';
import { isLinear, isPolygonal } from '../../geoserver/wfs/wfs.util';
import { transformCoord, transformGroup } from '../../util/coordinates-transform.util';
import { notFalsyFilter } from '../../util/NotFalsyFilter';
import { featureToWfsFeature, UnitsOfAreaMeasurement, wfsFeatureToFeature } from '../../util/open-layers.util';
import { sleep } from '../../util/sleep';
import { isAnnotationsFontProperties } from '../../util/typeGuards/isAnnotationsFontProperties';
import { isArrayOf } from '../../util/typeGuards/isArrayOf';
import { isCircleProperties } from '../../util/typeGuards/isCircleProperties';
import { isCoordinate, isCoordinateArray, isCoordinateArrayArray } from '../../util/typeGuards/isCoordinate';
import { isNumberArray } from '../../util/typeGuards/isNumberArray';
import { prompto } from '../../utility-dialogs.service';
import { editFeatureStore } from '../a-map-mode/edit-feature/EditFeatureStore';
import { selectedFeaturesStore } from '../a-map-mode/selected-features/SelectedFeatures.store';
import { mapDrawService } from '../draw/map-draw.service';
import { MapMode, ToolMode } from '../map.models';
import { mapService } from '../map.service';
import { mapMeasureService } from '../measure/map-measure.service';
import { getStyle, KnownStyleKey } from '../styles/map-styles';
import { AnnotationsFontProperties, CircleProperties, Distance, FontProperties, LabelType } from './map-labels.models';
import {
  getCircleStyle,
  getFeatureArea,
  getFeatureLength,
  getLabelPosition,
  getMiddlePoints,
  getPointsWithAngles,
  getRotationByAzimuth,
  getTextStyle
} from './map-labels.util';

const projectionError = 'Отсутствует проекция';
const baseStyle: FontProperties = {
  isBold: false,
  isItalic: false,
  fontSize: 18,
  fontColor: '#141414',
  textAlign: 'left'
};
const baseCircleStyle: CircleProperties = {
  fillColor: '#FFA343',
  strokeColor: '#fff',
  radius: '6'
};

class MapLabelsService {
  private static _instance: MapLabelsService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private draw?: Draw;
  private modify?: Modify;
  private source = new VectorSource();
  private turningPointsSource = new VectorSource();
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
  private layerForTurningPoints = new VectorLayer({
    source: this.turningPointsSource,
    zIndex: mapService.LABELS_LAYER_ZINDEX,
    properties: { name: 'turningPoints' }
  });
  private layerForPrintLabels = new VectorLayer({
    source: this.sourceForPrintLabels,
    zIndex: mapService.LABELS_LAYER_ZINDEX,
    properties: { name: 'printLabels' }
  });
  private renderLabelToolboxDebounced = debounce(this.renderLabelToolbox, 500);
  private removeLabelToolboxDebounced = debounce(this.removeLabelToolbox, 500);
  private toolboxHovered = false;

  turningPointsCircleStyles: CircleProperties = baseCircleStyle;
  userLabelsSettings: AnnotationsFontProperties = {
    area: { ...baseStyle },
    length: { ...baseStyle },
    turningPoints: { ...baseStyle },
    distances: { ...baseStyle, fontSize: 14 },
    annotations: { ...baseStyle }
  };

  private constructor() {
    reaction(
      () => mapStore.toolMode,
      mode => {
        if (mode !== ToolMode.ADDING_LABEL && this.shown) {
          this.drawOff();
        }
      }
    );

    reaction(
      () => mapLabelsStore.labelsVisible,
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

  setLabelsSettings(fontProperties: AnnotationsFontProperties): void {
    this.userLabelsSettings = fontProperties;
    localStorage.setItem(this.getStorageKey('userLabelsSettings'), JSON.stringify(fontProperties)); // do something
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
  setTurningPointsCircleStyles(turningPointsCircleStyles: CircleProperties) {
    this.turningPointsCircleStyles = turningPointsCircleStyles;

    localStorage.setItem(
      this.getStorageKey('turningPointsCircleStyles'),
      JSON.stringify(this.turningPointsCircleStyles)
    );
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

  clearAll() {
    for (const feature of this.source.getFeatures()) {
      this.source.removeFeature(feature);
    }

    for (const feature of this.turningPointsSource.getFeatures()) {
      this.turningPointsSource.removeFeature(feature);
    }

    this.saveToStorages();
  }

  saveToStorages() {
    const olFeatures = [...this.source.getFeatures(), ...this.turningPointsSource.getFeatures()];
    const wfsFeatures: WfsFeature[] = olFeatures.map(featureToWfsFeature);

    mapLabelsStore.setLabels(olFeatures);
    localStorage.setItem(this.getStorageKey('labels'), JSON.stringify(wfsFeatures));
  }

  async show() {
    await mapService.waitForMap();

    if (this.shown) {
      return;
    }

    mapService.map.addLayer(this.layer);
    mapService.map.addLayer(this.layerForTurningPoints);

    this.modify = new Modify({ source: this.source });

    mapService.map.addInteraction(this.modify);
    this.modify.on(['modifystart'], this.handleModifyStart);
    this.modify.on(['modifyend'], this.handleModifyEnd);

    this.restoreLabelsState();

    mapService.map.on('pointermove', this.handlePointerMove);
  }

  @boundMethod
  getStorageKey(key: string): string {
    return `mapLabels_${key}_${currentUser.id}_${currentProject.id}`;
  }

  @boundMethod
  async addingLabelOn(type: LabelType) {
    this.dropInteractions();

    mapStore.setToolMode(ToolMode.ADDING_LABEL);
    mapLabelsStore.setCurrentLabelType(type);

    await this.show();

    this.draw = this.getDraw(type);
    this.draw.on('drawend', this.handleDrawEnd);

    mapService.map.addInteraction(this.draw);
  }

  @boundMethod
  addingLabelOff() {
    mapLabelsStore.setCurrentLabelType();
    mapStore.setToolMode(ToolMode.NONE);
  }

  // Пока мы умеем работать(площадь, периметр, поворотные точки, промеры) только с одной фичей, будет следующая логика.
  // При редактировании - возвращаем ту фичу что редактируем.
  // При выборе - вернем только если выбрана только одна фича.
  // Иначе null
  getSelectedOneOrEditedFeature(): WfsFeature | null {
    if (mapStore.mode === MapMode.SELECTED_FEATURES) {
      if (selectedFeaturesStore.features.length > 1) {
        return null;
      }

      return selectedFeaturesStore.features[0] || null;
    } else if (mapStore.mode === MapMode.EDIT_FEATURE) {
      return editFeatureStore.firstFeature || null;
    }

    return null;
  }

  async addFeatureArea(): Promise<void> {
    const wfsFeature = this.getSelectedOneOrEditedFeature();
    if (!wfsFeature) {
      return;
    }

    this.dropInteractions();

    const currentLayerProjection = await this.getSelectedFeatureProjection(wfsFeature);
    if (!currentLayerProjection || !wfsFeature) {
      throw new Error(projectionError);
    }

    const feature = wfsFeatureToFeature(wfsFeature);
    const geometry = feature.getGeometry();

    if (!geometry) {
      throw new Error('Ошибка геометрии объекта');
    }

    const [value, units] = getFeatureArea({
      geometry,
      projection:
        getProjectionCode(currentLayerProjection) === defaultOlProjectionCode ? currentLayerProjection : undefined,
      units: UnitsOfAreaMeasurement.HECTARE,
      precision: 4
    });
    const middlePoints = getMiddlePoints(feature);

    for (const point of middlePoints) {
      const pointCoordinates = transformCoord(
        point.getCoordinates().slice(0, 2),
        currentLayerProjection,
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
      feature.setStyle(this.createStyle(feature));

      this.source.addFeature(feature);
    }

    await sleep(0);
    this.saveToStorages();
  }

  async addFeatureLength(): Promise<void> {
    const wfsFeature = this.getSelectedOneOrEditedFeature();
    if (!wfsFeature) {
      return;
    }

    this.dropInteractions();

    const currentLayerProjection = await this.getSelectedFeatureProjection(wfsFeature);
    if (!currentLayerProjection || !wfsFeature) {
      throw new Error(projectionError);
    }

    const feature = wfsFeatureToFeature(wfsFeature);
    const geometry = feature.getGeometry();

    if (!geometry) {
      throw new Error('Ошибка геометрии объекта');
    }

    const [value, units] = getFeatureLength({ geometry, projection: currentLayerProjection, precision: 4 });
    const middlePoints: Point[] = getMiddlePoints(feature);

    const olMiddlePoints = transformGroup(
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
      feature.setStyle(this.createStyle(feature));

      this.source.addFeature(feature);
    }

    await sleep(0);
    this.saveToStorages();
  }

  async addPointsDistances(): Promise<void> {
    const wfsFeature = this.getSelectedOneOrEditedFeature();
    if (!wfsFeature) {
      return;
    }

    this.dropInteractions();

    const currentLayerProjection = await this.getSelectedFeatureProjection(wfsFeature);
    const coordinates = wfsFeature.geometry?.coordinates;

    if (!currentLayerProjection || !coordinates || isNumberArray(coordinates)) {
      return;
    }

    const features = this.getDistancesFeatures({
      projFrom: currentLayerProjection,
      olProjection: await getOlProjection(),
      coordinates,
      properties: { ...this.userLabelsSettings.distances }
    });

    this.source.addFeatures(features);

    await sleep(0);
    this.saveToStorages();
  }

  async addTurningPoints() {
    const wfsFeature = this.getSelectedOneOrEditedFeature();

    if (!wfsFeature) {
      return;
    }

    this.dropInteractions();

    const currentLayerProjection = await this.getSelectedFeatureProjection(wfsFeature);

    if (!currentLayerProjection || !wfsFeature) {
      throw new Error(projectionError);
    }

    const coordinates = wfsFeature.geometry?.coordinates;
    const geometryType = wfsFeature.geometry?.type;

    if (!coordinates || !geometryType) {
      throw new Error('Отсутствие координат объекта');
    }

    if (currentLayerProjection) {
      const pointsCoordinates = this.getTurningPointsFromCoordinates(coordinates, geometryType);
      const transformedCoordinates = transformGroup(pointsCoordinates, currentLayerProjection, await getOlProjection());

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
          feature.setStyle(this.createStyle(feature));

          return feature;
        })
        .filter(notFalsyFilter);

      const turningPoints = this.createFeatures(transformedCoordinates, 'turningPoints');

      this.turningPointsSource.addFeatures(turningPoints);
      this.source.addFeatures(labelsFeatures);

      await sleep(0);
      this.saveToStorages();
    }
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

  private dropInteractions() {
    this.drawOff();
    mapDrawService.drawOff();
    mapMeasureService.measureOff();
  }

  private createFeatures(transformedCoordinates: Coordinate[], type: LabelType): Feature<Point>[] {
    return transformedCoordinates
      .map((coord, index) => {
        if (isNumberArray(coord)) {
          const feature = new Feature({
            geometry: new Point(coord),
            type,
            text: String(index + 1),
            circleProperties: { ...this.turningPointsCircleStyles }
          });

          feature.setId(uuid());
          feature.setStyle(this.createStyle(feature));

          return feature;
        }
      })
      .filter(notFalsyFilter);
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

  @boundMethod
  private async handleDrawEnd(e: DrawEvent) {
    const feature = e.feature;
    feature.setId(uuid());
    feature.setProperties({ type: mapLabelsStore.currentLabelType });
    if (mapLabelsStore.currentLabelType === 'label' || mapLabelsStore.currentLabelType === 'turningPoints') {
      await this.editLabel(feature);
    } else {
      await sleep(0);
      this.saveToStorages();
    }
    feature.setStyle(this.createStyle(feature));
    this.addingLabelOff();
  }

  private getDraw(type: LabelType): Draw {
    return new Draw({
      source: this.source,
      type: type === 'line' ? GeometryType.LINE_STRING : GeometryType.POINT,
      style: getStyle(KnownStyleKey.LabelsDrawStyles)
    });
  }

  @boundMethod
  private async editLabel(feature: Feature) {
    const currentText = feature.getProperties().text as string | undefined;

    const text = await prompto({
      title: 'Текст аннотации:',
      defaultValue: currentText || 'аннотация',
      multiline: true
    });

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
    if (this.source.hasFeature(feature)) {
      this.source.removeFeature(feature);
    }

    if (this.turningPointsSource.hasFeature(feature)) {
      this.turningPointsSource.removeFeature(feature);
    }

    this.saveToStorages();
    this.removeLabelToolbox();
  }

  private hide() {
    this.drawOff();
    this.modifyOff();
    mapService.map.removeLayer(this.layer);
    mapService.map.removeLayer(this.layerForTurningPoints);
    mapService.map.un('pointermove', this.handlePointerMove);
  }

  private restoreLabelsState() {
    let wfsFeatures: WfsFeature[] = [];

    try {
      wfsFeatures = (JSON.parse(localStorage.getItem(this.getStorageKey('labels')) || '') || []) as WfsFeature[];

      const userLabelsStyles: unknown = JSON.parse(
        localStorage.getItem(this.getStorageKey('userLabelsSettings')) || ''
      );

      const turningPointsUserCircleStyleSettings: unknown = JSON.parse(
        localStorage.getItem(this.getStorageKey('turningPointsCircleStyles')) || ''
      );

      if (!!userLabelsStyles && isAnnotationsFontProperties(userLabelsStyles)) {
        this.setLabelsSettings(userLabelsStyles);
      }

      if (!!turningPointsUserCircleStyleSettings && isCircleProperties(turningPointsUserCircleStyleSettings)) {
        this.setTurningPointsCircleStyles(turningPointsUserCircleStyleSettings);
      }
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
    this.source.addFeatures(
      olFeatures.filter(feature => feature.getProperties().type === 'label' || feature.getProperties().type === 'line')
    );

    this.turningPointsSource.clear();
    this.turningPointsSource.addFeatures(
      olFeatures.filter(features => features.getProperties().type === 'turningPoints')
    );

    mapLabelsStore.setLabels(olFeatures);
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

  private createStyle(feature: Feature, selected?: boolean): Style[] {
    if (this.getLabelType(feature) === 'line') {
      return [this.createLineStyle(selected)];
    }

    if (this.getLabelType(feature) === 'label') {
      return [this.createLabelStyle(feature, selected)];
    }

    if (this.getLabelType(feature) === 'turningPoints') {
      return [this.createCircleStyle(feature)];
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

  private createCircleStyle(feature?: Feature): Style {
    return new Style({
      image: getCircleStyle(feature)
    });
  }

  private createLabelStyle(feature: Feature, selected?: boolean): Style {
    const properties = feature.getProperties();

    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/></svg>';

    return new Style({
      image: new Icon({
        src: 'data:image/svg+xml,' + encodeURIComponent(svg),
        opacity: selected ? 0.5 : 0
      }),
      text: getTextStyle(properties)
    });
  }

  private getLabelType(feature: Feature): LabelType {
    const properties = feature.getProperties();

    return properties.type as LabelType;
  }

  private createPrintLabelStyle(feature: Feature): Style {
    const properties = feature.getProperties();

    return new Style({
      text: new Text({
        font: '16px sans-serif',
        textAlign: 'center',
        justify: 'center',
        offsetX: 0,
        offsetY: 0,
        text: typeof properties.text === 'string' ? properties.text : 'Ваш текст',
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
    const MapLabelToolboxWithRegistry = withRegistry(registry)(MapLabelToolbox);
    const reactElement = createElement(MapLabelToolboxWithRegistry, {
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

  @boundMethod
  private handleToolboxMouseEnter() {
    this.toolboxHovered = true;
    this.removeLabelToolboxDebounced.cancel();
  }

  @boundMethod
  private handleToolboxMouseLeave() {
    this.toolboxHovered = false;
  }

  private async getSelectedFeatureProjection(feature?: WfsFeature): Promise<Projection> {
    const layerTableName = feature ? extractTableNameFromFeatureId(feature.id) : null;
    const geometryType = feature?.geometry?.type;

    if (!geometryType || !layerTableName) {
      throw new Error('Отсутствует векторная таблица');
    }

    const layer = currentProject.layers.find(layer => layer.tableName === layerTableName);

    if (!supportedGeometryTypes.includes(geometryType)) {
      throw new Error('Неподдерживаемый тип геометрии');
    }

    if (!layer?.nativeCRS) {
      throw new Error('В слое не указана система координат');
    }

    const currentLayerProjection = await getProjectionByCode(layer?.nativeCRS);
    if (!currentLayerProjection) {
      throw new Error('Отсутствует проекция');
    }

    return currentLayerProjection;
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
          feature.setStyle(this.createStyle(feature));

          return feature;
        }
      })
      .filter(notFalsyFilter);
  }

  private get shown(): boolean {
    for (const layer of mapService.map.getLayers().getArray()) {
      if (layer === this.layer) {
        return true;
      }
    }

    return false;
  }

  private getDistancesByCoords(coordinates: Coordinate[], projFrom: Projection, projTo: Projection): Distance[] {
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
}

export const mapLabelsService = MapLabelsService.instance;
