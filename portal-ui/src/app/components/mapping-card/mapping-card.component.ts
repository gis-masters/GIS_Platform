import {NGXLogger} from 'ngx-logger';
import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {
  DataSchemaService,
  FeatureDescription,
  FeatureXsdDefinition,
  PropertySchema
} from '../../services/crg/data-schema.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ImportLayerItem} from '../../services/geoserver/import/models';
import {AS_IS, IMPORT_LAYER_AS_IS, NOT_IMPORT, NOT_IMPORT_LAYER} from '../../services/crg/models';
import {ImportDataHolderService, InputDataMetrics} from '../../services/geoserver/import/import-data-holder.service';
import {FeatureUtil} from '../../services/util/FeatureUtil';
import {ProjectsService} from '../../services/crg/projects.service';

@Component({
  selector: 'crg-mapping-card',
  templateUrl: './mapping-card.component.html',
  styleUrls: ['./mapping-card.component.css']
})
export class MappingCardComponent implements OnInit, OnChanges, OnDestroy {

  @Input() importLayer: ImportLayerItem;

  allFeatureDescriptions: FeatureDescription[] = [];
  featureDescriptions: FeatureDescription[] = [];

  propertySchemas: PropertySchema[] = [];

  selectedFeatureType: string;

  metrics: InputDataMetrics;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private dataSchemaService: DataSchemaService,
              private importData: ImportDataHolderService) {
    this.importData.metrics$
        .subscribe((metrics: InputDataMetrics) => this.metrics = metrics);
  }

  async ngOnInit() {
    this.propertySchemas.push({name: NOT_IMPORT.name, title: NOT_IMPORT.title});
    this.propertySchemas.push({name: AS_IS.name, title: AS_IS.title});

    this.dataSchemaService.fetchAllSchemas()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((featureXsdDefinition: FeatureXsdDefinition) => {
          if (featureXsdDefinition.schemas) {
            this.allFeatureDescriptions = featureXsdDefinition.schemas;
          } else {
            this.logger.warn('Empty definition? ', featureXsdDefinition);
          }
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const simpleChange = changes.importLayer;
    if (simpleChange && !simpleChange.isFirstChange()) {
      if (simpleChange.currentValue) {
        const newLayer = simpleChange.currentValue as ImportLayerItem;

        this.selectedFeatureType = undefined;

        const filteredByGeometrySchemas = FeatureUtil.filterByGeometry(this.allFeatureDescriptions, newLayer);
        const sortedByBestMatching = FeatureUtil.sortByBestCompatibility(filteredByGeometrySchemas, newLayer);

        this.featureDescriptions = [NOT_IMPORT_LAYER, IMPORT_LAYER_AS_IS, ...sortedByBestMatching];

        const comparableLayersPair = this.importData.findCompatiblePair(newLayer.nativeName);
        if (comparableLayersPair.isDisabled) {
          this.selectedFeatureType = NOT_IMPORT_LAYER.name;
        } else if (comparableLayersPair.targetLayer.schemaName === IMPORT_LAYER_AS_IS.tableName) {
          this.selectedFeatureType = IMPORT_LAYER_AS_IS.name;
        } else {
          const schemaName = comparableLayersPair.targetLayer.schemaName;
          if (schemaName) {
            const featureDescription = this.findDescription(schemaName);
            if (featureDescription) {
              this.selectedFeatureType = featureDescription.name;

              this.propertySchemas = FeatureUtil.preparePropertySchema(featureDescription);
            } else {
              this.logger.warn('Not found schema:', schemaName);
            }
          }
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  featureTypeChanged(selectedTableName: string) {
    if (selectedTableName === IMPORT_LAYER_AS_IS.name) {
      this.importData.setFeatureSchema(this.importLayer.nativeName, IMPORT_LAYER_AS_IS.tableName);
    } else if (selectedTableName === NOT_IMPORT_LAYER.name) {
      this.importData.deleteMapping(this.importLayer.nativeName);
    } else {
      const featureDescription = this.findDescription(selectedTableName);

      this.importData.setFeatureSchema(this.importLayer.nativeName, featureDescription.tableName);

      this.propertySchemas = FeatureUtil.preparePropertySchema(featureDescription);
    }
  }

  findDescription(tableName: string): FeatureDescription {
    return this.allFeatureDescriptions.find((type: FeatureDescription) => type.tableName === tableName);
  }

  openAttributes() {
    return !!this.selectedFeatureType &&
             this.selectedFeatureType !== 'NOT_IMPORT_LAYER' &&
             this.selectedFeatureType !== 'IMPORT_LAYER_AS_IS';
  }

}
