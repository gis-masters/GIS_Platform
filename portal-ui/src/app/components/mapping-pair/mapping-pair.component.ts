import {NGXLogger} from 'ngx-logger';
import {GeoUtil} from '../../services/util/GeoUtil';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PropertySchema} from '../../services/crg/data-schema.service';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ImportService, LayerAttribute} from '../../services/geoserver/import/import.service';
import {PropertiesComparatorService} from '../../services/properties-comparator.service';

@Component({
  selector: 'crg-mapping-pair',
  templateUrl: './mapping-pair.component.html',
  styleUrls: ['./mapping-pair.component.css']
})
export class MappingPairComponent implements OnInit, OnChanges {

  @Input() layer_attribute: LayerAttribute;
  @Input() layerName: string;
  @Input() properties: PropertySchema[];

  columnForm: FormGroup;
  selectedProperty: PropertySchema;

  constructor(private logger: NGXLogger,
              private importService: ImportService,
              private crgComparator: PropertiesComparatorService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.columnForm = this.formBuilder.group({
      columnFiz: [this.properties[0]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const propertiesChanged = changes['properties'];
    if (propertiesChanged && !propertiesChanged.isFirstChange()) {
      this.setIdenticalColumn();
    }
  }

  // Подбираем и устанавливаем наиболее похожий столбец
  private setIdenticalColumn() {
    const bestCompareProperty = this.crgComparator.compare(this.layer_attribute, this.properties);

    this.importService.importFlow.work_import.addMapping(this.layerName, this.layer_attribute, bestCompareProperty);

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

    this.importService.importFlow.work_import.updateMapping(this.layerName, this.layer_attribute, this.selectedProperty);
  }
}
