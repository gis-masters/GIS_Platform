import {Component, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {ValidationService} from "../../services/validation.service";

@Component({
  selector: 'crg-layer-objects',
  templateUrl: './layer-objects.component.html',
  styleUrls: ['./layer-objects.component.css']
})
export class LayerObjectsComponent implements OnInit {

  cols = [
    { field: 'objectId', header: 'objectId' },
    { field: 'classId', header: 'classId' },
    { field: 'violations', header: 'violations' },
    { field: 'color', header: 'count' }
  ];

  selectedItems: any;

  vResults = [];

  constructor(private logger: NGXLogger,
              private validationService: ValidationService) {
    this.logger.info('LayerObjectsComponent constructor');
  }

  ngOnInit() {
    this.validationService
        .getValidationResults({dbName: 'gis', schemaName: 'fiz', tableName: 'electricline'}, 0, 50)
        .subscribe(value => {
          this.logger.info('v: ', value);

          this.vResults = value.results;
        });
  }

}
