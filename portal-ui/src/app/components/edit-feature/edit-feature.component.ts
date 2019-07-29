import {NGXLogger} from 'ngx-logger';
import {MatSnackBar} from '@angular/material';
import {WfsFeature} from '../../services/geoserver/wfs.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ProjectsService} from '../../services/crg/projects.service';
import {CommunicationService} from '../../services/communication.service';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {TransformFeatureService} from '../../services/geoserver/transform-feature.service';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {EditFeatureItem, FgistpRulesService, SimpleProperty, XsdFeature} from '../../services/crg/fgistp-rules.service';
import {from} from 'rxjs';
import {concatMap} from 'rxjs/operators';

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
  isSaveInProgress = false;
  loadPercent = 0;

  private xsdFeature: XsdFeature;
  private BATCH_SIZE = 200;

  constructor(private logger: NGXLogger,
              private snackBar: MatSnackBar,
              private formBuilder: FormBuilder,
              private projectsService: ProjectsService,
              private communicationService: CommunicationService,
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

      this.xsdFeature = this.rulesService.getFeatureByName(currentData.feature.id.split('.')[0], 'edit feature');
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

                if (this.data.mode === EditFeatureMode.multipleEdit) {
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

                if (this.data.mode === EditFeatureMode.multipleEdit) {
                  formControl.disable();
                }

                this.editFeatureForm.addControl(key, formControl);
              }
            });
    }
  }

  editFeature() {
    if (this.editFeatureForm.pristine) {
      return;
    }

    this.isSaveInProgress = true;
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
            .updateFeature(this.data.feature.id, projectModel.crgProject.workspaceName, this.xsdFeature.tableName, newProperties)
            .subscribe(response => {
              this.isSaveInProgress = false;
              if (response.includes('<wfs:totalUpdated>1</wfs:totalUpdated>')) {
                this.closeMe.emit(true);
                this.snackBar.open('Сохранено', 'X', {duration: 3000});
                this.communicationService.featuresUpdate$.emit({
                  feature: this.data.feature,
                  total: 1,
                  mode: EditFeatureMode.single,
                  properties: newProperties
                });
              } else {
                this.logger.warn('UpdateFeature response: ', response);
                this.snackBar.open('Не удалось сохранить', 'X', {duration: 6000});
              }
            });
      } else {
        this.batchUpdateFeatures(this.data.featuresId, projectModel.crgProject.workspaceName, this.xsdFeature.tableName, newProperties);
      }
    }
  }

  getTooltip() {
    const featuresCount = this.data.total;
    if (featuresCount) {
      return 'Сохранить данные для ' + this.data.total + ' обьектов';
    } else {
      return 'Сохраниить обьект';
    }
  }

  switchControl(property: SimpleProperty) {
    if (this.editFeatureForm.controls[property.name.toLowerCase()].disabled) {
      // formControl.setValue('Оставить как есть');
      this.editFeatureForm.controls[property.name.toLowerCase()].enable();
    } else {
      this.editFeatureForm.controls[property.name.toLowerCase()].disable();
    }
  }

  isShowTemplate(property: SimpleProperty): boolean {
    return this.editFeatureForm.controls[property.name.toLowerCase()].disabled;
  }

  close() {
    this.closeMe.emit(true);

    this.openLayers.clearDraft();
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

  private splitTo(arr, n): [] {
    const plen = Math.ceil(arr.length / n);

    return arr.reduce(function (p, c, i, a) {
      if (i % plen === 0) {
        p.push([]);
      }

      p[p.length - 1][i] = c;

      return p;
    }, []);
  }

  private batchUpdateFeatures(featuresId: string[], geoserverName: string, tableName: string, newProperties: {}) {
    if (featuresId.length > this.BATCH_SIZE) {
      const countOfParts = Math.ceil(featuresId.length / this.BATCH_SIZE);
      const onePartOf100 = 100 / countOfParts;

      const result = this.splitTo(featuresId, countOfParts);

      let i = 0;
      from(result)
        .pipe(
          concatMap(features => this.transformFeatureService.updateFeatures(features, geoserverName, tableName, newProperties)),
        ).subscribe(value => {
          i++;
          const percent = Math.ceil(onePartOf100 * i);
          if (i >= countOfParts) {
            this.loadPercent = percent > 100 ? 100 : percent;
            this.isSaveInProgress = false;
            this.closeMe.emit(true);
            this.snackBar.open('Сохранено', 'X', {duration: 3000});

            this.communicationService.featuresUpdate$.emit({
              feature: this.data.feature,
              featuresId: this.data.featuresId,
              total: this.data.total,
              mode: EditFeatureMode.multipleEdit,
              properties: newProperties
            });
          } else {
            this.loadPercent = percent > 100 ? 100 : percent;
          }
        });
    } else {
      this.transformFeatureService
          .updateFeatures(featuresId, geoserverName, tableName, newProperties)
          .subscribe(response => {
            this.loadPercent = 100;
            if (response.includes('<wfs:totalUpdated>' + this.data.total + '</wfs:totalUpdated>')) {
              const timeout = setTimeout(() => {
                this.isSaveInProgress = false;
                this.closeMe.emit(true);
                this.snackBar.open('Сохранено', 'X', {duration: 3000});

                clearTimeout(timeout);
              }, 100);

              this.communicationService.featuresUpdate$.emit({
                feature: this.data.feature,
                featuresId: this.data.featuresId,
                total: this.data.total,
                mode: EditFeatureMode.multipleEdit,
                properties: newProperties
              });
            } else {
              this.logger.warn('UpdateFeature response: ', response);
              this.snackBar.open('Не удалось сохранить', 'X', {duration: 6000});
            }
          });
    }
  }
}

export interface EditFeatureData {
  feature: WfsFeature;    // Шаблонная фича
  mode: EditFeatureMode;
  featuresId?: string[]; // Идентификаторы фич (заполняется в режиме множественного редактирования)
  total: number;
  properties?: {};
}

export enum EditFeatureMode {
  multipleEdit = 'multipleEdit',
  single = 'single'
}
