import { action, computed, makeObservable, observable } from 'mobx';
import type { Feature, Polygon } from 'geojson';
import { cloneDeep } from 'lodash';

import { type Projection } from '../../../data/projections/projections.models';
import { GeometryType, type WfsFeature, type WfsGeometry } from '../../../geoserver/wfs/wfs.models';
import { isGeometryValid } from '../../../geoserver/wfs/wfs.util';
import { type CrgVectorableLayer } from '../../../gis/layers/layers.models';
import { services } from '../../../services';
import { transformGeometry } from '../../../util/coordinates-transform.util';
import { selectedFeaturesStore } from '../selected-features/SelectedFeatures.store';
import { type EditFeaturesData } from './EditFeature.models';
import { editFeatureHistoryStore } from './EditFeatureHistoryStore';

class EditFeatureStore {
  private static _instance: EditFeatureStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable geometryErrorMessage: string | null = null;

  @observable pristine: boolean = true;
  @observable pristineFromGeometryFix: boolean = true;
  @observable editFeaturesData?: EditFeaturesData;

  @observable currentProjection?: Projection;

  // Зона слоя допустимая для добавления объектов без предупреждения
  @observable layerExtent?: Feature<Polygon>;
  // Признак нарушения границ зоны layerExtent какой-либо из точек геометрии
  @observable hasGeometryWarning: boolean = false;

  constructor() {
    makeObservable(this);
  }

  @computed
  get dirty() {
    return !this.pristine;
  }

  @computed
  get geometry(): WfsGeometry | undefined {
    return this.firstFeature?.geometry;
  }

  @computed
  get isGeometryValid(): boolean {
    if (this.geometry) {
      return Boolean(isGeometryValid(this.geometry));
    }

    return false;
  }

  @computed
  get isGeometryChanged(): boolean {
    if (this.isGeometryValid) {
      this.setPristine(false);

      return true;
    }

    return false;
  }

  @computed
  get geometryType(): GeometryType | undefined {
    return this.firstFeature?.geometry?.type;
  }

  @computed
  get firstFeature(): WfsFeature | undefined {
    return this.editFeaturesData?.features[0];
  }

  @action
  setCurrentProjection(projection: Projection): void {
    this.currentProjection = projection;
  }

  @action
  setLayerExtent(extent: Feature<Polygon>): void {
    this.layerExtent = extent;
  }

  @action
  setGeometryWarning(value: boolean): void {
    this.hasGeometryWarning = value;
  }

  @action.bound
  setGeometry(geometry: WfsGeometry, addToHistory: boolean = true, description?: string): void {
    if (!this.currentProjection) {
      throw new Error('Отсутствует текущая проекция');
    }

    if (this.firstFeature) {
      // Добавляем в историю только если это не отмена/повтор действия
      if (addToHistory && this.geometry) {
        const desc = description || 'Изменение геометрии';
        editFeatureHistoryStore.add(geometry, desc);
      }

      let processedGeometry = geometry;
      if (geometry.type === GeometryType.MULTI_POINT) {
        // Удаляем повторяющиеся вершины для точек
        processedGeometry = this.removeDuplicateCoordinates(geometry);
      }

      this.firstFeature.geometry = processedGeometry;

      // Очищаем ошибку геометрии при любом изменении
      this.setGeometryErrorMessage(null);
    }
  }

  @action.bound
  setCurrentProjectionAndTransformGeometry(proj: Projection): void {
    if (!this.geometry || !this.currentProjection) {
      throw new Error('Отсутствует геометрия или текущая проекция');
    }

    if (this.firstFeature) {
      this.firstFeature.geometry = transformGeometry(this.geometry, this.currentProjection, proj);
      this.currentProjection = proj;
    }
  }

  @action
  setLayer(layer: CrgVectorableLayer): void {
    if (this.editFeaturesData) {
      this.editFeaturesData.layer = layer;
    }
  }

  @action
  setPristine(pristine: boolean) {
    this.pristine = pristine;
  }

  @action
  setGeometryErrorMessage(geometryErrorMessage: string | null) {
    this.geometryErrorMessage = geometryErrorMessage;
  }

  @action
  setPristineFromGeometryFix(pristineFromGeometryFix: boolean) {
    this.pristineFromGeometryFix = pristineFromGeometryFix;
  }

  @action
  setEditFeaturesData(editFeaturesData: EditFeaturesData | undefined) {
    if (editFeaturesData === undefined) {
      services.logger.warn('Лучше использовать clear() метод напрямую');

      this.clear();

      return;
    }

    this.editFeaturesData = editFeaturesData;
    if (this.geometry) {
      editFeatureHistoryStore.add(this.geometry, 'Начальное состояние');
    }

    // Обновляем фичу в списке выделенных
    this.editFeaturesData?.features.forEach(feature => {
      selectedFeaturesStore.updateFeature(feature);
    });

    this.setGeometryErrorMessage(null);
  }

  @action
  clear() {
    this.editFeaturesData = undefined;

    this.setPristine(false);
    this.setGeometryErrorMessage(null);
    this.setPristineFromGeometryFix(false);
  }

  /**
   * Удаляет повторяющиеся координаты из геометрии
   */
  private removeDuplicateCoordinates(geometry: WfsGeometry): WfsGeometry {
    const processedGeometry = cloneDeep(geometry);
    if (processedGeometry.type === GeometryType.MULTI_POINT) {
      const multiPointGeometry = processedGeometry;

      multiPointGeometry.coordinates = multiPointGeometry.coordinates.filter((coord, index, arr) => {
        return arr.findIndex(c => c[0] === coord[0] && c[1] === coord[1]) === index;
      });
    }

    return processedGeometry;
  }

  /**
   * Красиво распечатывает текущее состояние EditFeatureStore в консоль
   */
  printState(): void {
    services.logger.trace('🎯 Состояние EditFeatureStore:');
    services.logger.trace('═'.repeat(50));

    services.logger.trace('📊 Общее состояние:');
    services.logger.trace(`  • Pristine: ${this.pristine ? '✅' : '❌'}`);
    services.logger.trace(`  • Dirty: ${this.dirty ? '✅' : '❌'}`);
    services.logger.trace(`  • PristineFromGeometryFix: ${this.pristineFromGeometryFix ? '✅' : '❌'}`);
    services.logger.trace(`  • HasGeometryWarning: ${this.hasGeometryWarning ? '⚠️' : '✅'}`);

    if (this.geometryErrorMessage) {
      services.logger.trace(`  • GeometryErrorMessage: ${this.geometryErrorMessage}`);
    }

    services.logger.trace(`  • CurrentProjection: ${this.currentProjection?.title || 'Не установлена'}`);
    services.logger.trace(`  • LayerExtent: ${this.layerExtent ? 'Установлена' : 'Не установлена'}`);

    if (this.editFeaturesData) {
      services.logger.trace('📝 Данные редактирования:');
      services.logger.trace(`  • Layer: ${this.editFeaturesData.layer?.title || 'Не установлен'}`);
      services.logger.trace(`  • Features count: ${this.editFeaturesData.features.length}`);

      if (this.firstFeature) {
        services.logger.trace(`  • First feature ID: ${this.firstFeature.id}`);
        services.logger.trace(`  • Geometry type: ${this.geometryType || 'Не установлен'}`);
        services.logger.trace(`  • Is geometry valid: ${this.isGeometryValid ? '✅' : '❌'}`);
        services.logger.trace(`  • Is geometry changed: ${this.isGeometryChanged ? '✅' : '❌'}`);

        if (this.geometry) {
          services.logger.trace(`  • Geometry coordinates: ${JSON.stringify(this.geometry.coordinates)}`);
        }
      }
    } else {
      services.logger.trace('📝 Данные редактирования: Не установлены');
    }

    services.logger.trace('═'.repeat(50));
  }
}

export const editFeatureStore = EditFeatureStore.instance;
