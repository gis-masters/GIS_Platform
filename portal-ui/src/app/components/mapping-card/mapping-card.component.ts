import {NGXLogger} from 'ngx-logger';
import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {
  FeatureXsdDefinition,
  DataSchemaService,
  PropertySchema,
  FeatureDescription
} from '../../services/crg/data-schema.service';
import {ImportService} from '../../services/geoserver/import/import.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ImportLayerItem} from '../../services/geoserver/import/models';
import {AS_IS_TYPE, NOT_IMPORT} from '../../services/crg/models';

@Component({
  selector: 'crg-mapping-card',
  templateUrl: './mapping-card.component.html',
  styleUrls: ['./mapping-card.component.css']
})
export class MappingCardComponent implements OnInit, OnChanges, OnDestroy {

  @Input() importLayer: ImportLayerItem;

  featureDescriptions: FeatureDescription[] = [];
  typeProperties: PropertySchema[] = [];

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private ruleService: DataSchemaService,
              private importService: ImportService) {
  }

  ngOnInit() {
    this.typeProperties.push({name: NOT_IMPORT.name, title: NOT_IMPORT.title});
    this.typeProperties.push({name: AS_IS_TYPE.name, title: AS_IS_TYPE.title});

    this.ruleService.getFeaturesDefinition()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((featureXsdDefinition: FeatureXsdDefinition) => {
          if (featureXsdDefinition.xsdFeatures) {
            this.featureDescriptions = featureXsdDefinition.xsdFeatures;
          } else {
            this.logger.warn('Empty definition? ', featureXsdDefinition);
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  entityTypeSelected(selected: string) {
    const xsdFeature = this.featureDescriptions.find((type: FeatureDescription) => type.tableName === selected);

    this.importService.importFlow.setFeatureSchema(this.importLayer.nativeName, xsdFeature.tableName);
    this.typeProperties = [];
    this.typeProperties.push({name: NOT_IMPORT.name, title: NOT_IMPORT.title});
    this.typeProperties.push({name: AS_IS_TYPE.name, title: AS_IS_TYPE.title});

    xsdFeature.properties.forEach((property: PropertySchema) => {
      this.typeProperties.push(property);
    });
  }

}
