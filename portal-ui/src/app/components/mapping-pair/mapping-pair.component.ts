import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { OldPropertySchema } from '../../services/data/schema/schemaOld.models';
import { LayerAttribute } from '../../services/geoserver/import/import.models';
import { ImportDataHolderService } from '../../services/geoserver/import/import-data-holder.service';
import { MatchingPair } from '../../services/geoserver/import/taskImport';
import { AS_IS, ImportTargetType, NOT_IMPORT } from '../../services/models';
import { PropertiesComparatorService } from '../../services/properties-comparator.service';
import { GeoUtil } from '../../services/util/GeoUtil';

const invalid = 'Не указаны обязательные атрибуты компонента';

@Component({
  selector: 'crg-mapping-pair',
  templateUrl: './mapping-pair.component.html'
})
export class MappingPairComponent implements OnInit, OnChanges {
  @Input() layerName?: string;
  @Input() importedLayerAttribute?: LayerAttribute; // Атрибут импортированного шейпа
  @Input() propertySchemas?: OldPropertySchema[]; // Атрибуты описанные в схеме

  columnForm?: UntypedFormGroup;
  selectedProperty?: OldPropertySchema;

  constructor(
    private importData: ImportDataHolderService,
    private crgComparator: PropertiesComparatorService,
    private formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit() {
    if (!this.layerName) {
      throw new Error(invalid);
    }
    let currentAttrPair: MatchingPair | undefined;
    const comparableLayersPair = this.importData.findCompatiblePair(this.layerName);
    if (comparableLayersPair && comparableLayersPair.targetLayer.pairs.length > 0) {
      currentAttrPair = comparableLayersPair.targetLayer.pairs.find(
        (matchingPair: MatchingPair) => matchingPair.source.name === this.importedLayerAttribute?.name
      );

      if (currentAttrPair) {
        if (currentAttrPair.target.type === ImportTargetType.FROM_SCHEMA) {
          this.columnForm = this.formBuilder.group({
            columnFiz: [this.getPropertySchema(currentAttrPair.target.name)]
          });
        } else if (currentAttrPair.target.type === ImportTargetType.AS_IS) {
          this.columnForm = this.formBuilder.group({
            columnFiz: [this.propertySchemas?.[1]]
          });
          // eslint-disable-next-line sonarjs/no-duplicated-branches
        } else {
          this.columnForm = this.formBuilder.group({
            columnFiz: [this.propertySchemas?.[1]]
          });
        }
      } else {
        this.columnForm = this.formBuilder.group({
          columnFiz: [this.propertySchemas?.[0]]
        });
      }
    } else {
      this.columnForm = this.formBuilder.group({
        columnFiz: [this.propertySchemas?.[0]]
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const propertySchemasChanged = changes.propertySchemas;
    if (propertySchemasChanged && !propertySchemasChanged.isFirstChange()) {
      this.setIdenticalColumn();
    }
  }

  // Подбираем и устанавливаем наиболее похожий столбец
  private setIdenticalColumn() {
    if (!this.importedLayerAttribute || !this.propertySchemas || !this.layerName) {
      throw new Error(invalid);
    }

    const bestCompareProperty = this.crgComparator.compare(this.importedLayerAttribute, this.propertySchemas);

    this.importData.updateAttributeMapping(this.layerName, this.importedLayerAttribute, bestCompareProperty);

    this.columnForm?.controls.columnFiz.patchValue(bestCompareProperty);
    this.selectedProperty = bestCompareProperty;
  }

  typeToString(type: string): string {
    return GeoUtil.getAliasForBaseType(type.split('.').at(-1) || '');
  }

  compareFn(c1: { name?: unknown }, c2?: { name?: unknown }): boolean {
    return c1 && c2 ? c1.name === c2.name : c1 === c2;
  }

  columnChanged(): void {
    if (!this.importedLayerAttribute || !this.layerName) {
      throw new Error(invalid);
    }

    this.selectedProperty = this.columnForm?.controls.columnFiz.value as OldPropertySchema;
    this.importData.updateAttributeMapping(this.layerName, this.importedLayerAttribute, this.selectedProperty);
  }

  getOptionText(property: OldPropertySchema): string {
    const { valueType, name, title } = property;
    const isSpecial = name === NOT_IMPORT.name || name === AS_IS.name;

    return (isSpecial ? title : name) + (valueType === undefined ? '' : ` (${valueType})`);
  }

  private getPropertySchema(name: string) {
    return this.propertySchemas?.find((propertySchema: OldPropertySchema) => propertySchema.name === name);
  }
}
