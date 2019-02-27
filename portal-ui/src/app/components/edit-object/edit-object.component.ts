import {NGXLogger} from 'ngx-logger';
import {MatSnackBar} from '@angular/material';
import {ObjectDto} from '../../services/communication.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {TransformFeatureService} from '../../services/gis/transform-feature.service';
import {WfsFeatureCollection, WfsService} from '../../services/geoserver/wfs.service';
import {FeaturePropertyValidators} from '../../services/util/FeaturePropertyValidators';
import {ValidationResponse, ValidationService} from '../../services/gis/validation.service';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FgistpRulesService, SimpleProperty, XsdFeature} from '../../services/gis/fgistp-rules.service';

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
              private validationService: ValidationService,
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
        // TODO: Берем только первое значение(В таблице пока нельзя выбирать)
        const newObject = Object.assign({}, dataChanged.currentValue[0]);

        this.object = newObject;
        this.handleObject(newObject);
      }
    }
  }

  prepareEditForm() {
    for (const key of Object.keys(this.wfsFeature.properties)) {
      const value = this.wfsFeature.properties[key];
      const property = this.getPropertiesByName(key);

      const formControl = new FormControl(value, {
          validators: [
            FeaturePropertyValidators.required(property),
            FeaturePropertyValidators.enumeration(property),
            FeaturePropertyValidators.minLength(property),
            FeaturePropertyValidators.maxLength(property),
            FeaturePropertyValidators.totalDigits(property),

            // pattern?: string;
            // minInclusive?: number;
            // maxInclusive?: number;
            // allowedValues?: string[];
          ],
          // updateOn: 'blur'
        });

      this.editFeatureForm.addControl(key, formControl);
      this.editFeatureData.push({
        name: key,
        property: property,
        value: value
      });
    }
  }

  editFeature() {
    // Сохраняем только те свойства что были затронуты пользователем и валидны
    // Можно заморочится и смотреть что данные не просто затронуты но и не изменились
    const dirtyProperties: EditFeatureItem[] = this.getDirtyAndValidProperties();

    if (this.wfsFeature && this.wfsFeature.properties) {
      const newProperties = {};
      dirtyProperties.forEach((item: EditFeatureItem) => { // Collect actual value from form
        newProperties[item.name] = this.editFeatureForm.controls[item.name].value;
      });

      this.transformFeatureService
          .updateFeature(this.wfsFeature, newProperties, this.object.crgLayer)
          .subscribe(response => {
            if (response.includes('<wfs:totalUpdated>1</wfs:totalUpdated>')) {

              // Сразу провалидируем слой при успешном сохранении
              this.validationService.validateLayers([
                    {
                      complexName: '', href: '', name: '', title: '',
                      connectionInfo: {dbName: 'gis', schemaName: 'fiz', tableName: this.featureType.tableName}
                    }
                  ])
                  .subscribe((responses: ValidationResponse[]) => {
                    this.snackBar.open('Сохранено', 'X', {duration: 3000});

                    this.closeMe.emit(true);
                  });
            } else {
              this.logger.warn('UpdateFeature response: ', response);
            }
          });
    }
  }

  private handleObject(objectDto: ObjectDto) {
    this.wfsService
        .getFeature(objectDto.crgLayer.complexName, objectDto.id)
        .subscribe((featureCollection: WfsFeatureCollection) => {
          if (!featureCollection || !featureCollection.features.length) {
            this.logger.warn('features of object are empty: ', objectDto.id);
            this.isFeatureTypeLoaded = true;
          } else {
            this.isFeatureTypeLoaded = true;

            this.wfsFeature = featureCollection.features[0];
            this.featureType = this.rulesService.getFeatureByName(objectDto.crgLayer.name);

            this.logger.info('featureType: ', this.featureType, this.wfsFeature);

            this.prepareEditForm();
          }
        });
  }

  private getPropertiesByName(key: string) {
    return this.featureType.properties.find((simpleProperty: SimpleProperty) => {
      return simpleProperty.name === key.toUpperCase();
    });
  }

  private getDirtyAndValidProperties(): EditFeatureItem[] {
    const result: EditFeatureItem[] = [];
    if (!this.editFeatureForm.dirty) {
      return result;
    }

    this.editFeatureData.forEach((property: EditFeatureItem) => {
      const formProperty = this.editFeatureForm.controls[property.name];
      if (formProperty.dirty && formProperty.valid) {
        result.push(property);
      }
    });

    return result;
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
