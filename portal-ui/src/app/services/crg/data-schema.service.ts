import { Injectable } from '@angular/core';
import { Observable, of, defer } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

import { HttpQueue } from '../util/HttpQueue';
import { ValueTitleProjection } from '../geoserver/projections';
import { serverProperties } from '../server-properties.service';
import { FeatureUtil } from '../util/FeatureUtil';
import { getEmptyGeometry } from '../geoserver/wfs.service';
import { WfsFeature, CoordinateEdited } from '../geoserver/wfs-models';
import { normalizeGeometryType } from '../util/stringUtil';
import { ImportLayerItem } from '../geoserver/import/models';
import { BugObject } from './validation.service';
import {CrgLayer, Project} from '../../stores/ProjectsList.store';


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
  readOnly: boolean;
}

export interface PropertySchema {
  name: string;
  title: string;
  description?: string;

  required?: boolean;
  mustBeEmpty?: boolean;
  hidden?: boolean;
  isMultiple?: boolean;

  objectIdentityOnUi?: boolean;

  updateability?: Updateability;
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
  url?: string;
  displayMode?: string;
}

export enum Updateability {
  CREATE_ONLY = 'CREATE_ONLY',
  CREATE_WRITE = 'CREATE_WRITE',
  READ_ONLY = 'READ_ONLY'
}

export enum FieldType {
  URL = 'url'
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
              private logger: NGXLogger) {
  }

  fetchAllSchemas(): Observable<FeatureXsdDefinition> {
    return this.fetching([]);
  }

  fetchSchemas(currentProject: Project): Observable<FeatureXsdDefinition> {
    const payload: string[] = currentProject.layers.map(layer => {
      return layer.internalName;
    });

    return this.fetching(payload);
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
    this.featuresXsdDefinition.schemas.forEach((featureDescription: FeatureDescription) => {
      if (featureDescription.name && featureDescription.name.toLowerCase() === layerName.toLowerCase()) {
        byFullCompare = featureDescription;
      }
    });

    if (byFullCompare) {
      return byFullCompare;
    } else {
      const fDescription = this.featuresXsdDefinition.schemas
        .find((featureDescription: FeatureDescription) => {
          return featureDescription.name && featureDescription.name.toLowerCase().includes(layerName.toLowerCase());
        });

      return fDescription ? fDescription : undefined;
    }
  }

  /**
   * Возвращает, наиболее подходящую для слоя, схему.
   * Метод опирается на название и геометрию слоя.
   * @param layer Слой
   */
  getFeatureDescriptionByLayer(layer: ImportLayerItem): FeatureDescription | undefined {
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
    return layers
      .filter((layer: CrgLayer) => baseLayer.complexName !== layer.complexName)
      .filter((layer: CrgLayer) => baseLayer.geometry === layer.geometry);
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

  getEmptyFeature (layer: CrgLayer): WfsFeature<CoordinateEdited> {
    const { geometry, internalName, schema } = layer;
    const properties = schema.properties.reduce((acc: {[key: string]: null}, propertySchema) => {
      acc[propertySchema.name.toLowerCase()] = null;
      return acc;
    }, {});

    return {
      type: 'Feature',
      id: internalName, // костыль для EditFeatureComponent, который берёт тип фичи из id (AAAAAAA!!!)
      geometry: getEmptyGeometry(normalizeGeometryType(geometry)),
      geometry_name: 'shape', // TODO нужно добавить в схему и брать оттуда
      properties: properties
    };
  }

  /**
   * По присланному с сервера типу ошибки сформируем его короткое и неточное описание, выводимое пользователю,
   * в выпадающем списке в таблице с ошибками.
   * @param errorTypes Тип ошибки
   */
  getErrorsDescription(errorTypes: string[]): string[] {
    return errorTypes.map(error => {
      if (error === 'enumeration') {
        return 'Значение не соответствует справочному';
      } else if (error.toLowerCase().includes('notDoubleType'.toLowerCase())) {
        return 'Значение не является дробным числом';
      } else if (error.toLowerCase().includes('notLongType'.toLowerCase())) {
        return 'Значение не является целым числом';
      } else if (error.toLowerCase().includes('maxInclusive'.toLowerCase())) {
        return 'Значение превышает допустимый максимум';
      } else if (error.toLowerCase().includes('maxLength'.toLowerCase())) {
        return 'Строка превышает допустимую длинну';
      } else if (error.toLowerCase().includes('minInclusive'.toLowerCase())) {
        return 'Значение менее допустимого';
      } else if (error.toLowerCase().includes('minLength'.toLowerCase())) {
        return 'Строка слишком короткая';
      } else if (error.toLowerCase().includes('pattern'.toLowerCase())) {
        return 'Строка не соответствует паттерну';
      } else if (error.toLowerCase().includes('required'.toLowerCase())) {
        return 'Параметр обязателен к заполнению';
      } else if (error.toLowerCase().includes('totalDigits'.toLowerCase())) {
        return 'Превышено допустимое кол-в знаков';
      } else {
        return error;
      }
    });
  }

  private fetching(payload: string[]) {
    return defer(async () => {
      const url = await serverProperties.schemaUrl;
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
