import {GeoUtil} from '../../services/util/GeoUtil';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PropertySchema} from '../../services/crg/data-schema.service';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PropertiesComparatorService} from '../../services/properties-comparator.service';
import {LayerAttribute} from '../../services/geoserver/import/models';
import {ImportDataHolderService} from '../../services/geoserver/import/import-data-holder.service';
import {MatchingPair} from '../../services/geoserver/import/taskImport';
import {ImportTargetType, NOT_IMPORT, AS_IS} from '../../services/crg/models';

@Component({
  selector: 'crg-mapping-pair',
  templateUrl: './mapping-pair.component.html',
  styleUrls: ['./mapping-pair.component.css']
})
export class MappingPairComponent implements OnInit, OnChanges {

  @Input() layerName: string;
  @Input() importedLayerAttribute: LayerAttribute; // Атрибут импортированного шейпа
  @Input() propertySchemas: PropertySchema[];      // Атрибуты описанные в схеме

  columnForm: FormGroup;
  selectedProperty: PropertySchema;

  constructor(private importData: ImportDataHolderService,
              private crgComparator: PropertiesComparatorService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    let currentAttrPair: MatchingPair;
    const comparableLayersPair = this.importData.findCompatiblePair(this.layerName);
    if (comparableLayersPair && comparableLayersPair.targetLayer.pairs.length > 0) {
      currentAttrPair = comparableLayersPair.targetLayer.pairs
        .find((matchingPair: MatchingPair) => matchingPair.source.name === this.importedLayerAttribute.name);

      if (currentAttrPair) {
        if (currentAttrPair.target.type === ImportTargetType.FROM_SCHEMA) {
          this.columnForm = this.formBuilder.group({
            columnFiz: [this.getPropertySchema(currentAttrPair.target.name)]
          });
        } else if (currentAttrPair.target.type === ImportTargetType.AS_IS) {
          this.columnForm = this.formBuilder.group({
            columnFiz: [this.propertySchemas[1]]
          });
        } else {
          this.columnForm = this.formBuilder.group({
            columnFiz: [this.propertySchemas[1]]
          });
        }
      } else {
        this.columnForm = this.formBuilder.group({
          columnFiz: [this.propertySchemas[0]]
        });
      }
    } else {
      this.columnForm = this.formBuilder.group({
        columnFiz: [this.propertySchemas[0]]
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const propertySchemasChanged = changes['propertySchemas'];
    if (propertySchemasChanged && !propertySchemasChanged.isFirstChange()) {
      this.setIdenticalColumn();
    }
  }

  // Подбираем и устанавливаем наиболее похожий столбец
  private setIdenticalColumn() {
    const bestCompareProperty = this.crgComparator.compare(this.importedLayerAttribute, this.propertySchemas);

    this.importData.updateAttributeMapping(this.layerName, this.importedLayerAttribute, bestCompareProperty);

    this.columnForm.controls['columnFiz'].patchValue(bestCompareProperty);
    this.selectedProperty = bestCompareProperty;
  }

  typeToString(type: string) {
    const splitType = type.split('.');

    return GeoUtil.getAliasForBaseType(splitType[splitType.length - 1]);
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.name === c2.name : c1 === c2;
  }

  columnChanged() {
    this.selectedProperty = this.columnForm.controls['columnFiz'].value as PropertySchema;

    this.importData.updateAttributeMapping(this.layerName, this.importedLayerAttribute, this.selectedProperty);
  }

  getOptionText (property: PropertySchema): string {
    const { valueType, name, title } = property;
    const isSpecial = name === NOT_IMPORT.name || name === AS_IS.name;

    return `${isSpecial ? title : name} ${valueType !== undefined ? `(${valueType})` : ''}`;
  }

  private getPropertySchema(name: string) {
    return this.propertySchemas.find((propertySchema: PropertySchema) => propertySchema.name === name);
  }
}
