import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';
import { Coordinate } from 'ol/coordinate';
import { boundMethod } from 'autobind-decorator';

import { ConfirmDialogComponent, ConfirmDialogData } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { communicationService } from '../../services/communication.service';
import { openLayersService } from '../../services/open-layer/open-layers.service';
import { sidebars } from '../../stores/Sidebars.store';
import { schemaService, PropertySchema } from '../../services/crg/schema.service';
import { FeaturePropertyValidators, ValueType } from '../../services/util/FeaturePropertyValidators';
import { BaseEdit } from '../edit-bug-object/base-edit';
import { BatchModel } from '../../services/crg/batch-model';
import { WfsFeature, WfsGeometry } from '../../services/geoserver/wfs-models';
import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';
import { fromMobx } from '../../services/util/fromMobx';
import { getFeatureProjection } from '../../services/geoserver/projections.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { CrgLayer } from '../../services/crg/projects.models';
import { isDeleteAllowed, isUpdateAllowed } from '../../services/crg/permissions.service';
import { transformFeature } from '../../services/geoserver/transform-feature.service';
import { Toast } from '../Toast/Toast';

export interface EditFeatureData {
  layer: CrgLayer;
  features: WfsFeature[];
  mode: EditFeatureMode;
  total?: number;
  properties?: { [key: string]: any };
  isNew?: true;
}

interface Properties {
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
export class EditFeatureComponent extends BaseEdit implements OnChanges, OnInit, OnDestroy {
  @Input() data: EditFeatureData;
  @Output() closeMe = new EventEmitter<boolean>();
  @Output() delete = new EventEmitter<string>();
  deletingAllowed = false;
  updatingAllowed = false;

  isAttributeSidebarOpened = false;
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
    fromMobx<boolean>(() => sidebars.attributesOpen)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(attributesOpen => (this.isAttributeSidebarOpened = attributesOpen));

    this.editFeatureForm.valueChanges.subscribe(featureProperties => {
      this.validateCustomRules(featureProperties);

      sidebars.setFeaturesEdited(!this.editFeatureForm.pristine);
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
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

      this.editFeatureForm = this.formBuilder.group({});
      this.featureDescription = await schemaService.getSchemaByLayerName(currentData.features[0].id.split('.')[0]);

      currentData.layer = currentProject.vectorLayers.find(layer => layer.schemaId === this.featureDescription.name);

      Object.keys(currentData.features[0].properties)
        .filter(key => key !== 'bbox')
        .forEach(key => {
          const currentValue = currentData.features[0].properties[key];

          let property: PropertySchema;
          if (this.featureDescription) {
            property = schemaService.getPropertySchemaByName(key, this.featureDescription.properties);
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
                validators: [FeaturePropertyValidators.validate(property)]
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
                valueType: ValueType.STRING
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

    this.unsubscribeFromMobx$.next();
    delete this.changedGeometry;
    this.isGeometryValid = false;
    this.isGeometryChanged = false;
    await this.checkPermissions();

    this.editGeometryStore.initGeometry(this.data.features[0].geometry, getFeatureProjection(this.data.features[0]));

    if (this.updatingAllowed) {
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
              sidebars.setFeaturesEdited(!this.editFeatureForm.pristine || isChanged);
            });
        });
    }
  }

  async editFeature() {
    if (this.editFeatureForm.pristine && (!this.isGeometryChanged || !this.isGeometryValid)) {
      return;
    }

    this.isSaveInProgress = true;

    const newProperties = this.getActualValuesFromForm();

    if (this.data.isNew) {
      transformFeature
        .insertFeatures(
          [{ ...this.data.features[0], properties: newProperties, geometry: this.changedGeometry }],
          this.featureDescription.tableName,
          this.data.layer.nativeCRS
        )
        .then(() => {
          this.close();
          openLayersService.refreshLayers();
          communicationService.featuresUpdated.emit();
        });
    } else {
      this.batchUpdateFeatures(
        this.data.features,
        newProperties,
        this.isGeometryChanged ? this.changedGeometry : undefined
      );
    }
  }

  async deleteFeature() {
    const data: ConfirmDialogData = {
      title: 'Удалить объект?',
      approveBtnName: 'Удалить'
    };
    const { features } = this.data;
    const [layerName, newId] = features[0].id.split('.');

    this.dialog
      .open(ConfirmDialogComponent, { width: '400px', data: data })
      .afterClosed()
      .pipe(filter(value => !!value))
      .subscribe(() => {
        transformFeature.deleteFeatures([newId], layerName).then(() => {
          this.delete.emit(features[0].id);
          this.close();
          openLayersService.refreshLayers();
          communicationService.featuresUpdated.emit();
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

  @boundMethod
  close() {
    if (!sidebars.needEditFeatureConfirmation(this.close)) {
      this.closeMe.emit(true);

      openLayersService.clearDraft();

      if (this.data.isNew) {
        sidebars.closeFeatures();
      }
    }
  }

  getEnumerationTitle(enumerations: { value: string; title: string }[], value: string | number): string {
    const item = enumerations.find(i => String(i.value) === String(value));
    return item && item.title;
  }

  private async checkPermissions() {
    this.updatingAllowed = await isUpdateAllowed(this.data.layer);
    this.deletingAllowed = await isDeleteAllowed(this.data.layer);
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
    this.closeMe.emit(true);
    openLayersService.refreshLayers();
    openLayersService.clearDraft();

    Toast.success('Сохранено');

    communicationService.featuresUpdated.emit();
  }
}
