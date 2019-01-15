import {NGXLogger} from 'ngx-logger';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ColumnProjection} from '../../services/geoserver/gis-db.service';
import {FizComparatorService} from '../../services/fiz-comparator.service';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ImportService, LayerAttribute} from '../../services/geoserver/import.service';

@Component({
  selector: 'crg-mapping-pair',
  templateUrl: './mapping-pair.component.html',
  styleUrls: ['./mapping-pair.component.css']
})
export class MappingPairComponent implements OnInit, OnChanges {

  @Input() layer_attribute: LayerAttribute;
  @Input() layerName: string;
  @Input() p10_columns: ColumnProjection[];

  columnForm: FormGroup;

  constructor(private logger: NGXLogger,
              private importService: ImportService,
              private crgComparator: FizComparatorService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.columnForm = this.formBuilder.group({
      columnFiz: [this.p10_columns[0]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const columnChanged = changes['p10_columns'];
    if (columnChanged && !columnChanged.isFirstChange()) {
      this.setIdenticalColumn();
    }
  }

  // Подбираем и устанавливаем наиболее похожий столбец
  private setIdenticalColumn() {
    const bestCompareColumn = this.crgComparator.compare(this.layer_attribute, this.p10_columns);

    this.importService.importFlow.work_import.addMapping(this.layerName, this.layer_attribute, bestCompareColumn);

    this.columnForm.controls['columnFiz'].patchValue(bestCompareColumn);
  }

  typeToString(type: string) {
    const splitType = type.split('.');

    return splitType[splitType.length - 1];
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.name === c2.name : c1 === c2;
  }

  columnChanged() {
    const newItem = this.columnForm.controls['columnFiz'].value as ColumnProjection;

    this.importService.importFlow.work_import.updateMapping(this.layerName, this.layer_attribute, newItem);
  }
}
