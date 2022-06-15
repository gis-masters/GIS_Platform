import moment from 'moment';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';
import { Coordinate } from 'ol/coordinate';
import { boundMethod } from 'autobind-decorator';
import { isNumber } from 'lodash';

import { ConfirmDialogComponent, ConfirmDialogData } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { EditFeatureMode, EditFeaturesData, MapSelectionTypes, sidebars } from '../../stores/Sidebars.store';
import { isFeaturesDeleteAllowed, isFeaturesUpdateAllowed } from '../../services/crg/permissions.service';
import { CoordinateEdited, WfsFeature, WfsGeometry } from '../../services/geoserver/wfs.models';
import { deleteDataTableRecord, updateDataTableRecord } from '../../services/data.service';
import { FeaturePropertyValidators } from '../../services/util/FeaturePropertyValidators';
import { transformFeature } from '../../services/geoserver/transform-feature.service';
import { getFeatureProjection } from '../../services/geoserver/projections.service';
import { OldPropertySchema, ValueType } from '../../services/crg/schemaOld.models';
import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';
import { applyFieldValue, convertToComplexField } from '../Form/Form.utils';
import { communicationService } from '../../services/communication.service';
import { getFeatureLayer } from '../../services/geoserver/layers.service';
import { getFeaturesById } from '../../services/geoserver/wfs.service';
import { getEmptyGeometry } from '../../services/geoserver/wfs.util';
import { CrgVectorLayer } from '../../services/crg/projects.models';
import { PropertySchema } from '../../services/crg/schema.models';
import { schemaService } from '../../services/crg/schema.service';
import { generateRandomId } from '../../services/util/randomId';
import { convertProperties, convertSchema, getFieldRelations } from '../../services/crg/schema.utils';
import { mapService } from '../../services/map/map.service';
import { BatchModel } from '../../services/crg/batch-model';
import { formatDate } from '../../services/util/date.util';
import { fromMobx } from '../../services/util/fromMobx';
import { BaseEdit } from '../edit-bug-object/base-edit';
import { services } from '../../services/services';
import { sleep } from '../../services/util/sleep';
import { Toast } from '../Toast/Toast';

export interface Properties {
  [key: string]: unknown;
}

@Component({
  selector: 'crg-edit-feature',
  templateUrl: './edit-feature.component.html',
  styleUrls: ['./edit-feature.component.css']
})
export class EditFeatureComponent extends BaseEdit implements OnInit, OnDestroy {
  mode: EditFeatureMode;
  features: WfsFeature<Coordinate | CoordinateEdited>[];
  private viewFeatures?: WfsFeature[];
  layer: CrgVectorLayer;
  private properties?: Properties;
  isNew: boolean;
  selectTab: number;

  deletingAllowed = false;
  updatingAllowed = false;

  isSaveInProgress = false;
  loadPercent = 0;
  changedGeometry?: WfsGeometry<Coordinate>;
  isGeometryValid = false;
  isGeometryChanged = false;
  editGeometryStore = new EditFeatureGeometryStore();
  private unsubscribeFromMobx$: Subject<void> = new Subject<void>();
  private randomId = generateRandomId();

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
        this.selectTab = Number(data.isNew);
        if (!this.isNew) {
          mapService.highlightFeatures(this.features);
          this.isGeometryChanged = false;
        }

        this.editFeatureForm = this.formBuilder.group({});

        this.featureDescription = await schemaService.getOldSchema(this.layer.schemaId);

        this.editFeatureData = [];

        this.featureDescription.properties.forEach(({ name, valueType }) => {
          if (
            !Object.keys(this.features[0].properties).some(property => property.toLowerCase() === name.toLowerCase()) &&
            valueType !== ValueType.GEOMETRY
          ) {
            this.features[0].properties[name] = null;
          }
        });

        Object.keys(this.features[0].properties)
          .filter(key => key !== 'bbox')
          .forEach(key => {
            let currentValue = this.getFieldByKey(key)
              ? convertToComplexField(this.getFieldByKey(key), this.features[0].properties)
              : this.features[0].properties[key];

            let property: OldPropertySchema;
            if (this.featureDescription) {
              property = schemaService.getPropertySchemaByName(key, this.featureDescription.properties);
            }

            if (
              property?.valueType === ValueType.DOUBLE &&
              currentValue &&
              isNumber(property.fractionDigits) &&
              property.fractionDigits !== -1
            ) {
              currentValue = Number(currentValue).toFixed(property.fractionDigits);
            }

            if (property?.valueType === ValueType.DATETIME && currentValue) {
              currentValue = moment(currentValue).format('YYYY-MM-DD');
            }

            if (property) {
              this.editFeatureData.push({
                name: key,
                property,
                value: String(currentValue),
                isFgistpProperty: true,
                relations: getFieldRelations(key, convertSchema(this.featureDescription))
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
              // TODO: надо бы запрашивать DescribeFeatureType по WFS и брать тип лишних атрибутов там.
              this.editFeatureData.push({
                name: key,
                property: {
                  name: key,
                  title: key,
                  valueType: ValueType.STRING
                },
                value: String(currentValue),
                isFgistpProperty: false,
                relations: getFieldRelations(key, convertSchema(this.featureDescription))
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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

                  const feature = {
                    ...this.features[0],
                    geometry: changedGeometry
                  };

                  mapService.highlightFeatures([feature]);
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

        this.editFeatureForm.valueChanges.subscribe((featureProperties: Record<string, unknown>) => {
          this.validateCustomRules(featureProperties);

          sidebars.setFeaturesEdited(!this.editFeatureForm.pristine);
        });
      });
  }

  async editFeature(): Promise<void> {
    if (this.isNew && !this.isGeometryValid) {
      this.selectTab = Number(!this.isGeometryValid);

      return;
    }

    if (this.editFeatureForm.pristine && (!this.isGeometryChanged || !this.isGeometryValid)) {
      return;
    }

    this.isSaveInProgress = true;

    let newProperties = this.getActualValuesFromForm();

    for (const key of Object.keys(newProperties)) {
      const field = this.getFieldByKey(key as string);
      if (field) {
        const { [key]: value, ...rests } = newProperties;
        newProperties = applyFieldValue(field, rests, value) as Record<string, string>;
      }
    }

    let ids = this.features.map(({ id }) => id);

    if (this.isNew) {
      ids = await transformFeature.insertFeatures(
        [{ ...this.features[0], properties: newProperties, geometry: this.changedGeometry }],
        this.layer
      );

      mapService.refreshLayers();
      communicationService.featuresUpdated.emit();
    } else {
      let geometry: WfsGeometry<Coordinate>;

      if (this.features.length === 1) {
        geometry = this.features[0].geometry as WfsGeometry<Coordinate>;
      }

      if (this.isGeometryChanged) {
        geometry = this.changedGeometry;
      }

      await this.batchUpdateFeatures(this.layer.tableName, this.features, newProperties, geometry);
    }

    sidebars.setFeaturesEdited(false);

    const savedFeatures = await getFeaturesById(ids, this.layer.complexName);

    sidebars.closeEdit();

    await sleep(0);
    sidebars.openEdit({
      mode: this.mode,
      features: savedFeatures,
      layer: this.layer,
      properties: this.properties,
      isNew: false
    });
  }

  private getFieldByKey(key: string): PropertySchema {
    const fields = convertProperties(this.featureDescription.properties);

    return fields.find(({ name }) => name === key);
  }

  deleteFeature(): void {
    const data: ConfirmDialogData = {
      title: 'Удалить объект?',
      approveBtnName: 'Удалить'
    };
    const { dataset, tableName } = this.layer;

    this.dialog
      .open(ConfirmDialogComponent, { width: '400px', data })
      .afterClosed()
      .pipe(filter(value => !!value))
      .subscribe(async () => {
        if (sidebars.editFeaturesData.mode === EditFeatureMode.multipleEdit) {
          for (const layer of this.features) {
            const featureLayer = getFeatureLayer(layer);

            await deleteDataTableRecord(featureLayer.dataset, featureLayer.tableName, layer.id);
          }
        } else {
          await deleteDataTableRecord(dataset, tableName, this.features[0].id);
        }

        mapService.refreshLayers();
        communicationService.featuresUpdated.emit();
        sidebars.setFeaturesEdited(false);
        if (this.viewFeatures) {
          sidebars.openFeatures(this.viewFeatures, MapSelectionTypes.REPLACE);
        } else {
          sidebars.closeEdit();
        }
      });
  }

  getTooltip(): string {
    const count = this.features.length;

    return count ? `Сохранить данные для ${count} объектов` : 'Сохранить объект';
  }

  switchControl(property: OldPropertySchema): void {
    if (this.editFeatureForm.controls[property.name.toLowerCase()].disabled) {
      // formControl.setValue('Оставить как есть');
      this.editFeatureForm.controls[property.name.toLowerCase()].enable();
    } else {
      this.editFeatureForm.controls[property.name.toLowerCase()].disable();
    }
  }

  isShowTemplate(property: OldPropertySchema): boolean {
    return this.editFeatureForm.controls[property.name.toLowerCase()].disabled;
  }

  @boundMethod
  async close(): Promise<void> {
    if (sidebars.memorizedViewFeatures) {
      sidebars.openFeatures(sidebars.memorizedViewFeatures, MapSelectionTypes.REPLACE);
    } else {
      await services.provided;
      await services.router.navigate([location.pathname], {
        queryParams: { features: null, queryFilter: null, queryLayers: null },
        queryParamsHandling: 'merge'
      });
      sidebars.closeEdit();
    }
  }

  getEnumerationTitle(enumerations: { value: string; title: string }[], value: string | number): string {
    const item = enumerations.find(i => String(i.value) === String(value));

    return item && item.title;
  }

  getDateTime(value: string | number): string {
    return formatDate(value);
  }

  private async checkPermissions() {
    const { dataset, tableName, schemaId } = this.layer;

    this.updatingAllowed = await isFeaturesUpdateAllowed(dataset, tableName, schemaId);
    this.deletingAllowed = await isFeaturesDeleteAllowed(dataset, tableName, schemaId);
  }

  private async batchUpdateFeatures(
    layerName: string,
    features: WfsFeature<Coordinate | CoordinateEdited>[],
    newProperties: Properties,
    geometry?: WfsGeometry<Coordinate>
  ) {
    const batchModel = new BatchModel(features);
    let percent = 0;

    if (features.length === 1) {
      const { dataset, tableName } = this.layer;

      await updateDataTableRecord(dataset, tableName, features[0].id.split('.')[1], {
        type: 'Feature',
        geometry: geometry,
        properties: newProperties
      });

      return;
    }

    for (let i = 0; i < batchModel.totalBatches; i++) {
      await transformFeature.updateFeatures(
        layerName,
        batchModel.batches[i],
        this.featureDescription,
        newProperties,
        geometry
      );
      percent = Math.ceil(batchModel.percentOfOneBatch * i);
      this.loadPercent = percent > 100 ? 100 : percent;
    }

    this.loadPercent = percent > 100 ? 100 : percent;
    this.isSaveInProgress = false;
    mapService.refreshLayers();
    mapService.clearDraft();

    Toast.success('Сохранено');

    communicationService.featuresUpdated.emit();
  }
}
