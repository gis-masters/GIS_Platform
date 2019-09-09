import {NGXLogger} from 'ngx-logger';
import { MatSnackBar } from '@angular/material/snack-bar';
import {WfsFeature} from '../../services/geoserver/wfs.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ProjectsService} from '../../services/crg/projects.service';
import {CommunicationService} from '../../services/communication.service';
import {OpenLayersService} from '../../services/open-layer/open-layers.service';
import {TransformFeatureService} from '../../services/geoserver/transform-feature.service';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';
import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {EditFeatureItem, DataSchemaService, PropertySchema, FeatureDescription} from '../../services/crg/data-schema.service';
import {from, Subject} from 'rxjs';
import {concatMap, takeUntil} from 'rxjs/operators';
import {FeaturePropertyValidators, ValueType} from '../../services/util/FeaturePropertyValidators';

export interface EditFeatureData {
  feature: WfsFeature;   // Шаблонная фича
  mode: EditFeatureMode;
  featuresId?: string[]; // Идентификаторы фич (заполняется в режиме множественного редактирования)
  total: number;
  properties?: {};
}

export enum EditFeatureMode {
  multipleEdit = 'multipleEdit',
  single = 'single'
}

@Component({
  selector: 'crg-edit-feature',
  templateUrl: './edit-feature.component.html',
  styleUrls: ['./edit-feature.component.css']
})
export class EditFeatureComponent implements OnChanges, OnInit, OnDestroy {

  @Input() data: EditFeatureData;
  @Output() closeMe = new EventEmitter<boolean>();

  editFeatureForm: FormGroup;
  editFeatureData: EditFeatureItem[] = [];
  isAttributeSidebarOpened = false;
  isSaveInProgress = false;
  loadPercent = 0;

  private featureDescription: FeatureDescription;
  private BATCH_SIZE = 200;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private snackBar: MatSnackBar,
              private formBuilder: FormBuilder,
              private projectsService: ProjectsService,
              private communicationService: CommunicationService,
              private sideBarManager: SideBarManager,
              private openLayers: OpenLayersService,
              private dataSchemaService: DataSchemaService,
              private transformFeatureService: TransformFeatureService) {

  }

  ngOnInit(): void {
    this.sideBarManager.currentState$
        .pipe(takeUntil(this.unsubscribe$))
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

      this.featureDescription = this.dataSchemaService.getFeatureDescriptionByName(currentData.feature.id.split('.')[0]);
      this.editFeatureForm = this.formBuilder.group({});

      Object.keys(currentData.feature.properties)
            .map(key => key)
            .filter(key => key !== 'bbox')
            .forEach(key => {
              const currentValue = currentData.feature.properties[key];
              const property = this.dataSchemaService.getPropertySchemaByName(key, this.featureDescription.properties);
              if (property) {
                this.editFeatureData.push({
                  name: key,
                  property: property,
                  value: currentValue,
                  isFgistpProperty: true
                });

                const formControl = new FormControl({value: currentValue, disabled: property.name === 'GLOBALID'}, {
                  validators: [
                    FeaturePropertyValidators.validate(property),
                  ],
                  // updateOn: 'blur'
                });

                if (this.data.mode === EditFeatureMode.multipleEdit) {
                  formControl.disable();
                }

                this.editFeatureForm.addControl(key, formControl);
              } else {
                // TODO: надобы запрашивать DescribeFeatureType по WFS и брать тип лишних атрибутов там.
                this.editFeatureData.push({
                  name: key,
                  property: {
                    name: key,
                    title: key,
                    valueType: ValueType.STRING,
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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

      const workspaceName = this.projectsService.getCurrent().crgProject.workspaceName;

      if (this.data.mode === EditFeatureMode.single) {
        this.batchUpdateFeatures([this.data.feature.id], workspaceName, this.featureDescription.tableName, newProperties);
      } else {
        this.batchUpdateFeatures(this.data.featuresId, workspaceName, this.featureDescription.tableName, newProperties);
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

  switchControl(property: PropertySchema) {
    if (this.editFeatureForm.controls[property.name.toLowerCase()].disabled) {
      // formControl.setValue('Оставить как есть');
      this.editFeatureForm.controls[property.name.toLowerCase()].enable();
    } else {
      this.editFeatureForm.controls[property.name.toLowerCase()].disable();
    }
  }

  isShowTemplate(property: PropertySchema): boolean {
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

  private batchUpdateFeatures(featuresId: string[], geoserverName: string, tableName: string, newProperties: {}) {
    const countOfParts = Math.ceil(featuresId.length / this.BATCH_SIZE);
    const onePartOf100 = 100 / countOfParts;

    const result = this.transformFeatureService.splitListToParts(featuresId, countOfParts);

    let i = 0;
    from(result)
      .pipe(
        concatMap(features => this.transformFeatureService.updateFeatures(features, geoserverName, tableName, newProperties)),
        takeUntil(this.unsubscribe$)
      ).subscribe(() => {
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
  }
}
