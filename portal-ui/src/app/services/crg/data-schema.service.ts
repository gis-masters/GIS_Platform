import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ValueTitleProjection} from '../geoserver/projections';
import {ServerPropertiesService} from '../server-properties.service';
import {CrgLayer} from '../geoserver/layers.service';
import {FeatureDescriptionUtil} from '../util/FeatureDescriptionUtil';

@Injectable({
  providedIn: 'root'
})
export class DataSchemaService {

  private featuresXsdDefinition: FeatureXsdDefinition = new FeatureXsdDefinition();

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private serverProp: ServerPropertiesService) {
  }

  getFeaturesDefinition(): Observable<FeatureXsdDefinition> {
    if (this.featuresXsdDefinition.xsdFeatures && this.featuresXsdDefinition.xsdFeatures.length) {
      this.logger.info('this.featureDescriptions: ', this.featuresXsdDefinition);
      return of(this.featuresXsdDefinition);
    } else {
      // Пустой список подразумевает выборку всего
      const payload = [];

      return this.http
                 .post<FeatureXsdDefinition>(this.serverProp.schemaUrl, payload)
                 .pipe(
                   map((respone: any) => {
                     if (respone) {
                       this.featuresXsdDefinition.xsdFeatures = respone;

                     } else {
                       this.logger.warn('getFeaturesDefinition response is: ', respone);
                       this.featuresXsdDefinition = {xsdFeatures: []};
                     }

                     return this.featuresXsdDefinition;
                   })
                 );
    }
  }

  /**
   * Возвращает описание фичи.
   * @param layerName Название слоя
   */
  public getFeatureDescriptionByName(layerName: string): FeatureDescription {
    if (!layerName) {
      return;
    }

    let byFullCompare: FeatureDescription;
    this.featuresXsdDefinition.xsdFeatures.forEach((feature: FeatureDescription) => {
      if (feature.name.toLowerCase() === layerName.toLowerCase()) {
        byFullCompare = feature;
      }
    });

    if (byFullCompare) {
      return byFullCompare;
    } else {
      this.logger.warn('Прямого совпадения имени не нашлось. Подберем слой через include');

      const xsdFeature = this.featuresXsdDefinition.xsdFeatures
        .find((feature: FeatureDescription) => {
          return feature.name.toLowerCase().includes(layerName.toLowerCase());
        });

      this.logger.info(layerName + ': ' + xsdFeature.name);
      return xsdFeature;
    }
  }

  /**
   * Для базового слоя из переданного списка слоев возвращает подходящие по геометрии. (Кроме самого себя)
   * @param baseLayer Базовый слой.
   * @param layers    Исходный список слоев.
   *
   * @return The new array of {@link CrgLayer}.
   */
  public getSuitableByGeometryLayers(baseLayer: CrgLayer, layers: CrgLayer[]): CrgLayer[] {
    const baseFeatureDescription = this.getFeatureDescriptionByName(baseLayer.name);
    const baseFeatureGeometry: string[] = FeatureDescriptionUtil.getFeatureGeometry(baseFeatureDescription);

    const result: CrgLayer[] = [];
    baseFeatureGeometry.forEach(fGeometry => {
      layers.forEach((layer: CrgLayer) => {
        if (baseLayer.complexName !== layer.complexName) {
          const fDescription = this.getFeatureDescriptionByName(layer.name);
          if (FeatureDescriptionUtil.isFeatureGeometryCompatible(fGeometry, fDescription)) {
            result.push(layer);
          }
        }
      });
    });

    return result;
  }

  public getLayerTitle(layerName: string): string {
    if (!this.featuresXsdDefinition.xsdFeatures || this.featuresXsdDefinition.xsdFeatures.length < 1) {
      this.logger.warn('xsd feature definition not ready yet');

      return layerName;
    }

    const fDescription = this.getFeatureDescriptionByName(layerName);
    if (fDescription) {
      return fDescription.title;
    } else {
      return layerName;
    }
  }

  getClassIdAlias(layerName: string, element: any) {
    let result = layerName;
    const featureByName = this.getFeatureDescriptionByName(layerName);
    if (featureByName) {
      featureByName.properties
        .forEach((simpleProperty: SimpleProperty) => {
          if (simpleProperty.enumerations) {
            simpleProperty.enumerations.forEach((item: ValueTitleProjection) => {
              if (element.classId && item.value.toLowerCase() === element.classId.toString().toLowerCase()) {
                result = item.title;
              } else if (element.classid && item.value.toLowerCase() === element.classid.toString().toLowerCase()) {
                result = item.title;
              }
            });
          }
        });
    }

    return result;
  }

  /**
   * По наименованию фичи, попытаемся найти алиас в ее свойствах.
   * Если алиас найти не удалось просто вернем код.
   * @param layerName Наименование фичи
   * @param propertyName код свойства
   */
  getPropertyAlias(layerName: string, propertyName: string) {
    let result;
    const featureByName = this.getFeatureDescriptionByName(layerName);
    if (featureByName) {
      featureByName.properties
        .forEach((simpleProperty: SimpleProperty) => {
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
   * @param properties Свойства полученные из XSD схемы.
   */
  getPropertiesByName(key: string, properties: SimpleProperty[]) {
    return properties.find((simpleProperty: SimpleProperty) => {
      return simpleProperty.name === key.toUpperCase();
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

export class FeatureXsdDefinition {
  xsdFeatures: FeatureDescription[] = [];
}

export interface FeatureDescription {
  name: string;
  title: string;
  description: string;
  properties: SimpleProperty[];
  tableName: string;
  customRuleFunction?: any;
  matchingCounter?: number;
}

export interface SimpleProperty {
  name: string;
  title: string;
  description?: string;

  required?: boolean;
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
  property: SimpleProperty;
  isFgistpProperty: boolean;
}
