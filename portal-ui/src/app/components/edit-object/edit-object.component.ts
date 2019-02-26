import {NGXLogger} from 'ngx-logger';
import {MatSnackBar} from '@angular/material';
import {ObjectDto} from '../../services/communication.service';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {TransformFeatureService} from '../../services/gis/transform-feature.service';
import {WfsFeatureCollection, WfsService} from '../../services/geoserver/wfs.service';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FgistpRulesService, SimpleProperty, XsdFeature} from '../../services/gis/fgistp-rules.service';
import {CustomValidator} from '../../services/util/CustomValidator';

@Component({
  selector: 'crg-edit-object',
  templateUrl: './edit-object.component.html',
  styleUrls: ['./edit-object.component.css']
})
export class EditObjectComponent implements OnChanges, OnInit {

  @Input() data: ObjectDto[];
  @Output() closeMe = new EventEmitter<boolean>();

  editFeatureForm: FormGroup;

  featureType: XsdFeature;
  wfsFeature: any;

  editFeatureData: EditFeatureItem[] = [];
  isFeatureTypeLoaded = false;

  private object: ObjectDto;

  constructor(private logger: NGXLogger,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private wfsService: WfsService,
              private rulesService: FgistpRulesService,
              private transformFeatureService: TransformFeatureService) {
  }

  ngOnInit(): void {
    this.editFeatureForm = this.formBuilder.group({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    const dataChanged = changes['data'];

    if (dataChanged) {
      if (dataChanged.currentValue) {
        const newObject = Object.assign({}, dataChanged.currentValue[0]);

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
          this.isFeatureTypeLoaded = true;
        } else {
          this.isFeatureTypeLoaded = true;

          this.wfsFeature = featureCollection.features[0];
          this.featureType = this.rulesService.getFeatureByName(objectDto.layerName);

          this.logger.info('featureType: ', this.featureType, this.wfsFeature);

          this.prepareEditForm();
        }
      });
  }

  prepareEditForm() {
    for (const key of Object.keys(this.wfsFeature.properties)) {
      const value = this.wfsFeature.properties[key];
      const propertiesByName = this.getPropertiesByName(key);

      const formControl = new FormControl(value,
        {
          validators: [CustomValidator.validate(propertiesByName)],
          // updateOn: 'blur'
        });

      this.editFeatureForm.addControl(key, formControl);
      this.editFeatureData.push({
        name: key,
        property: propertiesByName,
        value: value
      });
    }
  }

  private getPropertiesByName(key: string) {
    return this.featureType.properties.find((simpleProperty: SimpleProperty) => {
      return simpleProperty.name === key.toUpperCase();
    });
  }

  editFeature() {
    if (this.wfsFeature && this.wfsFeature.properties) {
      const newProperties = {};
      // newProperties['name'] = this.newName;

      this.transformFeatureService
        .updateFeature(this.wfsFeature, newProperties, 'work_workspace', this.object.layerName)
        .subscribe(value => {
          this.snackBar.open('Сохранено', 'X', {duration: 3000});
        });
    }
  }

  close() {
    this.closeMe.emit(true);
  }

}

interface EditFeatureItem {
  name: string;
  value: string;
  property: SimpleProperty;
}
