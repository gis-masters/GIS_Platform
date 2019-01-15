import {NGXLogger} from 'ngx-logger';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ColumnProjection, TableProjection} from '../../services/geoserver/gis-db.service';
import {ImportService, LayerItem, AS_IS_TYPE, NOT_IMPORT} from '../../services/geoserver/import.service';

@Component({
  selector: 'crg-mapping-card',
  templateUrl: './mapping-card.component.html',
  styleUrls: ['./mapping-card.component.css']
})
export class MappingCardComponent implements OnInit, OnChanges {

  @Input() layer: LayerItem;
  @Input() tablesP10: TableProjection[];

  p10_columns: ColumnProjection[] = [];

  constructor(private logger: NGXLogger,
              private importService: ImportService) {
  }

  ngOnInit() {
    this.logger.info('Init: ', this.layer);

    this.p10_columns.push(AS_IS_TYPE, NOT_IMPORT);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.logger.info('--- ', changes['tablesP10'].currentValue);
  }

  tableSelected(selectedTable: string) {
    this.importService.importFlow.setTable(this.layer.originalName, selectedTable);

    this.p10_columns = [];
    this.p10_columns.push(AS_IS_TYPE, NOT_IMPORT);
    this.tablesP10
        .find((table: TableProjection) => table.name === selectedTable)
        .columns.forEach((columnProjection: ColumnProjection) => {
          this.p10_columns.push(columnProjection);
        });
  }

}
