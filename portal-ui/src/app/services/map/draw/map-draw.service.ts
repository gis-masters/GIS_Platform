import { boundMethod } from 'autobind-decorator';
import { Coordinate } from 'ol/coordinate';
import { SnapEvent } from 'ol/events/SnapEvent';
import Feature from 'ol/Feature';
import { Geometry, MultiPolygon } from 'ol/geom';
import { Draw, Modify, Translate } from 'ol/interaction';
import { DrawEvent } from 'ol/interaction/Draw';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';

import { mapStore } from '../../../stores/Map.store';
import { communicationService } from '../../communication.service';
import { Projection } from '../../data/projections/projections.models';
import { getFeatureProjection, getOlProjection } from '../../data/projections/projections.service';
import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { services } from '../../services';
import { transformGeometry } from '../../util/coordinates-transform.util';
import { wfsFeaturesToOlFeatures } from '../../util/open-layers.util';
import { sleep } from '../../util/sleep';
import { isBoolean } from '../../util/typeGuards/isBoolean';
import { getVertexRemover } from '../../util/vertex/VertexRemoverFactory';
import { editFeatureStore } from '../a-map-mode/edit-feature/EditFeatureStore';
import { selectedFeaturesStore } from '../a-map-mode/selected-features/SelectedFeatures.store';
import { FeatureState, ToolMode } from '../map.models';
import { mapService } from '../map.service';
import { mapSnapService } from '../snap/map-snap.service';
import { getStyle, KnownStyleKey } from '../styles/map-styles';
import { handleGeometry } from './handleModifyGeometry';
import { SingleDrawGeometryType } from './map-draw.models';

class MapDrawService {
  private static _instance: MapDrawService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private translate: Translate | undefined;
  private modify: Modify | undefined;
  private draw: Draw | undefined;
  private source: VectorSource = new VectorSource<Feature<Geometry>>({
    features: []
  });

  private isDrawEndClick = false;

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

    this.modify.on('modifyend', () => {
      void handleGeometry();
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
      event.feature.setStyle(getStyle(KnownStyleKey.DrawingFeature));

      this.isDrawEndClick = true;

      void handleGeometry();
    });

    mapService.map.on('dblclick', this.handleDoubleClick);

    mapStore.setToolMode(ToolMode.DRAW);
    mapService.map.addInteraction(this.draw);
    mapSnapService.activate();
    communicationService.snapDblClick.on((event: CustomEvent<SnapEvent>) => this.removeVertex(event), this);
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

    mapService.map.un('dblclick', this.handleDoubleClick);
    communicationService.off(this);

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

  /**
   * Синхронизирует геометрию фичи на карте с обновленной геометрией из editFeatureStore
   */
  async syncFeatureGeometryWithMap(): Promise<void> {
    if (!editFeatureStore.firstFeature) {
      services.logger.warn('Не удалось синхронизировать геометрию. Нет фичи');

      return;
    }

    if (!editFeatureStore.geometry) {
      services.logger.warn('Не удалось синхронизировать геометрию. Нет геометрии');

      return;
    }

    if (!editFeatureStore.currentProjection) {
      services.logger.warn('Не удалось синхронизировать геометрию. Нет текущей проекции');

      return;
    }

    const featureId = editFeatureStore.firstFeature.id;
    const geometry = editFeatureStore.geometry;

    try {
      // Находим фичу на карте по ID
      const mapFeatures = this.source.getFeatures();
      const mapFeature = mapFeatures.find(f => f.getId() === featureId);
      if (mapFeature) {
        // Трансформируем геометрию в проекцию карты
        const olProjection = await getOlProjection();
        const transformedGeometry = transformGeometry(geometry, editFeatureStore.currentProjection, olProjection);
        if (transformedGeometry) {
          // Удаляем все фичи без ID (дублирующие фичи)
          const featuresToRemove = mapFeatures.filter(f => !f.getId());
          featuresToRemove.forEach(f => this.source.removeFeature(f));

          // Обновляем геометрию фичи на карте
          const updatedFeature = wfsFeaturesToOlFeatures([
            {
              id: featureId,
              geometry: transformedGeometry,
              properties: {},
              type: 'Feature',
              geometry_name: 'geometry'
            }
          ]);

          if (updatedFeature[0]) {
            mapFeature.setGeometry(updatedFeature[0].getGeometry());
          }
        }
      }

      // Обновляем фичу в selectedFeaturesStore
      const selectedFeature = selectedFeaturesStore.features.find(f => f.id === featureId);
      if (selectedFeature) {
        selectedFeaturesStore.updateFeature({
          ...selectedFeature,
          geometry
        });
      }
    } catch (error) {
      services.logger.error('Ошибка при синхронизации геометрии фичи на карте:', error);
    }
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

  private removeVertex(event: CustomEvent<SnapEvent>) {
    if (this.isDrawEndClick) {
      this.isDrawEndClick = false;

      return;
    }

    if (event.detail === null) {
      return;
    }

    const { vertex, feature } = event.detail;
    if (vertex === undefined || feature === undefined) {
      return;
    }

    const vertexRemover = getVertexRemover(feature);
    if (vertexRemover !== null) {
      vertexRemover.removeVertex(feature, vertex);

      void handleGeometry();
    }
  }

  @boundMethod
  private handleDoubleClick() {
    if (this.draw) {
      this.draw.abortDrawing();
    }
  }
}

export const mapDrawService = MapDrawService.instance;
