import {Component, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {ValidationService} from "../../services/validation.service";
import {CommunicationService} from "../../services/communication.service";

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
    { field: 'count', header: 'count' }
  ];

  selectedItems: any;

  vResults = [];

  constructor(private logger: NGXLogger,
              private validationService: ValidationService,
              private communicationService: CommunicationService) {
    this.logger.info('LayerObjectsComponent constructor');
  }

  ngOnInit() {
    this.validationService
        .getValidationResults({dbName: 'gis', schemaName: 'fiz', tableName: 'electrictransformer'}, 0, 50)
        .subscribe(value => {
          this.logger.info('v: ', value);

          value.results.forEach(item => {
            item['count'] = item.violations.length;
          });

          this.vResults = value.results;
        });
  }

  gotoObject(rowData) {
    this.logger.info('gotoObject: ', rowData);

    this.communicationService.gotoObject.emit(rowData['objectId']);
  }
}
