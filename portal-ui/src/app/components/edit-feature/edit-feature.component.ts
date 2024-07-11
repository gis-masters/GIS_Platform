import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep, isNumber } from 'lodash';
import { Coordinate } from 'ol/coordinate';
import { Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';

import { communicationService } from '../../services/communication.service';
import { isUpdateAllowed } from '../../services/data/permissions/permissions.service';
import { getFeatureProjection } from '../../services/data/projections/projections.service';
import { PropertySchema, PropertyType } from '../../services/data/schema/schema.models';
import { schemaService } from '../../services/data/schema/schema.service';
import {
  applyView,
  applyViewOld,
  changeSchemaNamesCaseByFeature,
  convertNewToOldSchema,
  convertOldToNewProperties,
  convertOldToNewSchema,
  getFieldRelations
} from '../../services/data/schema/schema.utils';
import { OldPropertySchema, ValueType } from '../../services/data/schema/schemaOld.models';
import { deleteFeatures, updateFeature } from '../../services/data/vectorData/vectorData.service';
import { extractFeatureId } from '../../services/geoserver/featureType/featureType.util';
import { transformFeature } from '../../services/geoserver/transform-feature.service';
import { CoordinateEdited, WfsFeature, WfsGeometry } from '../../services/geoserver/wfs/wfs.models';
import { getFeaturesById } from '../../services/geoserver/wfs/wfs.service';
import { getEmptyGeometry } from '../../services/geoserver/wfs/wfs.util';
import { CrgVectorableLayer, CrgVectorLayer, isVectorLayer } from '../../services/gis/layers/layers.models';
import { getLayerSchema } from '../../services/gis/layers/layers.service';
import { getLayerByFeatureInCurrentProject } from '../../services/gis/layers/layers.utils';
import { MapSelectionTypes } from '../../services/map/map.models';
import { mapService } from '../../services/map/map.service';
import { mapSelectionService } from '../../services/map/map-selection.service';
import { services } from '../../services/services';
import { formatDate, systemFormat } from '../../services/util/date.util';
import { FeaturePropertyValidators } from '../../services/util/FeaturePropertyValidators';
import { calculateValues } from '../../services/util/form/formValidation.utils';
import { fromMobx } from '../../services/util/fromMobx';
import { sleep } from '../../services/util/sleep';
import { currentProject } from '../../stores/CurrentProject.store';
import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';
import { mapStore } from '../../stores/Map.store';
import { EditFeatureMode, EditFeaturesData, sidebars } from '../../stores/Sidebars.store';
import { ConfirmDialogComponent, ConfirmDialogData } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { BaseEdit } from '../edit-bug-object/base-edit';
import { applyFieldValue, convertToComplexField } from '../Form/Form.utils';
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
  mode?: EditFeatureMode;
  features?: WfsFeature<Coordinate | CoordinateEdited>[];
  private viewFeatures?: WfsFeature[];
  layer?: CrgVectorableLayer;
  private properties?: Properties;
  isNew?: boolean;
  selectedTab?: number;

  updatingAllowed = false;

  isSaveInProgress = false;
  changedGeometry?: WfsGeometry<Coordinate>;
  isGeometryValid = false;
  isGeometryChanged = false;
  editGeometryStore = new EditFeatureGeometryStore();
  private unsubscribeFromMobx$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    fromMobx<EditFeaturesData | undefined>(() => sidebars.editFeaturesData, true)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async data => {
        if (!data || !data.features) {
          return;
        }

        this.editFeatureForm = this.formBuilder.group({});
        this.mode = data.mode;
        this.features = data.features;
        const firstFeature = this.features[0];
        if (!firstFeature) {
          return;
        }
        this.layer = { ...(data.layer || getLayerByFeatureInCurrentProject(firstFeature)) };
        this.properties = data.properties;
        this.isNew = data.isNew;
        this.selectedTab = Number(data.isNew);
        if (!this.isNew) {
          await mapService.highlightFeatures(this.features);
          this.isGeometryChanged = false;
        }

        this.editFeatureForm = this.formBuilder.group({});

        const layerSchema = await getLayerSchema(this.layer);
        if (!layerSchema) {
          return;
        }
        const oldSchema = convertNewToOldSchema(layerSchema);
        const view = isVectorLayer(this.layer) ? this.layer.view : undefined;
        this.featureDescription = applyViewOld(changeSchemaNamesCaseByFeature(oldSchema, firstFeature), view);

        const propertiesWithAppliedView = applyView(layerSchema, view).properties;
        const propertiesWithChangedNames = changeSchemaNamesCaseByFeature(oldSchema, firstFeature).properties;

        this.features = this.features.map(feature => ({
          ...feature,
          properties: feature.properties && calculateValues(feature.properties, propertiesWithAppliedView)
        }));

        this.editFeatureData = [];

        const featureProperties = this.featureDescription.properties;
        featureProperties.forEach(({ name, valueType }) => {
          if (!Object.keys(firstFeature.properties).includes(name) && valueType !== ValueType.GEOMETRY) {
            firstFeature.properties[name] = null;
          }
        });
        const convertedProperties = convertOldToNewProperties(featureProperties);

        Object.keys(firstFeature.properties)
          .filter(key => this.keyMatchBySchemas(key, propertiesWithAppliedView, propertiesWithChangedNames))
          .sort((a, b) => {
            let indexA = propertiesWithAppliedView.findIndex(({ name }) => name.toLowerCase() === a.toLowerCase());
            if (indexA === -1) {
              indexA = propertiesWithAppliedView.length;
            }
            let indexB = propertiesWithAppliedView.findIndex(({ name }) => name.toLowerCase() === b.toLowerCase());
            if (indexB === -1) {
              indexB = propertiesWithAppliedView.length;
            }

            return indexA - indexB;
          })
          .forEach(key => {
            const propertyByKey = convertedProperties.find(({ name }) => name.toLowerCase() === key.toLowerCase());

            let currentProperty = propertyByKey
              ? convertToComplexField(propertyByKey, firstFeature.properties)
              : firstFeature.properties[key];

            let property: OldPropertySchema | undefined;
            if (this.featureDescription) {
              property = schemaService.getPropertySchemaByName(key, featureProperties);
            }

            if (
              property?.valueType === ValueType.DOUBLE &&
              currentProperty &&
              isNumber(property.fractionDigits) &&
              property.fractionDigits !== -1
            ) {
              currentProperty = Number(currentProperty).toFixed(property.fractionDigits);
            }

            if (property?.valueType === ValueType.DATETIME && currentProperty) {
              currentProperty =
                currentProperty instanceof Date ||
                typeof currentProperty === 'number' ||
                typeof currentProperty === 'string'
                  ? formatDate(currentProperty, systemFormat)
                  : '';
            }

            if (
              (property?.valueType === ValueType.STRING || property?.valueType === ValueType.TEXT) &&
              currentProperty
            ) {
              currentProperty = String(currentProperty).trim();
            }

            if (property) {
              this.editFeatureData.push({
                name: key,
                property,
                value: currentProperty === null ? null : String(currentProperty),
                isFgistpProperty: true,
                relations: getFieldRelations(key, convertOldToNewSchema(this.featureDescription))
              });

              const formControl = new UntypedFormControl(
                {
                  value: currentProperty,
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
                value: currentProperty === null ? null : String(currentProperty),
                isFgistpProperty: false,
                relations: getFieldRelations(key, convertOldToNewSchema(this.featureDescription))
              });

              const formControl = new UntypedFormControl(currentProperty);

              if (this.mode === EditFeatureMode.multipleEdit) {
                formControl.disable();
              }

              this.editFeatureForm?.addControl(key, formControl);
            }
          });

        setTimeout(() => {
          this.validateCustomRules(firstFeature.properties);
        }, 22);

        this.unsubscribeFromMobx$.next();
        delete this.changedGeometry;
        this.isGeometryValid = false;
        this.isGeometryChanged = false;
        this.updatingAllowed = !!this.layer && (await isUpdateAllowed(this.layer));

        if (this.updatingAllowed && this.mode === EditFeatureMode.single && !firstFeature.geometry) {
          firstFeature.geometry = getEmptyGeometry(this.featureDescription.geometryType);
        }

        const projection = await getFeatureProjection(firstFeature);

        if (firstFeature.geometry && projection) {
          this.editGeometryStore.initGeometry(firstFeature.geometry, projection);
        } else {
          Toast.error('Не удалось получить проекцию или геометрию объекта');
        }

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
                .subscribe(async changedGeometry => {
                  this.changedGeometry = changedGeometry;

                  const feature = {
                    ...firstFeature,
                    geometry: changedGeometry
                  };

                  await mapService.highlightFeatures([feature]);
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
                  sidebars.setFeaturesEdited(!this.editFeatureForm?.pristine || isChanged);
                });
            });
        }

        this.editFeatureForm.valueChanges.subscribe((featureProperties: Record<string, unknown>) => {
          this.validateCustomRules(featureProperties);

          sidebars.setFeaturesEdited(!this.editFeatureForm?.pristine);
        });
      });

    fromMobx<CrgVectorLayer[]>(() => cloneDeep(currentProject.vectorableLayers))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async layers => {
        const currentLayer = layers.find(item => item.id === this.layer?.id);
        if (!currentLayer) {
          sidebars.closeEdit();

          return;
        }

        const view = isVectorLayer(this.layer) ? this.layer.view : undefined;

        if (currentLayer.view !== view) {
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

  private keyMatchBySchemas(key: string, newProperties: PropertySchema[], oldProperties: OldPropertySchema[]) {
    const keyExistInNew = newProperties.some(item => key.toLowerCase() === item.name.toLowerCase());
    const keyExistInOld = oldProperties.some(item => key.toLowerCase() === item.name.toLowerCase());

    return keyExistInNew || (!keyExistInNew && !keyExistInOld);
  }

  async ngOnDestroy() {
    if (currentProject.visibleOnMapLayers.length) {
      await mapService.highlightFeatures(mapStore.highlightedFeatures);
    }
  }

  async editFeature(): Promise<void> {
    if (this.isNew && !this.isGeometryValid) {
      this.selectedTab = Number(!this.isGeometryValid);

      return;
    }

    if (this.editFeatureForm?.pristine && (!this.isGeometryChanged || !this.isGeometryValid)) {
      return;
    }

    if (!this.layer) {
      return;
    }

    this.isSaveInProgress = true;

    const featureProperties = convertOldToNewProperties(this.featureDescription?.properties || []);
    let actualProperties = this.getActualValuesFromForm();
    for (const key of Object.keys(actualProperties)) {
      const propertyByKey = featureProperties.find(({ name }) => name === key);
      if (propertyByKey) {
        const { [key]: value, ...rests } = actualProperties;
        let val = value;
        if (propertyByKey.propertyType === PropertyType.STRING) {
          val = value.trim();
        }
        actualProperties = applyFieldValue(propertyByKey, rests, val) as Record<string, string>;
      }
    }

    let ids = this.features?.map(({ id }) => id) || [];
    if (this.isNew) {
      ids = await transformFeature.insertFeatures(
        [{ ...this.features[0], properties: actualProperties, geometry: this.changedGeometry }],
        this.layer
      );
    } else {
      let geometry: WfsGeometry<Coordinate> | undefined;

      if (this.features?.length === 1 && this.isGeometryChanged) {
        geometry = this.features[0].geometry as WfsGeometry<Coordinate>;
      }

      if (this.isGeometryChanged) {
        geometry = this.changedGeometry;
      }

      await this.batchUpdateFeatures(this.features || [], actualProperties, geometry);
    }

    sidebars.setFeaturesEdited(false);

    const savedFeatures = await getFeaturesById(ids, this.layer.complexName);

    sidebars.closeEdit();

    await sleep(0);
    this.isSaveInProgress = false;

    sidebars.openEdit({
      mode: this.mode || EditFeatureMode.single,
      features: savedFeatures,
      layer: this.layer,
      properties: this.properties,
      isNew: false
    });

    if (mapStore.selectedFeatures) {
      sidebars.setMemorizedFeatures(
        mapStore.selectedFeatures.map(feature => savedFeatures.find(feat => feat.id === feature.id) || feature)
      );
    }

    mapService.refreshAllLayers();
    communicationService.featuresUpdated.emit();
  }

  deleteFeature(): void {
    const data: ConfirmDialogData = {
      title: 'Удалить объект?',
      approveBtnName: 'Удалить'
    };

    if (!isVectorLayer(this.layer)) {
      throw new Error('Невозможно удалить объект');
    }

    const { dataset, tableName } = this.layer;

    this.dialog
      .open(ConfirmDialogComponent, { width: '400px', data })
      .afterClosed()
      .pipe(filter(value => !!value))
      .subscribe(async () => {
        if (sidebars.editFeaturesData?.mode === EditFeatureMode.multipleEdit) {
          for (const feature of this.features || []) {
            const featureLayer = getLayerByFeatureInCurrentProject(feature);

            if (!featureLayer) {
              continue;
            }

            await deleteFeatures(featureLayer.dataset, featureLayer.tableName, [feature]);
          }
        } else {
          await deleteFeatures(dataset, tableName, [(this.features || [])[0]]);
        }

        mapService.refreshAllLayers();
        communicationService.featuresUpdated.emit();
        sidebars.setFeaturesEdited(false);

        // TODO: (рефакторинг) этот if всегда false
        if (this.viewFeatures) {
          mapSelectionService.selectFeatures(this.viewFeatures, MapSelectionTypes.REPLACE);
          sidebars.openSelectedFeaturesSidebar();
        } else {
          sidebars.closeEdit();
        }
      });
  }

  getTooltip(): string {
    const count = this.features?.length;

    return count ? `Сохранить данные для ${count} объектов` : 'Сохранить объект';
  }

  switchControl(property: OldPropertySchema): void {
    if (this.editFeatureForm?.controls[property.name].disabled) {
      this.editFeatureForm?.controls[property.name].enable();
    } else {
      this.editFeatureForm?.controls[property.name].disable();
    }
  }

  isShowTemplate(property: OldPropertySchema): boolean {
    const control = this.editFeatureForm?.controls[property.name];

    return control ? control.disabled : false;
  }

  @boundMethod
  async close(): Promise<void> {
    if (sidebars.memorizedViewFeatures) {
      mapSelectionService.selectFeatures(sidebars.memorizedViewFeatures, MapSelectionTypes.REPLACE);
      sidebars.openSelectedFeaturesSidebar();
    } else if (sidebars.foundBySearchFeatureEdited) {
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

  getDateTime(value: string | number): string {
    return formatDate(value);
  }

  isReadOnly(property: OldPropertySchema): boolean {
    if (this.updatingAllowed) {
      return !property.readOnly;
    }

    return this.updatingAllowed;
  }

  private async batchUpdateFeatures(
    features: WfsFeature<Coordinate | CoordinateEdited>[],
    newProperties: Properties,
    geometry?: WfsGeometry<Coordinate>
  ) {
    if (!isVectorLayer(this.layer)) {
      throw new Error('Невозможно обновить объект');
    }

    const { dataset, tableName } = this.layer;

    if (features.length === 1) {
      await updateFeature(dataset, tableName, extractFeatureId(features[0].id), {
        type: 'Feature',
        geometry: geometry,
        properties: newProperties
      });

      communicationService.featuresUpdated.emit();

      return;
    }

    await transformFeature.multipleEdit(dataset, tableName, features, newProperties);

    this.isSaveInProgress = false;
    mapService.refreshAllLayers();
    mapService.clearDraft();

    Toast.success('Сохранено');

    communicationService.featuresUpdated.emit();
  }
}
