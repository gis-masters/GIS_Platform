import moment from 'moment';
import { Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { boundMethod } from 'autobind-decorator';
import { Coordinate } from 'ol/coordinate';
import { cloneDeep, isNumber } from 'lodash';

import { MapSelectionTypes, mapStore } from '../../stores/Map.store';
import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';
import { EditFeatureMode, EditFeaturesData, sidebars } from '../../stores/Sidebars.store';
import { isUpdateAllowed } from '../../services/data/permissions.service';
import {
  applyView,
  applyViewOld,
  changeSchemaNamesCaseByFeature,
  convertOldToNewProperties,
  convertOldToNewSchema,
  getFieldRelations
} from '../../services/data/schema.utils';
import { ConfirmDialogComponent, ConfirmDialogData } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { CoordinateEdited, WfsFeature, WfsGeometry } from '../../services/geoserver/wfs.models';
import { deleteFeatures, updateVectorTableRecord } from '../../services/data/data.service';
import { FeaturePropertyValidators } from '../../services/util/FeaturePropertyValidators';
import { getLayerByFeatureInCurrentProject } from '../../services/gis/layers.service';
import { transformFeature } from '../../services/geoserver/transform-feature.service';
import { getFeatureProjection } from '../../services/geoserver/projections.service';
import { OldPropertySchema, ValueType } from '../../services/data/schemaOld.models';
import { PropertySchema, PropertyType } from '../../services/data/schema.models';
import { mapSelectionService } from '../../services/map/map-selection.service';
import { applyFieldValue, convertToComplexField } from '../Form/Form.utils';
import { communicationService } from '../../services/communication.service';
import { calculateValues } from '../../services/formValidation.service';
import { getFeaturesById } from '../../services/geoserver/wfs.service';
import { getEmptyGeometry } from '../../services/geoserver/wfs.util';
import { CrgVectorLayer } from '../../services/gis/projects.models';
import { schemaService } from '../../services/data/schema.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { generateRandomId } from '../../services/util/randomId';
import { mapService } from '../../services/map/map.service';
import { formatDate } from '../../services/util/date.util';
import { BaseEdit } from '../edit-bug-object/base-edit';
import { fromMobx } from '../../services/util/fromMobx';
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

  updatingAllowed = false;

  isSaveInProgress = false;
  changedGeometry?: WfsGeometry<Coordinate>;
  isGeometryValid = false;
  isGeometryChanged = false;
  editGeometryStore = new EditFeatureGeometryStore();
  private unsubscribeFromMobx$: Subject<void> = new Subject<void>();
  private randomId = generateRandomId();

  constructor(private formBuilder: UntypedFormBuilder, private dialog: MatDialog) {
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
        this.layer = { ...(data.layer || getLayerByFeatureInCurrentProject(this.features[0])) };
        this.properties = data.properties;
        this.isNew = data.isNew;
        this.selectTab = Number(data.isNew);
        if (!this.isNew) {
          mapService.highlightFeatures(this.features);
          this.isGeometryChanged = false;
        }

        this.editFeatureForm = this.formBuilder.group({});

        this.featureDescription = applyViewOld(
          changeSchemaNamesCaseByFeature(await schemaService.getOldSchema(this.layer.schemaId), this.features[0]),
          this.layer.view
        );

        const schema = changeSchemaNamesCaseByFeature(
          await schemaService.getSchema(this.layer.schemaId),
          this.features[0]
        );
        const newSchema = applyView(schema, this.layer.view);

        this.features = this.features.map(feature => ({
          ...feature,
          properties: feature.properties && calculateValues(feature.properties, newSchema.properties)
        }));

        this.editFeatureData = [];

        this.featureDescription.properties.forEach(({ name, valueType }) => {
          if (!Object.keys(this.features[0].properties).includes(name) && valueType !== ValueType.GEOMETRY) {
            this.features[0].properties[name] = null;
          }
        });

        Object.keys(this.features[0].properties)
          .filter(
            key =>
              (key !== 'bbox' && newSchema.properties.some(item => key === item.name)) ||
              (key !== 'bbox' &&
                !newSchema.properties.some(item => key === item.name) &&
                !schema.properties.some(item => key === item.name))
          )
          .sort((a, b) => {
            let indexA = newSchema.properties.findIndex(({ name }) => name === a);
            if (indexA === -1) {
              indexA = newSchema.properties.length;
            }
            let indexB = newSchema.properties.findIndex(({ name }) => name === b);
            if (indexB === -1) {
              indexB = newSchema.properties.length;
            }

            return indexA - indexB;
          })
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

            if ((property?.valueType === ValueType.STRING || property?.valueType === ValueType.TEXT) && currentValue) {
              currentValue = String(currentValue).trim();
            }

            if (property) {
              this.editFeatureData.push({
                name: key,
                property,
                value: currentValue === null ? null : String(currentValue),
                isFgistpProperty: true,
                relations: getFieldRelations(key, convertOldToNewSchema(this.featureDescription))
              });

              const formControl = new UntypedFormControl(
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
              this.editFeatureData.push({
                name: key,
                property: {
                  name: key,
                  title: key,
                  valueType: ValueType.STRING
                },
                value: currentValue === null ? null : String(currentValue),
                isFgistpProperty: false,
                relations: getFieldRelations(key, convertOldToNewSchema(this.featureDescription))
              });

              const formControl = new UntypedFormControl(currentValue);

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
        this.updatingAllowed = await isUpdateAllowed(this.layer);

        if (this.updatingAllowed && this.mode === EditFeatureMode.single && !this.features[0].geometry) {
          this.features[0].geometry = getEmptyGeometry(this.featureDescription.geometryType);
        }
        this.editGeometryStore.initGeometry(this.features[0].geometry, getFeatureProjection(this.features[0]));

        if (this.updatingAllowed) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          fromMobx(() => this.editGeometryStore.geometry?.coordinates?.flat(5), false)
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

    fromMobx<CrgVectorLayer[]>(() => cloneDeep(currentProject.vectorLayers))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async layers => {
        const currentLayer = layers.find(item => item.id === this.layer.id);
        if (!currentLayer) {
          sidebars.closeEdit();

          return;
        }

        if (currentLayer.view !== this.layer?.view) {
          sidebars.closeEdit();

          await sleep(0);

          sidebars.openEdit({
            mode: this.mode,
            features: this.features as WfsFeature<Coordinate>[],
            layer: currentLayer,
            properties: this.properties,
            isNew: this.isNew
          });
        }
      });
  }

  ngOnDestroy() {
    mapService.highlightFeatures(mapStore.highlightedFeatures);
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
        let val = value;
        if (field.propertyType === PropertyType.STRING) {
          val = value.trim();
        }
        newProperties = applyFieldValue(field, rests, val) as Record<string, string>;
      }
    }

    let ids = this.features.map(({ id }) => id);

    if (this.isNew) {
      ids = await transformFeature.insertFeatures(
        [{ ...this.features[0], properties: newProperties, geometry: this.changedGeometry }],
        this.layer
      );
    } else {
      let geometry: WfsGeometry<Coordinate>;

      if (this.features.length === 1 && this.isGeometryChanged) {
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
    this.isSaveInProgress = false;

    sidebars.openEdit({
      mode: this.mode,
      features: savedFeatures,
      layer: this.layer,
      properties: this.properties,
      isNew: false
    });

    mapService.refreshAllLayers();
    communicationService.featuresUpdated.emit();
  }

  private getFieldByKey(key: string): PropertySchema {
    const fields = convertOldToNewProperties(this.featureDescription.properties);

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
          for (const feature of this.features) {
            const featureLayer = getLayerByFeatureInCurrentProject(feature);

            await deleteFeatures(featureLayer.dataset, featureLayer.tableName, [feature]);
          }
        } else {
          await deleteFeatures(dataset, tableName, [this.features[0]]);
        }

        mapService.refreshAllLayers();
        communicationService.featuresUpdated.emit();
        sidebars.setFeaturesEdited(false);
        if (this.viewFeatures) {
          mapSelectionService.selectFeatures(this.viewFeatures, MapSelectionTypes.REPLACE);
          sidebars.openFeaturesSidebar();
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
    if (this.editFeatureForm.controls[property.name].disabled) {
      this.editFeatureForm.controls[property.name].enable();
    } else {
      this.editFeatureForm.controls[property.name].disable();
    }
  }

  isShowTemplate(property: OldPropertySchema): boolean {
    const control = this.editFeatureForm.controls[property.name];

    return control ? control.disabled : false;
  }

  @boundMethod
  async close(): Promise<void> {
    if (sidebars.memorizedViewFeatures) {
      mapSelectionService.selectFeatures(sidebars.memorizedViewFeatures, MapSelectionTypes.REPLACE);
      sidebars.openFeaturesSidebar();
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

  private async batchUpdateFeatures(
    layerName: string,
    features: WfsFeature<Coordinate | CoordinateEdited>[],
    newProperties: Properties,
    geometry?: WfsGeometry<Coordinate>
  ) {
    const { dataset, tableName } = this.layer;

    if (features.length === 1) {
      await updateVectorTableRecord(dataset, tableName, features[0].id.split('.')[1], {
        type: 'Feature',
        geometry: geometry,
        properties: newProperties
      });

      communicationService.featuresUpdated.emit();

      return;
    }

    const featuresId: string = features.map(feature => feature.id.split('.')[1]).join(',');

    await transformFeature.multipleEdit(dataset, tableName, featuresId, newProperties);

    this.isSaveInProgress = false;
    mapService.refreshAllLayers();
    mapService.clearDraft();

    Toast.success('Сохранено');

    communicationService.featuresUpdated.emit();
  }

  isReadOnly(property: OldPropertySchema): boolean {
    if (this.updatingAllowed) {
      return !property.readOnly;
    }

    return this.updatingAllowed;
  }
}
