import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';

import { OldPropertySchema, OldSchema, ValueType } from '../../services/data/schema/schemaOld.models';
import { ImportLayerItem } from '../../services/geoserver/import/import.models';
import { ImportDataHolderService, InputDataMetrics } from '../../services/geoserver/import/import-data-holder.service';
import { AS_IS, IMPORT_LAYER_AS_IS, NOT_IMPORT, NOT_IMPORT_LAYER } from '../../services/models';
import { FeatureUtil } from '../../services/util/FeatureUtil';

@Component({
  selector: 'crg-mapping-card',
  templateUrl: './mapping-card.component.html',
  styleUrls: ['./mapping-card.component.css']
})
export class MappingCardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() importLayer?: ImportLayerItem;
  @Input() schemas?: OldSchema[];

  featureDescriptions: OldSchema[] = [];
  searchingFeatureDescriptions: OldSchema[] = [];

  propertySchemas: OldPropertySchema[] = [];

  selectedFeatureType?: string;
  searchWord?: string;

  metrics?: InputDataMetrics;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private logger: NGXLogger,
    private importData: ImportDataHolderService
  ) {
    this.importData.metrics$.subscribe((metrics: InputDataMetrics) => (this.metrics = metrics));
  }

  ngOnInit() {
    this.propertySchemas.push(
      { name: NOT_IMPORT.name, title: NOT_IMPORT.title, valueType: ValueType.STRING },
      { name: AS_IS.name, title: AS_IS.title, valueType: ValueType.STRING }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedFeatureType = '';
    const simpleChange = changes.importLayer;
    if (this.schemas && simpleChange && !simpleChange.isFirstChange() && simpleChange.currentValue) {
      const newLayer = simpleChange.currentValue as ImportLayerItem;
      const filteredByGeometrySchemas = FeatureUtil.filterByGeometry(this.schemas, newLayer);
      const sortedByBestMatching = FeatureUtil.sortByBestCompatibility(filteredByGeometrySchemas, newLayer);

      this.featureDescriptions = [NOT_IMPORT_LAYER, IMPORT_LAYER_AS_IS, ...sortedByBestMatching];
      this.searchingFeatureDescriptions = [NOT_IMPORT_LAYER, IMPORT_LAYER_AS_IS, ...sortedByBestMatching];

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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  featureTypeChanged(selectedTable: { name: string; title: string }): void {
    if (!this.importLayer) {
      return;
    }

    if (selectedTable.name === IMPORT_LAYER_AS_IS.name) {
      this.selectedFeatureType = selectedTable.name;
      this.importData.setFeatureSchema(this.importLayer.nativeName, IMPORT_LAYER_AS_IS);
    } else if (selectedTable.name === NOT_IMPORT_LAYER.name) {
      this.selectedFeatureType = selectedTable.name;
      this.importData.deleteMapping(this.importLayer.nativeName);
    } else {
      this.selectedFeatureType = '(' + selectedTable.name + ')' + ' ' + selectedTable.title;
      const featureDescription = this.findDescription(selectedTable.name);

      this.importData.setFeatureSchema(this.importLayer.nativeName, featureDescription);

      this.propertySchemas = FeatureUtil.preparePropertySchema(featureDescription);
    }
  }

  onSearchChange(searchValue: string): void {
    this.searchingFeatureDescriptions = this.featureDescriptions.filter(
      item => item.name.toLowerCase().indexOf(searchValue.toLowerCase()) + 1
    );

    if (!this.searchingFeatureDescriptions.length) {
      this.searchingFeatureDescriptions = this.featureDescriptions.filter(
        item => item.title.toLowerCase().indexOf(searchValue.toLowerCase()) + 1
      );
    }
  }

  findDescription(tableName: string): OldSchema {
    const schema = this.schemas?.find((type: OldSchema) => type.tableName === tableName);

    if (!schema) {
      throw new Error(`Не найдена схема "${tableName}"`);
    }

    return schema;
  }

  openAttributes(): boolean {
    return (
      !!this.selectedFeatureType &&
      this.selectedFeatureType !== 'NOT_IMPORT_LAYER' &&
      this.selectedFeatureType !== 'IMPORT_LAYER_AS_IS'
    );
  }
}
