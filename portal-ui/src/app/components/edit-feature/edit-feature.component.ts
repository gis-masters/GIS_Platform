import {NGXLogger} from 'ngx-logger';
import {MatSnackBar} from '@angular/material';
import {WfsFeature} from '../../services/geoserver/wfs.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ProjectsService} from '../../services/gis/projects.service';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {TransformFeatureService} from '../../services/gis/transform-feature.service';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {EditFeatureItem, FgistpRulesService, SimpleProperty, XsdFeature} from '../../services/gis/fgistp-rules.service';

@Component({
  selector: 'crg-edit-feature',
  templateUrl: './edit-feature.component.html',
  styleUrls: ['./edit-feature.component.css']
})
export class EditFeatureComponent implements OnChanges, OnInit {

  @Input() data: EditFeatureData;
  @Output() closeMe = new EventEmitter<boolean>();

  editFeatureForm: FormGroup;
  editFeatureData: EditFeatureItem[] = [];
  isAttributeSidebarOpened = false;

  private xsdFeature: XsdFeature;

  constructor(private logger: NGXLogger,
              private snackBar: MatSnackBar,
              private formBuilder: FormBuilder,
              private projectsService: ProjectsService,
              private sideBarManager: SideBarManager,
              private openLayers: OpenLayersService,
              private rulesService: FgistpRulesService,
              private transformFeatureService: TransformFeatureService) {

  }

  ngOnInit(): void {
    this.sideBarManager.currentState$
        .subscribe(sidebarsState => {
          const attrSidebarState = sidebarsState[SidebarType.ATTRIBUTES];
          if (attrSidebarState === ActionType.OPEN) {
            this.isAttributeSidebarOpened = true;
          } else {
            this.isAttributeSidebarOpened = false;
          }
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const dataChanged = changes['data'];
    if (dataChanged) {
      this.editFeatureData = [];
      const currentData: EditFeatureData = dataChanged.currentValue;

      if (currentData.mode === EditFeatureMode.single) {
        this.openLayers.showFeature(currentData.feature);
      }

      this.xsdFeature = this.rulesService.getFeatureByName(currentData.feature.id.split('.')[0]);
      this.editFeatureForm = this.formBuilder.group({});

      Object.keys(currentData.feature.properties)
            .map(key => key)
            .filter(key => key !== 'bbox')
            .forEach(key => {
              const currentValue = currentData.feature.properties[key];
              const property = this.rulesService.getPropertiesByName(key, this.xsdFeature.properties);
              if (property) {
                this.editFeatureData.push({
                  name: key,
                  property: property,
                  value: currentValue,
                  isFgistpProperty: true
                });

                const formControl = new FormControl(currentValue);

                if (this.isUnsafeProperty(property)) {
                  formControl.disable();
                }

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

    if (this.data && this.data.feature && this.data.feature.properties) {
      const newProperties = {};
      dirtyProperties.forEach((item: EditFeatureItem) => { // Collect actual value from form
        newProperties[item.name] = this.editFeatureForm.controls[item.name].value;
      });

      const projectModel = this.projectsService.getCurrent();

      if (this.data.mode === EditFeatureMode.single) {
        this.transformFeatureService
          .updateFeature(this.data.feature.id, projectModel.crgProject.geoserverName, this.xsdFeature.tableName, newProperties)
          .subscribe(response => {
            if (response.includes('<wfs:totalUpdated>1</wfs:totalUpdated>')) {
              this.closeMe.emit(true);
              this.snackBar.open('Сохранено', 'X', {duration: 3000});
            } else {
              this.logger.warn('UpdateFeature response: ', response);
              this.snackBar.open('Неудалось сохранить', 'X', {duration: 6000});
            }
          });
      } else {
        this.transformFeatureService
            .updateFeatures(this.data.featuresId, projectModel.crgProject.geoserverName, this.xsdFeature.tableName, newProperties)
            .subscribe(response => {
              const countFeatures = Object.keys(this.data.featuresId).length;

              if (response.includes('<wfs:totalUpdated>' + countFeatures + '</wfs:totalUpdated>')) {
                this.closeMe.emit(true);
                this.snackBar.open('Сохранено', 'X', {duration: 3000});
              } else {
                this.logger.warn('UpdateFeature response: ', response);
                this.snackBar.open('Неудалось сохранить', 'X', {duration: 6000});
              }
            });
      }
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

  getFeaturesCount(featuresId: {}) {
    if (featuresId) {
      return Object.keys(featuresId).length;
    } else {
      return undefined;
    }
  }

  getTooltip(featuresId: {}) {
    const featuresCount = this.getFeaturesCount(featuresId);
    if (featuresCount) {
      return 'Сохранить данные для ' + featuresCount + ' обьектов';
    } else {
      return 'Сохраниить обьект';
    }
  }

  isUnsafeProperty(property: SimpleProperty): boolean {
    if (this.data.mode === EditFeatureMode.single) {
      return false;
    }

    const propName = property.name.toLowerCase();
    if (this.data.unsafeProperties[propName]) {
      return true;
    }

    return false;
  }

  enableControl(property: SimpleProperty) {
    this.editFeatureForm.controls[property.name.toLowerCase()].enable();
  }
}

export interface EditFeatureData {
  feature: WfsFeature;
  mode: EditFeatureMode;
  unsafeProperties?: {}; // Неодинаковые свойства фич (заполняется в режиме множественного редактирования)
  featuresId?: {}; // Идентификаторы фич (заполняется в режиме множественного редактирования)
}

export enum EditFeatureMode {
  multipleEdit = 'multipleEdit',
  single = 'single'
}
