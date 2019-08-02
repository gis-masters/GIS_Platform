import {NGXLogger} from 'ngx-logger';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {
  FeatureXsdDefinition,
  DataSchemaService,
  SimpleProperty,
  FeatureDescription
} from '../../services/crg/data-schema.service';
import {AS_IS_TYPE, ImportService, ImportLayerItem, NOT_IMPORT} from '../../services/geoserver/import/import.service';

@Component({
  selector: 'crg-mapping-card',
  templateUrl: './mapping-card.component.html',
  styleUrls: ['./mapping-card.component.css']
})
export class MappingCardComponent implements OnInit, OnChanges {

  @Input() importLayer: ImportLayerItem;

  featureDescriptions: FeatureDescription[] = [];
  typeProperties: SimpleProperty[] = [];

  constructor(private logger: NGXLogger,
              private ruleService: DataSchemaService,
              private importService: ImportService) {
  }

  ngOnInit() {
    this.typeProperties.push({name: NOT_IMPORT.name, title: NOT_IMPORT.title});
    this.typeProperties.push({name: AS_IS_TYPE.name, title: AS_IS_TYPE.title});

    this.ruleService.getRules()
        .subscribe((featureXsdDefinition: FeatureXsdDefinition) => {
          if (featureXsdDefinition.xsdFeatures) {
            this.featureDescriptions = featureXsdDefinition.xsdFeatures;
          } else {
            this.logger.warn('Empty rules? ', featureXsdDefinition);
          }
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const simpleChange = changes['layer'];
    if (simpleChange && !simpleChange.isFirstChange()) {
      if (simpleChange.currentValue) {
        this.importLayer = simpleChange.currentValue;
      }
    }
  }

  entityTypeSelected(selected: string) {
    const xsdFeature = this.featureDescriptions.find((type: FeatureDescription) => type.tableName === selected);

    this.importService.importFlow.setTable(this.importLayer.originalName, xsdFeature.tableName);
    this.typeProperties = [];
    this.typeProperties.push({name: NOT_IMPORT.name, title: NOT_IMPORT.title});
    this.typeProperties.push({name: AS_IS_TYPE.name, title: AS_IS_TYPE.title});

    xsdFeature.properties.forEach((property: SimpleProperty) => {
      this.typeProperties.push(property);
    });
  }

}
