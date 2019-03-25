import * as _ from 'lodash';
import {NGXLogger} from 'ngx-logger';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {
  FeatureXsdDefinition,
  FgistpRulesService,
  SimpleProperty,
  XsdFeature
} from '../../services/gis/fgistp-rules.service';
import {AS_IS_TYPE, ImportService, LayerItem, NOT_IMPORT} from '../../services/geoserver/import/import.service';

@Component({
  selector: 'crg-mapping-card',
  templateUrl: './mapping-card.component.html',
  styleUrls: ['./mapping-card.component.css']
})
export class MappingCardComponent implements OnInit, OnChanges {

  @Input() layer: LayerItem;

  entityTypes: XsdFeature[] = [];
  typeProperties: SimpleProperty[] = [];

  constructor(private logger: NGXLogger,
              private ruleService: FgistpRulesService,
              private importService: ImportService) {
  }

  ngOnInit() {
    this.typeProperties.push({name: NOT_IMPORT.name, title: NOT_IMPORT.title});
    this.typeProperties.push({name: AS_IS_TYPE.name, title: AS_IS_TYPE.title});

    this.ruleService.getRules()
        .subscribe((entityTypesDefinition: FeatureXsdDefinition) => {
          this.logger.info('MappingCardComponent this.entityTypes: ', entityTypesDefinition.xsdFeatures);

          this.entityTypes = this.handleFeatures(entityTypesDefinition.xsdFeatures);
          this.logger.info('MappingCardComponent this.entityTypes: ', this.entityTypes);
          // this.entityTypes = entityTypesDefinition.xsdFeatures;
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const simpleChange = changes['layer'];
    if (simpleChange && !simpleChange.isFirstChange()) {
      if (simpleChange.currentValue) {
        this.layer = simpleChange.currentValue;
      }
    }
  }

  entityTypeSelected(selected: string) {
    const xsdFeature = this.entityTypes.find((type: XsdFeature) => type.tableName === selected);

    this.importService.importFlow.setTable(this.layer.originalName, xsdFeature.tableName);
    this.typeProperties = [];
    this.typeProperties.push({name: NOT_IMPORT.name, title: NOT_IMPORT.title});
    this.typeProperties.push({name: AS_IS_TYPE.name, title: AS_IS_TYPE.title});

    xsdFeature.properties.forEach((property: SimpleProperty) => {
      this.typeProperties.push(property);
    });
  }

  private handleFeatures(xsdFeatures: XsdFeature[]) {
    const result: XsdFeature[] = [];

    xsdFeatures.forEach((xsdFeature: XsdFeature) => {
      const property = this.getGeometryProperty(xsdFeature);

      if (!!property && property.allowedValues.length > 0) {
        property.allowedValues.forEach(geometryType => {
          const copyOfFeature: XsdFeature = _.cloneDeep(xsdFeature);
          switch (geometryType) {
            case 'Curve':
              // Do nothing
              break;
            case 'Polygon':
              this.handleFeature(copyOfFeature, property, 'Polygon');

              result.push(copyOfFeature);
              break;
            case 'Point':
              this.handleFeature(copyOfFeature, property, 'Point');

              result.push(copyOfFeature);
              break;
            case 'LineString':
              this.handleFeature(copyOfFeature, property, 'LineString');

              result.push(copyOfFeature);
              break;
            default:
              this.logger.info('Unsupported geometry type: ', geometryType, copyOfFeature.tableName);
          }
        });
      } else {
        this.logger.warn('Not exist geometry in feature?', xsdFeature.name, property);
      }
    });

    return result;
  }

  private getGeometryProperty(xsdFeature: XsdFeature): SimpleProperty {
    return _.find(xsdFeature.properties, (property: SimpleProperty) => property.valueType === 'GEOMETRY');
  }

  // Заменить у фичи свойство геометрии с одним типом, поправить название фичи
  private handleFeature(copyOfFeature: XsdFeature, property: SimpleProperty, gType: string) {
    const propertyCopy: SimpleProperty = _.cloneDeep(property);
    propertyCopy.allowedValues = [gType];

    _.remove(copyOfFeature.properties, (prop: SimpleProperty) => prop.valueType === 'GEOMETRY');

    if (gType !== 'Polygon' && gType !== 'LineString') {
      copyOfFeature.tableName = copyOfFeature.tableName + '_' + gType.toLowerCase();
    }

    copyOfFeature.properties.push(propertyCopy);
  }
}
