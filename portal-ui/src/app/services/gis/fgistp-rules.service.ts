import {tap} from 'rxjs/operators';
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
    logger.info('LayersService start');
  }

  getRules(): Observable<FeatureXsdDefinition> {
    if (this.featuresXsdDefinition.xsdFeatures && this.featuresXsdDefinition.xsdFeatures.length) {
      return of(this.featuresXsdDefinition);
    } else {
      return this.http
                 .get<FeatureXsdDefinition>(this.serverProp.rulesUrl)
                 .pipe(
                   tap((respone: any) => {
                     if (respone) {
                       this.featuresXsdDefinition.xsdFeatures = respone.entityTypes;
                     } else {
                       this.logger.warn('getRules response is: ', respone);
                     }
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

  public getLayerDescription(layerName: string): string {
    if (!this.featuresXsdDefinition.xsdFeatures) {
      return layerName;
    }

    return this.getFeatureByName(layerName).title;
  }

  public getNativeLayerNameByTitle(layerTitle: string) {
    const featureByTitle = this.getFeatureByTitle(layerTitle);
    if (featureByTitle) {
      return featureByTitle.tableName;
    } else {
      this.logger.warn('Not found layer name by their title: ', layerTitle);

      return layerTitle;
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

  private getFeatureByTitle(featureTitle: string): XsdFeature {
    return this.featuresXsdDefinition.xsdFeatures
      .find((feature: XsdFeature) => {
        return feature.title.toLowerCase().includes(featureTitle.toLowerCase());
      });
  }

  getClassIdAlias(layerName: string, element: any) {
    let result;
    this.getFeatureByName(layerName).properties
        .forEach((simpleProperty: SimpleProperty) => {
          if (simpleProperty.enumerations) {
            simpleProperty.enumerations.forEach((item: ValueTitleProjection) => {
              if (item.value.toLowerCase() === element.classId.toString().toLowerCase()) {
                result = item.title;
              }
            });
          }
        });

    return result;
  }

  getPropertyAlias(layerName: string, propertyName: string) {
    let result;
    this.getFeatureByName(layerName).properties
      .forEach((simpleProperty: SimpleProperty) => {
        if (simpleProperty.name.toLowerCase() === propertyName.toLowerCase()) {
          result = simpleProperty.title;
        }
      });

    if (!result) {
      return propertyName;
    } else {
      return result;
    }
  }

  /**
   * По присланному с сервера типу ошибки сформируем его описание, выводимое пользователю.
   * @param errorTypes Тип ошибки
   */
  getErrorsDescription(errorTypes: string[]) {
    // TODO: Решили передавать с сервера только тип ошибки а описание формировать на клиенте.
    // Но если нужно описать ошибку более точно с указанием допустимых границ, например, то получается нужно снова лезть
    // в правила и высматривать там эти значения (Если бы в момент валидации отдавать не тип ошибки а формировать
    // сообщение то это бы делалось в одном месте, один раз. И пока не понятно как будет с кастомными правилами)

    const result = [];

    errorTypes.forEach(error => {
      if (error === 'enumeration') {
        result.push('Значение не соответствует справочному');
      } else if (error === 'notDoubleType') {
        result.push('Значение не является дробным числом');
      } else if (error === 'notLongType') {
        result.push('Значение не является целым числом');
      } else if (error === 'maxInclusive') {
        result.push('Значение превышает допустимый максимум');
      } else if (error === 'maxLength') {
        result.push('Строка превышает допустимую длинну');
      } else if (error === 'minInclusive') {
        result.push('Значение менее допустимого значения');
      } else if (error === 'minLength') {
        result.push('Строка слишком короткая');
      } else if (error === 'pattern') {
        result.push('Строка не соответствует паттерну');
      } else if (error === 'required') {
        result.push('Параметр обязателен к заполнению');
      } else if (error === 'totalDigits') {
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
