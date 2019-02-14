import {tap} from "rxjs/operators";
import {Observable, of} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ValueTitleProjection} from "../geoserver/projections";
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
                     this.featuresXsdDefinition.xsdFeatures = respone.entityTypes;
                   })
                 );
    }
  }

  public getLayerTitle(layerName: string): string {
    if (!this.featuresXsdDefinition.xsdFeatures || this.featuresXsdDefinition.xsdFeatures.length < 1) {
      return layerName;
    }

    let featureByName = this.getFeatureByName(layerName);
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
    let featureByTitle = this.getFeatureByTitle(layerTitle);
    if (featureByTitle) {
      return featureByTitle.tableName;
    } else {
      this.logger.warn('Not found layer name by their title: ', layerTitle);

      return layerTitle;
    }
  }

  private getFeatureByName(layerName: string): XsdFeature {
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
