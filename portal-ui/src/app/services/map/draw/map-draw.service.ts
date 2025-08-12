import { MapBrowserEvent } from 'ol';
import { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';
import { Geometry, MultiPolygon } from 'ol/geom';
import { Draw, Modify, Translate } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import { ModifyEvent } from 'ol/interaction/Modify';
import { Vector as VectorLayer } from 'ol/layer';
import Overlay from 'ol/Overlay';
import { Vector as VectorSource } from 'ol/source';

import { mapStore } from '../../../stores/Map.store';
import { communicationService } from '../../communication.service';
import { Projection } from '../../data/projections/projections.models';
import { getFeatureProjection, getOlProjection } from '../../data/projections/projections.service';
import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { transformGeometry } from '../../util/coordinates-transform.util';
import { wfsFeaturesToOlFeatures } from '../../util/open-layers.util';
import { sleep } from '../../util/sleep';
import { isBoolean } from '../../util/typeGuards/isBoolean';
import { editFeatureStore } from '../a-map-mode/edit-feature/EditFeatureStore';
import { selectedFeaturesStore } from '../a-map-mode/selected-features/SelectedFeatures.store';
import { FeatureState, ToolMode } from '../map.models';
import { mapService } from '../map.service';
import { mapSnapService } from '../snap/map-snap.service';
import { getStyle, KnownStyleKey } from '../styles/map-styles';
import { SingleDrawGeometryType } from './map-draw.models';

class MapDrawService {
  private static _instance: MapDrawService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private removeVerticesHintElement: HTMLDivElement | undefined;
  private removeVerticesHintOverlay: Overlay | undefined;
  private isAltPressed = false;

  private translate: Translate | undefined;
  private modify: Modify | undefined;
  private draw: Draw | undefined;
  private source: VectorSource = new VectorSource<Feature<Geometry>>({
    features: []
  });

  initializeDraw() {
    const drawLayer = new VectorLayer({
      source: this.source,
      zIndex: mapService.DRAFT_LAYER_Z_INDEX,
      properties: { name: 'draft' }
    });

    mapService.map.addLayer(drawLayer);
  }

  async drawOn(geometryType: SingleDrawGeometryType) {
    const features = await mapDrawService.getFeatures();

    const { activeFeature } = selectedFeaturesStore;
    const highlightedFeature = features.find(feature => feature.getId() === activeFeature?.id);

    if (activeFeature && highlightedFeature) {
      highlightedFeature.set(FeatureState.ACTIVE, true);
    }

    features.forEach(feature => {
      const isActive: unknown = feature.get(FeatureState.ACTIVE);
      if (isBoolean(isActive) && isActive) {
        feature.setStyle(getStyle(KnownStyleKey.DrawingFeature));
      } else {
        feature.setStyle(getStyle(KnownStyleKey.SelectedFeaturesWithVertices));
      }
    });

    // Modify
    this.modify = new Modify({
      source: this.source,
      condition: event => {
        const closestFeature = this.source.getClosestFeatureToCoordinate(event.coordinate);
        if (closestFeature === undefined || closestFeature?.getId() === undefined) {
          return true;
        }

        return editFeatureStore.firstFeature?.id === closestFeature.getId();
      }
    });

    this.modify.on('modifyend', (event: ModifyEvent) => {
      communicationService.modifyEnd.emit(event);
    });

    mapService.map.addInteraction(this.modify);

    // Draw
    this.draw = new Draw({
      source: this.source,
      type: geometryType,
      style: getStyle(KnownStyleKey.DrawingFeature),
      freehandCondition: () => false
    });

    this.draw.setActive(true);
    this.draw?.on('drawend', (event: DrawEvent) => {
      communicationService.drawEnd.emit(event);
    });

    mapStore.setToolMode(ToolMode.DRAW);
    mapService.map.addInteraction(this.draw);
    mapSnapService.activate();

    this.initHintOverlay();
  }

  drawOff() {
    if (this.draw) {
      this.draw.setActive(false);
      mapService.map.removeInteraction(this.draw);
      this.draw = undefined;
    }

    if (this.modify) {
      this.modify.setActive(false);
      mapService.map.removeInteraction(this.modify);
      this.modify = undefined;
    }

    if (this.translate) {
      this.translate.setActive(false);
      mapService.map.removeInteraction(this.translate);
      this.translate = undefined;
    }

    mapStore.setToolMode(ToolMode.NONE);
    mapSnapService.deactivate();

    mapDrawService
      .getDrawSource()
      .getFeatures()
      .forEach(feature => {
        const isActive: unknown = feature.get(FeatureState.ACTIVE);
        if (isBoolean(isActive) && isActive) {
          feature.setStyle(getStyle(KnownStyleKey.ActiveFeature));
        } else {
          feature.setStyle(getStyle(KnownStyleKey.SelectedFeatures));
        }
      });

    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    mapService.map.un('pointermove', this.handlePointerMove);

    if (this.removeVerticesHintOverlay) {
      mapService.map.removeOverlay(this.removeVerticesHintOverlay);
    }
  }

  /**
   * Перерисовывает фичи на черновом слое. (очищает черновой слой)
   */
  async reDrawFeatures(newFeatures: WfsFeature[] = [], projection?: Projection) {
    const { features, activeFeature } = selectedFeaturesStore;
    const featuresInOlProjection: WfsFeature[] = await this.convertFeatureToOlProjection(
      [...features, ...newFeatures],
      projection
    );

    const selectedFeatures = wfsFeaturesToOlFeatures(featuresInOlProjection);
    selectedFeatures.forEach(feature => {
      feature.set(FeatureState.SELECTED, true);
      feature.setStyle(getStyle(KnownStyleKey.SelectedFeatures));
    });

    const highlightedFeature = selectedFeatures.find(feature => feature.getId() === activeFeature?.id);

    this.clearDraft();

    if (activeFeature && highlightedFeature) {
      highlightedFeature.set(FeatureState.ACTIVE, true);
      highlightedFeature.setStyle(getStyle(KnownStyleKey.ActiveFeature));

      const combinedFeatures = [...selectedFeatures];
      const highlightedFeatureId = highlightedFeature.getId();

      const existingIndex = selectedFeatures.findIndex(f => f.getId() === highlightedFeatureId);

      if (existingIndex >= 0) {
        combinedFeatures[existingIndex] = highlightedFeature;
      } else {
        combinedFeatures.push(highlightedFeature);
      }

      this.addFeatures(combinedFeatures);
    } else {
      this.addFeatures(selectedFeatures);
    }
  }

  // Обновим "выделенные фичи" "измененными"
  async drawMoreFeatures(modifiedFeatures: WfsFeature[]) {
    const selectedFeatures = selectedFeaturesStore.features;
    for (const modifiedFeature of modifiedFeatures) {
      const existingFeatureIndex = selectedFeatures.findIndex(f => f.id === modifiedFeature.id);
      if (existingFeatureIndex === -1) {
        selectedFeatures.push(modifiedFeature);
      } else {
        selectedFeatures[existingFeatureIndex] = modifiedFeature;
      }
    }

    await this.reDrawFeatures(selectedFeatures);
  }

  // Очистить карту от слоя, который отображал объект.
  clearDraft() {
    const collection = this.source.getFeaturesCollection();
    const count = collection ? collection.getLength() : 0;
    this.source.clear(count > 10);
  }

  addFeatures(features: Feature<Geometry>[]) {
    this.source.addFeatures(features);
  }

  removeFeature(feature: Feature<Geometry>) {
    this.source.removeFeature(feature);
  }

  showSelectionMarker(coordinates: Coordinate[][][]) {
    if (!this.source) {
      throw new Error('Невозможно отобразить рамку выделения, нет соответствующего слоя');
    }

    const olFeature = new Feature(new MultiPolygon(coordinates));
    olFeature.setStyle(getStyle(KnownStyleKey.Prokol));
    if (olFeature) {
      this.source.addFeature(olFeature);

      setTimeout(() => {
        try {
          this.source?.removeFeature(olFeature);
        } catch {}
      }, 200);
    }
  }

  getDrawSource(): VectorSource {
    return this.source;
  }

  async getFeatures(): Promise<Feature<Geometry>[]> {
    await sleep(0);

    return this.source.getFeatures();
  }

  private async convertFeatureToOlProjection(features: WfsFeature[], projection?: Projection): Promise<WfsFeature[]> {
    return await Promise.all(
      [...features]
        .filter(({ geometry }) => geometry)
        .map(async (feature: WfsFeature): Promise<WfsFeature> => {
          const currentProjection = projection || (await getFeatureProjection(feature));
          const olProjection = await getOlProjection();

          if (!currentProjection || !olProjection) {
            throw new Error('Не найдена проекция выбранного объекта');
          }

          const geometry = feature.geometry && transformGeometry(feature.geometry, currentProjection, olProjection);

          if (!geometry) {
            throw new Error('Геометрия не определена');
          }

          return {
            ...feature,
            geometry
          };
        })
    );
  }

  private initHintOverlay(): void {
    this.removeVerticesHintElement = document.createElement('div');
    this.removeVerticesHintElement.className = 'remove-vertices-hint';

    this.removeVerticesHintOverlay = new Overlay({
      element: this.removeVerticesHintElement,
      positioning: 'center-left',
      offset: [15, 0],
      stopEvent: false
    });

    mapService.map.addOverlay(this.removeVerticesHintOverlay);

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    mapService.map.on('pointermove', this.handlePointerMove);

    // Обработчики клавиш
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  private handlePointerMove = (e: MapBrowserEvent<UIEvent>): void => {
    if (!this.draw) {
      return;
    }

    if (this.isAltPressed) {
      if (this.removeVerticesHintElement) {
        this.removeVerticesHintElement.innerHTML = 'Удалить вершину';
      }

      if (this.removeVerticesHintOverlay) {
        this.removeVerticesHintOverlay.setPosition(e.coordinate);
      }
    } else if (this.removeVerticesHintOverlay) {
      this.removeVerticesHintOverlay.setPosition(undefined);
    }
  };

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Alt') {
      this.isAltPressed = true;
    }
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    if (e.key === 'Alt') {
      this.isAltPressed = false;
    }
  };
}

export const mapDrawService = MapDrawService.instance;
