import { EventEmitter, Injectable } from '@angular/core';

import { schemaService } from '../../data/schema/schema.service';
import { OldPropertySchema, OldSchema, ValueType } from '../../data/schema/schemaOld.models';
import { AS_IS, IMPORT_LAYER_AS_IS, ImportTargetType, NOT_IMPORT, NOT_IMPORT_LAYER } from '../../models';
import { PropertiesComparatorService } from '../../properties-comparator.service';
import { FeatureUtil } from '../../util/FeatureUtil';
import { ImportLayerItem, LayerAttribute } from './import.models';
import { MatchingPair, TaskImport } from './taskImport';

export interface InputDataMetrics {
  all: number;
  mapped: number;
  notMapped: number;
  disabled: number;
}

export interface ComparableLayersPair {
  originalLayer: ImportLayerItem;

  targetLayer: TaskImport;

  isActive: boolean;
  isMapped: boolean;
  isDisabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ImportDataHolderService {
  // eslint-disable-next-line unicorn/prefer-event-target
  metrics$ = new EventEmitter<InputDataMetrics>();
  // eslint-disable-next-line unicorn/prefer-event-target
  comparableLayers$ = new EventEmitter<ComparableLayersPair[]>();

  private _comparableLayers: ComparableLayersPair[] = [];

  constructor(private propertyComparator: PropertiesComparatorService) {
    this.comparableLayers$.subscribe((comparableLayersPairs: ComparableLayersPair[]) => {
      this.updateMetrics(comparableLayersPairs);
    });
  }

  getWorkTasks(): TaskImport[] {
    return this._comparableLayers
      .filter((layerPair: ComparableLayersPair) => !layerPair.isDisabled)
      .map((layerPair: ComparableLayersPair) => {
        return layerPair.targetLayer;
      });
  }

  /**
   * Импортированному слою подбирается схема данных.
   * @param importLayer Импортированный слой
   */
  async createCompatiblePair(importLayer: ImportLayerItem): Promise<void> {
    const layerNativeName = importLayer.nativeName;
    const srs = importLayer.srs;

    const featureDescription = await schemaService.getSchemaByLayer(importLayer);

    const taskImport = new TaskImport(layerNativeName, srs);
    // Layer mapping
    if (featureDescription && featureDescription.tableName) {
      taskImport.workTableName = featureDescription.tableName;
      taskImport.schemaName = featureDescription.name;
    }

    this._comparableLayers.push({
      originalLayer: importLayer,
      targetLayer: taskImport,
      isActive: false,
      isDisabled: false,
      isMapped: false
    });

    // Attributes mapping
    if (featureDescription) {
      const propertySchemas = FeatureUtil.preparePropertySchema(featureDescription);

      importLayer.attributes.forEach((attr: LayerAttribute) => {
        const bestProperty = this.propertyComparator.compare(attr, propertySchemas);
        this.addAttributeMapping(layerNativeName, attr, bestProperty);
      });
    }

    this.comparableLayers$.emit(this._comparableLayers);
  }

  /**
   * Сопоставление атрибутов.
   * @param layerNativeName Название импортированного слоя.
   * @param source          Атрибут импортированного слоя.
   * @param propertySchema  Сопоставленная схема атрибута
   */
  updateAttributeMapping(layerNativeName: string, source: LayerAttribute, propertySchema: OldPropertySchema): void {
    const comparableLayersPair = this.findCompatiblePair(layerNativeName);
    const attributePair = this.findAttributePair(comparableLayersPair, source);
    if (attributePair) {
      comparableLayersPair.targetLayer.pairs.forEach((mapItem: MatchingPair, index, array) => {
        if (mapItem.source.name === source.name) {
          if (propertySchema.name === NOT_IMPORT.name) {
            array.splice(index, 1);
          } else if (propertySchema.name === AS_IS.name) {
            mapItem.target = {
              name: source.name,
              type: AS_IS.name
            };
          } else {
            mapItem.target = {
              name: propertySchema.name,
              type: ImportTargetType.FROM_SCHEMA
            };
          }
        }
      });
    } else {
      this.addAttributeMapping(layerNativeName, source, propertySchema);
    }

    this.updateMetrics(this._comparableLayers);
  }

  deleteMapping(layerNativeName: string): void {
    const layerPair = this.findCompatiblePair(layerNativeName);
    layerPair.isDisabled = true;
    layerPair.targetLayer.workTableName = NOT_IMPORT_LAYER.name;
    layerPair.targetLayer.pairs = [];
    layerPair.targetLayer.schemaName = NOT_IMPORT_LAYER.name;

    this.comparableLayers$.emit(this._comparableLayers);
  }

  /**
   * Импортированному слою сопоставляется, выбранная пользователем, схема данных.
   * @param layerNativeName   Название импортированного слоя.
   * @param featureSchemaName Название схемы данных
   */
  setFeatureSchema(layerNativeName: string, schema: OldSchema): void {
    const layerPair = this.findCompatiblePair(layerNativeName);
    layerPair.targetLayer.workTableName = layerNativeName;
    layerPair.targetLayer.pairs = [];
    layerPair.targetLayer.schemaName = schema.name;
    layerPair.isDisabled = false;

    // Attributes mapping
    if (IMPORT_LAYER_AS_IS.name === schema.name) {
      layerPair.originalLayer.attributes.forEach((attr: LayerAttribute) => {
        this.addAttributeMapping(layerNativeName, attr, {
          name: AS_IS.name,
          title: AS_IS.title,
          valueType: ValueType.STRING
        });
      });
    } else {
      const propertySchemas = FeatureUtil.preparePropertySchema(schema);

      layerPair.targetLayer.pairs = [];
      layerPair.originalLayer.attributes.forEach((attr: LayerAttribute) => {
        const bestProperty = this.propertyComparator.compare(attr, propertySchemas);
        this.addAttributeMapping(layerNativeName, attr, bestProperty);
      });
    }

    this.comparableLayers$.emit(this._comparableLayers);
  }

  findCompatiblePair(nativeName: string): ComparableLayersPair {
    const layer = this._comparableLayers.find(
      (layersPair: ComparableLayersPair) => layersPair.originalLayer.nativeName === nativeName
    );

    if (!layer) {
      throw new Error(`Не найден слой с nativeName "${nativeName}"`);
    }

    return layer;
  }

  clear(): void {
    this._comparableLayers = [];
    this.comparableLayers$.emit(this._comparableLayers);
    this.updateMetrics(this._comparableLayers);
  }

  private addAttributeMapping(layerNativeName: string, source: LayerAttribute, targetProperty: OldPropertySchema) {
    if (targetProperty.name === NOT_IMPORT.name) {
      return;
    }

    let newMapping = {
      source: source,
      target: {
        name: targetProperty.name,
        type: ImportTargetType.FROM_SCHEMA
      }
    };

    if (targetProperty.name === AS_IS.name) {
      newMapping = {
        source: source,
        target: {
          name: source.name,
          type: targetProperty.name
        }
      };
    }

    const layersPair = this.findCompatiblePair(layerNativeName);
    layersPair.targetLayer.pairs.push(newMapping);
    layersPair.isMapped = layersPair.targetLayer.isPrepared();

    this.updateMetrics(this._comparableLayers);
  }

  private findAttributePair(
    comparableLayersPair: ComparableLayersPair,
    source: LayerAttribute
  ): MatchingPair | undefined {
    return comparableLayersPair.targetLayer.pairs.find(
      (pair: MatchingPair) => pair.source.name === source.name && pair.source.binding === source.binding
    );
  }

  private updateMetrics(comparableLayersPairs: ComparableLayersPair[]) {
    const metrics = {
      all: comparableLayersPairs.length,
      mapped: 0,
      notMapped: 0,
      disabled: 0
    };

    comparableLayersPairs.forEach((layersPair: ComparableLayersPair) => {
      if (layersPair.isDisabled) {
        metrics.disabled++;
      } else if (layersPair.isMapped) {
        metrics.mapped++;
      } else {
        metrics.notMapped++;
      }
    });

    this.metrics$.emit(metrics);
  }

  get isWorkImportReady(): boolean {
    return this._comparableLayers.filter(value => !value.isMapped && !value.isDisabled).length <= 0;
  }
}
