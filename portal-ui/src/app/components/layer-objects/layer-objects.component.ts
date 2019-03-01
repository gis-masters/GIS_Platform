import {NGXLogger} from 'ngx-logger';
import {Component, OnInit} from '@angular/core';
import {CommunicationService} from '../../services/communication.service';

@Component({
  selector: 'crg-layer-objects',
  templateUrl: './layer-objects.component.html',
  styleUrls: ['./layer-objects.component.css']
})
export class LayerObjectsComponent implements OnInit {

  cols = [
    { field: 'objectId', header: 'objectId' },
    { field: 'classId', header: 'classId' },
    { field: 'propertyViolations', header: 'propertyViolations' },
    { field: 'count', header: 'count' }
  ];

  selectedItems: any;

  vResults = [];

  constructor(private logger: NGXLogger,
              private communicationService: CommunicationService) {
    this.logger.info('LayerObjectsComponent constructor');
  }

  ngOnInit() {
  }

  gotoObject(rowData) {
    this.logger.info('gotoObject: ', rowData);

    // this.communicationService.gotoObject.emit(rowData['objectId']);
  }
}
