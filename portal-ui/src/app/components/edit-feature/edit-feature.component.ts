import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';
import { Coordinate } from 'ol/coordinate';
import { boundMethod } from 'autobind-decorator';

import { Toast } from '../Toast/Toast';
import { fromMobx } from '../../services/util/fromMobx';
import { BatchModel } from '../../services/crg/batch-model';
import { EditFeaturesData, sidebars } from '../../stores/Sidebars.store';
import { communicationService } from '../../services/communication.service';
import { WfsFeature, WfsGeometry } from '../../services/geoserver/wfs-models';
import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';
import { openLayersService } from '../../services/open-layer/open-layers.service';
import { schemaService, PropertySchema } from '../../services/crg/schema.service';
import { getFeatureProjection } from '../../services/geoserver/projections.service';
import { transformFeature } from '../../services/geoserver/transform-feature.service';
import { isDeleteAllowed, isUpdateAllowed } from '../../services/crg/permissions.service';
import { FeaturePropertyValidators, ValueType } from '../../services/util/FeaturePropertyValidators';
import { ConfirmDialogComponent, ConfirmDialogData } from '../dialogs/confirm-dialog/confirm-dialog.component';

import { BaseEdit } from '../edit-bug-object/base-edit';
import { CrgLayer } from '../../services/crg/projects.models';
import { getFeatureLayer } from '../../services/geoserver/layers.service';
import { getEmptyGeometry } from '../../services/geoserver/wfs.service';

export interface Properties {
  [key: string]: any;
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
export class EditFeatureComponent extends BaseEdit implements OnInit, OnDestroy {
  mode: EditFeatureMode;
  features: WfsFeature[];
  private viewFeatures?: WfsFeature[];
  layer: CrgLayer;
  private properties?: Properties;
  isNew: boolean;

  deletingAllowed = false;
  updatingAllowed = false;

  isSaveInProgress = false;
  loadPercent = 0;
  changedGeometry?: WfsGeometry<Coordinate>;
  isGeometryValid = false;
  isGeometryChanged = false;
  editGeometryStore = new EditFeatureGeometryStore();
  private unsubscribeFromMobx$: Subject<void> = new Subject<void>();

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    fromMobx<EditFeaturesData>(() => sidebars.editFeaturesData, true)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async data => {
        if (!data || !data.features) {
          return;
        }

        this.editFeatureForm = this.formBuilder.group({});

        this.mode = data.mode;
        this.features = data.features;
        this.layer = data.layer || getFeatureLayer(this.features[0]);
        this.properties = data.properties;
        this.isNew = data.isNew;

        if (!this.isNew) {
          openLayersService.highlightFeatures(this.features);
          this.isGeometryChanged = false;
        }

        this.editFeatureForm = this.formBuilder.group({});

        this.featureDescription = await schemaService.getSchema(this.layer.schemaId);

        this.editFeatureData = [];
        Object.keys(this.features[0].properties)
          .filter(key => key !== 'bbox')
          .forEach(key => {
            const currentValue = this.features[0].properties[key];

            let property: PropertySchema;
            if (this.featureDescription) {
              property = schemaService.getPropertySchemaByName(key, this.featureDescription.properties);
            }

            if (property) {
              this.editFeatureData.push({
                name: key,
                property,
                value: currentValue,
                isFgistpProperty: true
              });

              const formControl = new FormControl(
                {
                  value: currentValue,
                  disabled: property.name === 'GLOBALID'
                },
                {
                  validators: [FeaturePropertyValidators.validate(property)]
                }
              );

              if (this.mode === EditFeatureMode.multipleEdit) {
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
                  valueType: ValueType.STRING
                },
                value: currentValue,
                isFgistpProperty: false
              });

              const formControl = new FormControl(currentValue);

              if (this.mode === EditFeatureMode.multipleEdit) {
                formControl.disable();
              }

              this.editFeatureForm.addControl(key, formControl);
            }
          });

        setTimeout(() => {
          this.validateCustomRules(this.features[0].properties);
        }, 22);

        this.unsubscribeFromMobx$.next();
        delete this.changedGeometry;
        this.isGeometryValid = false;
        this.isGeometryChanged = false;
        await this.checkPermissions();

        if (this.updatingAllowed && this.mode === EditFeatureMode.single && !this.features[0].geometry) {
          this.features[0].geometry = getEmptyGeometry(this.featureDescription.geometryType);
        }
        this.editGeometryStore.initGeometry(this.features[0].geometry, getFeatureProjection(this.features[0]));

        if (this.updatingAllowed) {
          fromMobx(() => this.editGeometryStore.geometry?.coordinates.flat(5), false)
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
                      ...this.features[0],
                      geometry: changedGeometry
                    };
                    openLayersService.highlightFeatures([feature]);
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
                  sidebars.setFeaturesEdited(!this.editFeatureForm.pristine || isChanged);
                });
            });
        }

        this.editFeatureForm.valueChanges.subscribe(featureProperties => {
          this.validateCustomRules(featureProperties);

          sidebars.setFeaturesEdited(!this.editFeatureForm.pristine);
        });
      });
  }

  async editFeature() {
    if (this.editFeatureForm.pristine && (!this.isGeometryChanged || !this.isGeometryValid)) {
      return;
    }

    this.isSaveInProgress = true;

    const newProperties = this.getActualValuesFromForm();

    if (this.isNew) {
      await transformFeature.insertFeatures(
        [{ ...this.features[0], properties: newProperties, geometry: this.changedGeometry }],
        this.featureDescription.tableName,
        this.layer.nativeCRS
      );

      openLayersService.refreshLayers();
      communicationService.featuresUpdated.emit();
    } else {
      await this.batchUpdateFeatures(
        this.features,
        newProperties,
        this.isGeometryChanged ? this.changedGeometry : undefined
      );
    }

    sidebars.setFeaturesEdited(false);
    sidebars.closeEdit();
  }

  async deleteFeature() {
    const data: ConfirmDialogData = {
      title: 'Удалить объект?',
      approveBtnName: 'Удалить'
    };
    const [layerName, newId] = this.features[0].id.split('.');

    this.dialog
      .open(ConfirmDialogComponent, { width: '400px', data })
      .afterClosed()
      .pipe(filter(value => !!value))
      .subscribe(() => {
        transformFeature.deleteFeatures([newId], layerName).then(() => {
          openLayersService.refreshLayers();
          communicationService.featuresUpdated.emit();
          sidebars.setFeaturesEdited(false);
          if (this.viewFeatures) {
            sidebars.openFeatures(this.viewFeatures);
          } else {
            sidebars.closeEdit();
          }
        });
      });
  }

  getTooltip() {
    const featuresCount = this.features.length;
    if (featuresCount) {
      return `Сохранить данные для ${featuresCount} объектов`;
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

  @boundMethod
  close() {
    if (sidebars.editFeaturesData.viewFeatures) {
      sidebars.openFeatures(sidebars.editFeaturesData.viewFeatures);
    } else {
      sidebars.closeEdit();
    }
  }

  getEnumerationTitle(enumerations: { value: string; title: string }[], value: string | number): string {
    const item = enumerations.find(i => String(i.value) === String(value));
    return item && item.title;
  }

  private async checkPermissions() {
    this.updatingAllowed = await isUpdateAllowed(this.layer);
    this.deletingAllowed = await isDeleteAllowed(this.layer);
  }

  private async batchUpdateFeatures(
    features: WfsFeature[],
    newProperties: Properties,
    geometry?: WfsGeometry<Coordinate>
  ) {
    const batchModel = new BatchModel(features);
    let percent = 0;

    for (let i = 0; i < batchModel.totalBatches; i++) {
      await transformFeature.updateFeatures(batchModel.batches[i], this.featureDescription, newProperties, geometry);
      percent = Math.ceil(batchModel.percentOfOneBatch * i);
      this.loadPercent = percent > 100 ? 100 : percent;
    }

    this.loadPercent = percent > 100 ? 100 : percent;
    this.isSaveInProgress = false;
    openLayersService.refreshLayers();
    openLayersService.clearDraft();

    Toast.success('Сохранено');

    communicationService.featuresUpdated.emit();
  }
}
