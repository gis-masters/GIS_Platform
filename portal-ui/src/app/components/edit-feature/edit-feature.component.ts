import { Component, EventEmitter, Input, OnChanges, OnInit, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, filter, first } from 'rxjs/operators';

import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '../dialogs/confirm-dialog/confirm-dialog.component';
import { communicationService } from '../../services/communication.service';
import { openLayersService } from '../../services/open-layer/open-layers.service';
import { TransformFeatureService } from '../../services/geoserver/transform-feature.service';
import { sideBarManager, ActionType, SidebarType } from '../../services/side-bar-manager.service';
import { dataSchemaService, PropertySchema } from '../../services/crg/data-schema.service';
import { FeaturePropertyValidators, ValueType } from '../../services/util/FeaturePropertyValidators';
import { BaseEdit } from '../edit-bug-object/base-edit';
import { Toast } from '../Toast/Toast';
import { BatchModel } from '../../services/crg/batch-model';
import { WfsFeature, WfsGeometry } from '../../services/geoserver/wfs-models';
import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';
import { fromMobx } from '../../services/util/fromMobx';
import { ValueTitleProjection } from '../../services/geoserver/projections';
import { currentProject } from '../../stores/CurrentProject.store';

export interface EditFeatureData {
  features: WfsFeature[];
  mode: EditFeatureMode;
  total?: number;
  properties?: {[key: string]: any};
  isNew?: true;
}

interface Properties { [key: string]: any; }

export enum EditFeatureMode {
  multipleEdit = 'multipleEdit',
  single = 'single'
}

@Component({
  selector: 'crg-edit-feature',
  templateUrl: './edit-feature.component.html',
  styleUrls: ['./edit-feature.component.css']
})
export class EditFeatureComponent extends BaseEdit implements OnChanges, OnInit, OnDestroy {
  @Input() data: EditFeatureData;
  @Output() closeMe = new EventEmitter<boolean>();
  @Output() delete = new EventEmitter<string>();

  isAttributeSidebarOpened = false;
  isSaveInProgress = false;
  loadPercent = 0;
  changedGeometry?: WfsGeometry;
  isGeometryValid = false;
  isGeometryChanged = false;
  editGeometryStore = new EditFeatureGeometryStore();
  private unsubscribeFromMobx$: Subject<void> = new Subject<void>();

  get readOnly (): boolean {
    return this.featureDescription && this.featureDescription.readOnly;
  }

  constructor(private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private transformFeatureService: TransformFeatureService) {
    super();
  }

  ngOnInit(): void {
    sideBarManager.currentState$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(sidebarsState => {
          const attrSidebarState = sidebarsState[SidebarType.ATTRIBUTES];
          this.isAttributeSidebarOpened = attrSidebarState === ActionType.OPEN;
        });

    this.editFeatureForm.valueChanges.subscribe(featureProperties => {
      this.validateCustomRules(featureProperties);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.unsubscribeFromMobx$.next();
    delete this.changedGeometry;
    this.isGeometryValid = false;
    this.isGeometryChanged = false;
    this.editGeometryStore.initGeometry(this.data.features[0].geometry);

    if (!this.readOnly) {
      fromMobx(() => this.editGeometryStore.geometry.coordinates.flat(5), false)
        .pipe(first())
        .pipe(takeUntil(this.unsubscribe$))
        .pipe(takeUntil(this.unsubscribeFromMobx$))
        .subscribe(() => {
          fromMobx(() => this.editGeometryStore.resultGeometry)
              .pipe(takeUntil(this.unsubscribe$))
              .pipe(takeUntil(this.unsubscribeFromMobx$))
              .subscribe(changedGeometry => {
                this.changedGeometry = changedGeometry;

                if (this.editGeometryStore.isValid) {
                  const feature = {
                    ...this.data.features[0],
                    geometry: changedGeometry
                  };
                  openLayersService.highlightFeature(feature);
                } else {
                  openLayersService.clearDraft();
                }
              });

          fromMobx(() => this.editGeometryStore.isValid)
              .pipe(takeUntil(this.unsubscribe$))
              .pipe(takeUntil(this.unsubscribeFromMobx$))
              .subscribe(isValid => {
                this.isGeometryValid = isValid;
              });

          fromMobx(() => this.editGeometryStore.isChanged)
              .pipe(takeUntil(this.unsubscribe$))
              .pipe(takeUntil(this.unsubscribeFromMobx$))
              .subscribe(isChanged => {
                this.isGeometryChanged = isChanged;
              });
        });
    }

    const dataChanged = changes.data;
    if (dataChanged) {
      this.editFeatureData = [];
      const currentData: EditFeatureData = dataChanged.currentValue;

      if (currentData.mode === EditFeatureMode.single) {
        if (!this.data.isNew) {
          openLayersService.highlightFeature(currentData.features[0]);
        }
        this.isGeometryChanged = false;
      }

      this.featureDescription = dataSchemaService.getFeatureSchemaByName(currentData.features[0].id.split('.')[0]);
      this.editFeatureForm = this.formBuilder.group({});

      Object.keys(currentData.features[0].properties)
            .filter(key => key !== 'bbox')
            .forEach(key => {
              const currentValue = currentData.features[0].properties[key];

              let property: PropertySchema;
              if (this.featureDescription) {
                property = dataSchemaService.getPropertySchemaByName(key, this.featureDescription.properties);
              }

              if (property) {
                this.editFeatureData.push({
                  name: key,
                  property: property,
                  value: currentValue,
                  isFgistpProperty: true
                });

                const formControl = new FormControl(
                  {
                    value: currentValue,
                    disabled: property.name === 'GLOBALID'
                  },
                  {
                    validators: [
                      FeaturePropertyValidators.validate(property),
                    ],
                    // updateOn: 'blur'
                  }
                );

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

      this.data = currentData;

      setTimeout(() => {
        this.validateCustomRules(currentData.features[0].properties);
      }, 22);
    }
  }

  async editFeature () {
    if (this.editFeatureForm.pristine && !this.isGeometryChanged || !this.isGeometryValid) {
      return;
    }

    this.isSaveInProgress = true;

    const newProperties = this.getActualValuesFromForm();

    if (this.data.isNew) {
      this.transformFeatureService.insertFeatures(
          [{ ...this.data.features[0], properties: newProperties, geometry: this.changedGeometry }],
          currentProject.internalName,
          this.featureDescription.tableName
      ).subscribe(() => {
        this.close();
      });
    } else {
      this.batchUpdateFeatures(
            this.data.features,
            newProperties,
            this.isGeometryChanged ? this.changedGeometry : undefined);
    }
  }

  async deleteFeature () {
    const data: ConfirmDialogData = {
      title: 'Удалить объект?',
      approveBtnName: 'Удалить'
    };
    const { features } = this.data;
    const [layerName, newId] = features[0].id.split('.');
    const { internalName } = currentProject;

    this.dialog
        .open(ConfirmDialogComponent, { width: '400px', data: data })
        .afterClosed().pipe(filter(value => !!value))
        .subscribe(() => {
          this.transformFeatureService.deleteFeatures(
            [newId],
            internalName,
            layerName
          ).subscribe(() => {
            this.delete.emit(features[0].id);
            this.close();
            openLayersService.refreshLayers();
          });
        });
  }

  getTooltip() {
    const featuresCount = this.data.total;
    if (featuresCount) {
      return 'Сохранить данные для ' + this.data.total + ' объектов';
    } else {
      return 'Сохранить объект';
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

    openLayersService.clearDraft();

    if (this.data.isNew) {
      sideBarManager.do({
        target: SidebarType.FEATURES,
        action: ActionType.CLOSE
      });
    }
  }

  getEnumerationTitle (enumerations: ValueTitleProjection[], value: string | number): string {
    const item = enumerations.find(item => String(item.value) === String(value));
    return item && item.title;
  }

  private async batchUpdateFeatures(features: WfsFeature[], newProperties: Properties, geometry?: WfsGeometry) {
    const { internalName } = currentProject;

    const batchModel = new BatchModel(features);
    let percent = 0;

    for (let i = 0; i < batchModel.totalBatches; i++) {
      await this.transformFeatureService.updateFeatures(
                                            batchModel.batches[i],
                                            internalName,
                                            this.featureDescription,
                                            newProperties,
                                            geometry);
      percent = Math.ceil(batchModel.percentOfOneBatch * i);
      this.loadPercent = percent > 100 ? 100 : percent;
    }

    this.loadPercent = percent > 100 ? 100 : percent;
    this.isSaveInProgress = false;
    this.closeMe.emit(true);
    openLayersService.refreshLayers();
    openLayersService.clearDraft();

    Toast.success('Сохранено');

    communicationService.featuresUpdate$.emit({
      features: this.data.features,
      total: this.data.total,
      mode: EditFeatureMode.multipleEdit,
      properties: newProperties
    });
  }
}
