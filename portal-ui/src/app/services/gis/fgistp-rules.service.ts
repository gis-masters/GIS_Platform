import {map, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ValueTitleProjection} from '../geoserver/projections';
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class FgistpRulesService {

  featuresXsdDefinition: FeatureXsdDefinition = new FeatureXsdDefinition();

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private serverProp: ServerPropertiesService) {
  }

  getRules(): Observable<FeatureXsdDefinition> {
    if (this.featuresXsdDefinition.xsdFeatures && this.featuresXsdDefinition.xsdFeatures.length) {
      return of(this.featuresXsdDefinition);
    } else {
      return this.http
                 .get<FeatureXsdDefinition>(this.serverProp.rulesUrl)
                 .pipe(
                   map((respone: any) => {
                     if (respone) {
                       this.featuresXsdDefinition.xsdFeatures = respone.entityTypes;

                     } else {
                       this.logger.warn('getRules response is: ', respone);
                       this.featuresXsdDefinition = {xsdFeatures: []};
                     }

                     return this.featuresXsdDefinition;
                   })
                 );
    }
  }

  public getLayerTitle(layerName: string): string {
    if (!this.featuresXsdDefinition.xsdFeatures || this.featuresXsdDefinition.xsdFeatures.length < 1) {
      return layerName;
    }

    const featureByName = this.getFeatureByName(layerName);
    if (featureByName) {
      return featureByName.title;
    } else {
      return layerName;
    }
  }

  public getFeatureByName(layerName: string): XsdFeature {
    if (!layerName) {
      return;
    }

    return this.featuresXsdDefinition.xsdFeatures
      .find((feature: XsdFeature) => {
        return feature.name.toLowerCase().includes(layerName.toLowerCase());
      });
  }

  getClassIdAlias(layerName: string, element: any) {
    let result = layerName;
    const featureByName = this.getFeatureByName(layerName);
    if (featureByName) {
      featureByName.properties
        .forEach((simpleProperty: SimpleProperty) => {
          if (simpleProperty.enumerations) {
            simpleProperty.enumerations.forEach((item: ValueTitleProjection) => {
              if (item.value.toLowerCase() === element.classId.toString().toLowerCase()) {
                result = item.title;
              }
            });
          }
        });
    }

    return result;
  }

  getPropertyAlias(layerName: string, propertyName: string) {
    let result;
    const featureByName = this.getFeatureByName(layerName);
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
  xsdFeatures: XsdFeature[] = [];
}

export interface XsdFeature {
  name: string;
  title: string;
  description: string;
  properties: SimpleProperty[];
  tableName: string;
  customRuleFunction?: any;
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

  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternDescription?: string;
  minInclusive?: number;
  maxInclusive?: number;
  totalDigits?: number;
  allowedValues?: string[];
  enumerations?: ValueTitleProjection[];
}
