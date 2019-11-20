import { Injectable } from '@angular/core';
import { Observable, of, defer } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

import { HttpQueue } from '../util/HttpQueue';
import { ValueTitleProjection } from '../geoserver/projections';
import { ServerPropertiesService } from '../server-properties.service';
import { CrgLayer } from '../geoserver/layers.service';
import { FeatureUtil } from '../util/FeatureUtil';
import {ImportLayerItem} from '../geoserver/import/models';
import {BugObject} from './validation.service';


export class FeatureXsdDefinition {
  schemas: FeatureDescription[] = [];
}

export interface FeatureDescription {
  name: string;
  title: string;
  description: string;
  properties: PropertySchema[];
  tableName: string;
  customRuleFunction?: any;
  matchingCounter?: number;
  calcFiledFunction?: string;
}

export interface PropertySchema {
  name: string;
  title: string;
  description?: string;

  required?: boolean;
  mustBeEmpty?: boolean;
  hidden?: boolean;
  isMultiple?: boolean;

  updateability?: any;
  choice?: any;
  valueType?: any;

  length?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternDescription?: string;
  minInclusive?: number;
  maxInclusive?: number;
  totalDigits?: number;
  fractionDigits?: number;
  allowedValues?: string[];
  enumerations?: ValueTitleProjection[];
}

export interface EditFeatureItem {
  name: string;
  value: string;
  property: PropertySchema;
  isFgistpProperty: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataSchemaService {

  private featuresXsdDefinition: FeatureXsdDefinition = new FeatureXsdDefinition();

  constructor(private httpq: HttpQueue,
              private logger: NGXLogger,
              private serverProp: ServerPropertiesService) {
  }

  getFeaturesSchemas(): Observable<FeatureXsdDefinition> {
    if (this.featuresXsdDefinition.schemas && this.featuresXsdDefinition.schemas.length) {
      this.logger.info('this.featureDescriptions: ', this.featuresXsdDefinition);
      return of(this.featuresXsdDefinition);
    } else {
      // Пустой список подразумевает выборку всего
      const payload: [] = [];

      return defer(async () => {
        const url = await this.serverProp.schemaUrl;
        const response = await this.httpq.post<FeatureDescription[]>(url, payload);

        if (response) {
          this.featuresXsdDefinition.schemas = response;
        } else {
          this.logger.warn('getFeaturesDefinition response is: ', response);
          this.featuresXsdDefinition = {schemas: []};
        }

        return this.featuresXsdDefinition;
      });
    }
  }

  /**
   * Возвращает описание фичи.
   * @param layerName Название слоя
   */
  public getFeatureSchemaByName(layerName: string): FeatureDescription | undefined {
    if (!layerName) {
      return;
    }

    let byFullCompare: FeatureDescription;
    this.featuresXsdDefinition.schemas.forEach((feature: FeatureDescription) => {
      if (feature.name.toLowerCase() === layerName.toLowerCase()) {
        byFullCompare = feature;
      }
    });

    if (byFullCompare) {
      return byFullCompare;
    } else {
      const fDescription = this.featuresXsdDefinition.schemas
        .find((feature: FeatureDescription) => {
          return feature.name.toLowerCase().includes(layerName.toLowerCase());
        });

      return fDescription ? fDescription : undefined;
    }
  }

  /**
   * Возвращает, наиболее подходящую для слоя, схему.
   * Метод опирается на название и геометрию слоя.
   * @param layer Слой
   */
  public getFeatureDescriptionByLayer(layer: ImportLayerItem): FeatureDescription | undefined {
    if (!layer) {
      return;
    }

    let layerName = layer.originalName.toLowerCase();

    const geometryName = FeatureUtil.getLayerGeometry(layer);
    if (geometryName.includes('MultiLineString')) {
      if (!layerName.includes('_line')) {
        layerName += '_line';
      }
    } else if (geometryName.includes('Point')) {
      if (!layerName.includes('_point')) {
        layerName += '_point';
      }
    }

    return this.getFeatureSchemaByName(layerName);
  }

  /**
   * Для базового слоя из переданного списка слоев возвращает подходящие по геометрии. (Кроме самого себя)
   * @param baseLayer Базовый слой.
   * @param layers    Исходный список слоев.
   *
   * @return The new array of {@link CrgLayer}.
   */
  public getSuitableByGeometryLayers(baseLayer: CrgLayer, layers: CrgLayer[]): CrgLayer[] {
    const baseFeatureGeometry: string[] = FeatureUtil.getFeatureGeometry(baseLayer.schema);

    const result: CrgLayer[] = [];
    baseFeatureGeometry.forEach(fGeometry => {
      layers.forEach((layer: CrgLayer) => {
        if (baseLayer.complexName !== layer.complexName) {
          if (FeatureUtil.isFeatureGeometryCompatible(fGeometry, baseLayer.schema)) {
            result.push(layer);
          }
        }
      });
    });

    return result;
  }

  getClassIdAlias(layerName: string, bugObject: BugObject) {
    const featureSchema = this.getFeatureSchemaByName(layerName);
    if (!featureSchema) {
      return '';
    }

    return featureSchema.properties
      .filter((simpleProperty: PropertySchema) => simpleProperty.enumerations)
      .reduce((val: string, simpleProperty: PropertySchema) => {
        return simpleProperty.enumerations.reduce((title: string, item: ValueTitleProjection) => {
          if (String(bugObject.classId) === item.value || String(bugObject.classId) === item.value) {
            return item.title;
          } else {
            return title;
          }
        }, val);
      }, '');
  }

  /**
   * По наименованию фичи, попытаемся найти алиас в ее свойствах.
   * Если алиас найти не удалось просто вернем код.
   * @param layerName Наименование фичи
   * @param propertyName код свойства
   */
  getPropertyAlias(layerName: string, propertyName: string) {
    let result;
    const featureSchema = this.getFeatureSchemaByName(layerName);
    if (featureSchema) {
      featureSchema.properties
        .forEach((simpleProperty: PropertySchema) => {
          if (simpleProperty.name.toLowerCase() === propertyName.toLowerCase()) {
            result = simpleProperty.title;
          }
        });
    }

    if (!result) {
      return propertyName;
    } else {
      return result;
    }
  }

  /**
   * Ищем свойство, среди тех что есть в XSD схеме.
   *
   * @param key Наименование свойства, полученное из "фичи" геосервера
   * @param propertySchemas Свойства полученные из XSD схемы.
   */
  getPropertySchemaByName(key: string, propertySchemas: PropertySchema[]) {
    return propertySchemas.find((propertySchema: PropertySchema) => {
      return propertySchema.name.toLowerCase() === key.toLowerCase();
    });
  }

  /**
   * По присланному с сервера типу ошибки сформируем его короткое и неточное описание, выводимое пользователю,
   * в выпадающем списке в таблице с ошибками.
   * @param errorTypes Тип ошибки
   */
  getErrorsDescription(errorTypes: string[]) {
    const result = [];

    errorTypes.forEach(error => {
      if (error === 'enumeration') {
        result.push('Значение не соответствует справочному');
      } else if (error.toLowerCase().includes('notDoubleType'.toLowerCase())) {
        result.push('Значение не является дробным числом');
      } else if (error.toLowerCase().includes('notLongType'.toLowerCase())) {
        result.push('Значение не является целым числом');
      } else if (error.toLowerCase().includes('maxInclusive'.toLowerCase())) {
        result.push('Значение превышает допустимый максимум');
      } else if (error.toLowerCase().includes('maxLength'.toLowerCase())) {
        result.push('Строка превышает допустимую длинну');
      } else if (error.toLowerCase().includes('minInclusive'.toLowerCase())) {
        result.push('Значение менее допустимого');
      } else if (error.toLowerCase().includes('minLength'.toLowerCase())) {
        result.push('Строка слишком короткая');
      } else if (error.toLowerCase().includes('pattern'.toLowerCase())) {
        result.push('Строка не соответствует паттерну');
      } else if (error.toLowerCase().includes('required'.toLowerCase())) {
        result.push('Параметр обязателен к заполнению');
      } else if (error.toLowerCase().includes('totalDigits'.toLowerCase())) {
        result.push('Превышено допустимое кол-в знаков');
      } else {
        result.push(error);
      }
    });

    return result;
  }

}
