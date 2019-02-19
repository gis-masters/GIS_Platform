import {NGXLogger} from "ngx-logger";
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CommunicationService, ObjectDto} from "../../services/communication.service";
import {WfsFeature, WfsFeatureCollection, WfsService} from "../../services/geoserver/wfs.service";

@Component({
  selector: 'crg-edit-object',
  templateUrl: './edit-object.component.html',
  styleUrls: ['./edit-object.component.css']
})
export class EditObjectComponent implements OnChanges {

  @Input() data: ObjectDto[];

  wfsFeature: any;

  constructor(private logger: NGXLogger,
              private wfsService: WfsService,
              private communicationService: CommunicationService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const dataChanged = changes['data'];
    if (dataChanged && !dataChanged.isFirstChange()) {
      if (dataChanged.currentValue) {
        let newObject = Object.assign({}, dataChanged.currentValue[0]);

        this.handleObject(newObject);
      }
    }
  }


  private handleObject(objectDto: ObjectDto) {
    this.wfsService
        .getFeature('work_workspace:' + objectDto.layerName, objectDto.id)
        .subscribe((featureCollection: WfsFeatureCollection) => {
          this.wfsFeature = featureCollection.features[0].properties;
        });
  }
}
