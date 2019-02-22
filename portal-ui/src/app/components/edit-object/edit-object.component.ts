import {NGXLogger} from "ngx-logger";
import {MatSnackBar} from "@angular/material";
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FgistpRulesService, XsdFeature} from "../../services/gis/fgistp-rules.service";
import {ObjectDto} from "../../services/communication.service";
import {TransformFeatureService} from "../../services/gis/transform-feature.service";
import {WfsFeatureCollection, WfsService} from "../../services/geoserver/wfs.service";

@Component({
  selector: 'crg-edit-object',
  templateUrl: './edit-object.component.html',
  styleUrls: ['./edit-object.component.css']
})
export class EditObjectComponent implements OnChanges {

  @Input() data: ObjectDto[];
  @Output() closeMe = new EventEmitter<boolean>();

  private object: ObjectDto;

  wfsFeature: any;

  featureType: XsdFeature;
  isFeatureTypeLoaded = false;

  constructor(private logger: NGXLogger,
              private snackBar: MatSnackBar,
              private wfsService: WfsService,
              private rulesService: FgistpRulesService,
              private transformFeatureService: TransformFeatureService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const dataChanged = changes['data'];

    if (dataChanged) {
      this.logger.info('ngOnChanges 2');

      if (dataChanged.currentValue) {
        this.logger.info('ngOnChanges 3');

        let newObject = Object.assign({}, dataChanged.currentValue[0]);

        this.object = newObject;
        this.handleObject(newObject);
      }
    }
  }

  private handleObject(objectDto: ObjectDto) {
    this.logger.info('handleObject', objectDto);

    this.wfsService
        .getFeature('work_workspace:' + objectDto.layerName, objectDto.id)
        .subscribe((featureCollection: WfsFeatureCollection) => {
          if (!featureCollection || !featureCollection.features.length) {
            this.logger.warn('features of object are empty: ', objectDto.id);
          } else {
            this.wfsFeature = featureCollection.features[0];

            this.featureType = this.rulesService.getFeatureByName(objectDto.layerName);
            this.logger.info('featureByName: ', this.featureType);

            this.isFeatureTypeLoaded = true;
          }
        });
  }

  editFeature() {
    if (this.wfsFeature && this.wfsFeature.properties) {
      let newProperties = {};
      // newProperties['name'] = this.newName;

      this.transformFeatureService
          .updateFeature(this.wfsFeature, newProperties,'work_workspace', this.object.layerName)
          .subscribe(value => {
            this.snackBar.open('Сохранено', 'X', {duration: 3000});
          })
    }
  }

  close() {
    this.closeMe.emit(true);
  }
}
