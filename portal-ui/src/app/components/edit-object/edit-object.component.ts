import {NGXLogger} from "ngx-logger";
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CommunicationService, ObjectDto} from "../../services/communication.service";
import {WfsFeatureCollection, WfsService} from "../../services/geoserver/wfs.service";
import {FgistpRulesService} from "../../services/gis/fgistp-rules.service";

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
              private fgistpService: FgistpRulesService,
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
          if (!featureCollection.features.length) {
            this.logger.warn('features of object are empty: ', objectDto.id);
          } else {
            this.wfsFeature = featureCollection.features[0].properties;
          }
        });
  }
}
