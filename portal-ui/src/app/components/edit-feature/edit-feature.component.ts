import {NGXLogger} from 'ngx-logger';
import {MatSnackBar} from '@angular/material';
import {WfsFeature} from '../../services/geoserver/wfs.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ProjectsService} from '../../services/gis/projects.service';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {TransformFeatureService} from '../../services/gis/transform-feature.service';
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {EditFeatureItem, FgistpRulesService, XsdFeature} from '../../services/gis/fgistp-rules.service';

@Component({
  selector: 'crg-edit-feature',
  templateUrl: './edit-feature.component.html',
  styleUrls: ['./edit-feature.component.css']
})
export class EditFeatureComponent implements OnChanges {

  @Input() feature: WfsFeature;
  @Output() closeMe = new EventEmitter<boolean>();

  editFeatureForm: FormGroup;
  editFeatureData: EditFeatureItem[] = [];

  private xsdFeature: XsdFeature;

  constructor(private logger: NGXLogger,
              private snackBar: MatSnackBar,
              private formBuilder: FormBuilder,
              private projectsService: ProjectsService,
              private openLayers: OpenLayersService,
              private rulesService: FgistpRulesService,
              private transformFeatureService: TransformFeatureService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['feature']) {
      this.editFeatureData = [];
      this.openLayers.showFeature(this.feature);

      this.xsdFeature = this.rulesService.getFeatureByName(this.feature.id.split('.')[0]);
      this.editFeatureForm = this.formBuilder.group({});

      Object.keys(this.feature.properties)
            .map(key => key)
            .filter(key => key !== 'bbox')
            .forEach(key => {
              const currentValue = this.feature.properties[key];
              const property = this.rulesService.getPropertiesByName(key, this.xsdFeature.properties);
              if (property) {
                this.editFeatureData.push({
                  name: key,
                  property: property,
                  value: currentValue,
                  isFgistpProperty: true
                });

                const formControl = new FormControl(currentValue);
                this.editFeatureForm.addControl(key, formControl);
              } else {
                this.editFeatureData.push({
                  name: key,
                  property: {
                    name: key,
                    title: key,
                    valueType: 'STRING',
                  },
                  value: currentValue,
                  isFgistpProperty: false
                });

                const formControl = new FormControl(currentValue);
                this.editFeatureForm.addControl(key, formControl);
              }
            });
    }
  }

  editFeature() {
    // Сохраняем только те свойства что были затронуты пользователем и валидны
    // Можно заморочится и смотреть что данные не просто затронуты но и не изменились
    const dirtyProperties: EditFeatureItem[] = this.getDirtyAndValidProperties();

    if (this.feature && this.feature.properties) {
      const newProperties = {};
      dirtyProperties.forEach((item: EditFeatureItem) => { // Collect actual value from form
        newProperties[item.name] = this.editFeatureForm.controls[item.name].value;
      });

      const projectModel = this.projectsService.getCurrent();
      this.transformFeatureService
          .updateFeature(this.feature.id, projectModel.crgProject.geoserverName, this.xsdFeature.tableName, newProperties)
          .subscribe(response => {
            if (response.includes('<wfs:totalUpdated>1</wfs:totalUpdated>')) {
              this.closeMe.emit(true);
              this.snackBar.open('Сохранено', 'X', {duration: 3000});
            } else {
              this.logger.warn('UpdateFeature response: ', response);
              this.snackBar.open('Неудалось сохранить', 'X', {duration: 6000});
            }
          });
    }
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

    this.openLayers.clearDraft();
  }

}
