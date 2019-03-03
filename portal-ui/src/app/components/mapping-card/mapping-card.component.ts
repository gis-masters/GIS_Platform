import {NGXLogger} from 'ngx-logger';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {
  XsdFeature,
  SimpleProperty,
  FeatureXsdDefinition,
  FgistpRulesService
} from '../../services/gis/fgistp-rules.service';
import {ImportService, LayerItem, AS_IS_TYPE, NOT_IMPORT} from '../../services/geoserver/import.service';

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
          this.entityTypes = entityTypesDefinition.xsdFeatures;
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
    const xsdFeature = this.entityTypes.find((type: XsdFeature) => type.name === selected);

    this.importService.importFlow.setTable(this.layer.originalName, xsdFeature.tableName);
    this.typeProperties = [];
    this.typeProperties.push({name: NOT_IMPORT.name, title: NOT_IMPORT.title});
    this.typeProperties.push({name: AS_IS_TYPE.name, title: AS_IS_TYPE.title});

    xsdFeature.properties.forEach((property: SimpleProperty) => {
      this.typeProperties.push(property);
    });
  }

}
