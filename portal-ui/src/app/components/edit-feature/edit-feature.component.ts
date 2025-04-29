import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';
import { cloneDeep, isNumber } from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime, first, takeUntil } from 'rxjs/operators';
import { EditFeatureMode, EditFeaturesData } from 'src/app/services/map/a-map-mode/edit-feature/EditFeature.models';

import { communicationService } from '../../services/communication.service';
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
import {
  createFeature,
  deleteFeaturesAndEmitEvent,
  updateFeature
} from '../../services/data/vectorData/vectorData.service';
import { extractFeatureId } from '../../services/geoserver/featureType/featureType.util';
import { transformFeatureService } from '../../services/geoserver/wfs/transform-feature.service';
import { WfsFeature, WfsGeometry } from '../../services/geoserver/wfs/wfs.models';
import { getFeaturesById } from '../../services/geoserver/wfs/wfs.service';
import { getEmptyGeometry } from '../../services/geoserver/wfs/wfs.util';
import {
  CrgLayerType,
  CrgVectorableLayer,
  CrgVectorLayer,
  isVectorLayer
} from '../../services/gis/layers/layers.models';
import { getLayerSchema } from '../../services/gis/layers/layers.service';
import { getLayerByFeatureInCurrentProject } from '../../services/gis/layers/layers.utils';
import { editFeatureStore } from '../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { mapModeManager } from '../../services/map/a-map-mode/MapModeManager';
import { selectedFeaturesStore } from '../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { mapDrawService } from '../../services/map/draw/map-draw.service';
import { MapMode, MapSelectionTypes } from '../../services/map/map.models';
import { mapService } from '../../services/map/map.service';
import { isUpdateAllowed } from '../../services/permissions/permissions.service';
import { services } from '../../services/services';
import { formatDate, systemFormat } from '../../services/util/date.util';
import { FeaturePropertyValidators } from '../../services/util/FeaturePropertyValidators';
import { calculateValues } from '../../services/util/form/formValidation.utils';
import { fromMobx } from '../../services/util/fromMobx';
import { konfirmieren } from '../../services/utility-dialogs.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { mapStore } from '../../stores/Map.store';
import { sidebars } from '../../stores/Sidebars.store';
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
  features?: WfsFeature[];
  layer?: CrgVectorableLayer;
  isNew?: boolean;
  selectedTab?: number;
  updatingAllowed = false;

  isSaveInProgress = false;

  isGeometryValid = false;
  isGeometryChanged = false;

  isGeometryAutoFixed = false;

  private unsubscribeFromMobx$: Subject<void> = new Subject<void>();

  constructor(private formBuilder: UntypedFormBuilder) {
    super();
  }

  ngOnInit() {
    fromMobx<EditFeaturesData | undefined>(() => editFeatureStore.editFeaturesData, true)
      .pipe(takeUntil(this.unsubscribe$))
      // TODO: не происходит отписка unsubscribeFromMobx$, что приводит к многократному выполнению этого кода.
      // Но просто добавить отписку не получается, ломается изменение геометрии через координаты - перестаёт их
      // отслеживать. Надеемся, что правая панель умрет раньше, чем с этим придется разбираться.
      // .pipe(takeUntil(this.unsubscribeFromMobx$))
      .subscribe(async data => {
        if (!data || !data.features) {
          return;
        }

        this.mode = data.mode;
        this.features = data.features;
        const firstFeature = this.features[0];

        if (!firstFeature) {
          return;
        }

        const layer = data.layer || getLayerByFeatureInCurrentProject(firstFeature);

        if (layer) {
          sidebars.setLayerOfEditedFeature(layer);
          this.layer = { ...layer };
        }

        this.setIsNew(firstFeature);

        this.selectedTab = editFeatureStore.geometryValidationError ? 1 : Number(this.isNew);

        if (!this.isNew) {
          await mapDrawService.highlightFeatures(this.features);
          this.isGeometryChanged = false;
        }

        this.editFeatureForm = this.formBuilder.group({});
        this.editFeatureForm.statusChanges.pipe(debounceTime(50)).subscribe(() => {
          this.publishPristine();
        });

        // Если объект новый и уже с координатами
        if (this.isNew && this.featureHasNotEmptyGeometry(firstFeature)) {
          // Используем setTimeout, чтобы дать время на инициализацию всех подписок
          setTimeout(() => {
            this.isGeometryValid = true;
            this.isGeometryChanged = true;
            editFeatureStore.setPristine(true);
          }, 100);
        }

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

            if (this.featureDescription) {
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

                this.editFeatureForm?.addControl(key, formControl);
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
              }

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
        this.isGeometryValid = false;
        this.isGeometryChanged = false;
        this.updatingAllowed = !!this.layer && (await isUpdateAllowed(this.layer));

        if (this.layer) {
          editFeatureStore.setLayer(this.layer);
        }

        if (
          this.updatingAllowed &&
          this.mode === EditFeatureMode.single &&
          !firstFeature.geometry &&
          this.featureDescription.geometryType
        ) {
          firstFeature.geometry = getEmptyGeometry(this.featureDescription.geometryType);
        }

        const projection = await getFeatureProjection(firstFeature);
        if (projection) {
          editFeatureStore.initFeature(firstFeature, projection);
        } else {
          services.logger.error('Не удалось получить проекцию или геометрию объекта');
        }

        selectedFeaturesStore.setActiveFeature(firstFeature.id);

        if (this.updatingAllowed) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          fromMobx(() => editFeatureStore.geometry?.coordinates?.flat(5), false)
            .pipe(first())
            .pipe(takeUntil(this.unsubscribe$))
            .pipe(takeUntil(this.unsubscribeFromMobx$))
            .subscribe(() => {
              fromMobx(() => editFeatureStore.isGeometryValid)
                .pipe(takeUntil(this.unsubscribe$))
                .pipe(takeUntil(this.unsubscribeFromMobx$))
                .subscribe(isValid => {
                  this.isGeometryValid = isValid;
                });

              fromMobx(() => editFeatureStore.isGeometryChanged)
                .pipe(takeUntil(this.unsubscribe$))
                .pipe(takeUntil(this.unsubscribeFromMobx$))
                .subscribe(isGeometryChanged => {
                  this.isGeometryChanged = isGeometryChanged;
                  editFeatureStore.setPristine(false);
                });

              fromMobx(() => editFeatureStore.geometryValidationErrorMessage)
                .pipe(takeUntil(this.unsubscribe$))
                .pipe(takeUntil(this.unsubscribeFromMobx$))
                .subscribe(() => {
                  if (!editFeatureStore.geometryValidationErrorMessage) {
                    this.isGeometryAutoFixed = true;
                  }
                });
            });
        }
      });

    // Подписка на изменение слоёв, для реакции на изменение "представления" у слоя
    fromMobx<CrgVectorLayer[]>(() => cloneDeep(currentProject.vectorableLayers))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async layers => {
        const currentLayer = layers.find(item => item.id === this.layer?.id);
        if (!currentLayer) {
          await mapModeManager.changeMode(MapMode.NONE, undefined, 'cloneDeep(currentProject.vectorableLayers)');

          return;
        }

        const view = isVectorLayer(this.layer) ? this.layer.view : undefined;
        if (currentLayer.view !== view) {
          await mapModeManager.changeMode(
            MapMode.EDIT_FEATURE,
            {
              payload: {
                mode: this.mode || EditFeatureMode.single,
                features: this.features as WfsFeature[],
                layer: currentLayer
              }
            },
            'edit feature vectorableLayers'
          );
        }
      });
  }

  async ngOnDestroy() {
    if (currentProject.visibleOnMapLayers.length) {
      await mapDrawService.highlightFeatures(selectedFeaturesStore.highlightedFeatures);
    }
  }

  cantBeSaved(): boolean {
    return mapStore.mode === MapMode.EDIT_FEATURE ? editFeatureStore.pristine : false;
  }

  async saveFeature(): Promise<void> {
    await (editFeatureStore.hasGeometryWarning ? this.saveFeatureWithConfirm() : this.saveFeatureWithoutConfirm());

    this.editFeatureForm?.markAsPristine();
    this.publishPristine();
  }

  async saveFeatureWithConfirm(): Promise<void> {
    if (
      await konfirmieren({
        message: 'Точки геометрии, выходят за рамки слоя. Вы уверенны, что хотите внести изменения в геометрию?'
      })
    ) {
      await this.saveFeatureWithoutConfirm();
    }
  }

  async saveFeatureWithoutConfirm(): Promise<void> {
    if (this.cantBeSaved()) {
      return;
    }

    if (!this.layer || this.layer.type !== CrgLayerType.VECTOR) {
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
    const layer = this.layer as CrgVectorLayer;
    if (!layer.complexName) {
      throw new Error('Не установлен complexName слоя');
    }

    const firstFeature: WfsFeature = this.features?.[0] as WfsFeature;

    if (this.isNew && firstFeature) {
      try {
        const createdFeature = await createFeature(layer.dataset, layer.tableName, {
          type: firstFeature.type,
          properties: actualProperties,
          geometry: editFeatureStore.resultGeometry
        });
        ids = [createdFeature.id];
      } catch (error) {
        const err = error as AxiosError<{ errors: Record<string, unknown>[]; message?: string }>;

        editFeatureStore.setGeometryValidationErrorMessage(
          err.response?.data.message || 'Ошибка при сохранении объекта'
        );
        editFeatureStore.setGeometryValidationError(true);

        this.isSaveInProgress = false;

        return;
      }
    } else {
      let geometry: WfsGeometry | undefined;

      if (this.features?.length === 1 && this.isGeometryChanged) {
        geometry = this.features[0].geometry as WfsGeometry;
      }

      if (this.isGeometryChanged || this.isGeometryAutoFixed) {
        geometry = editFeatureStore.resultGeometry;
      }

      await this.batchUpdateFeatures(this.features || [], actualProperties, geometry);
    }

    editFeatureStore.setPristine(true);

    const savedFeatures = await getFeaturesById(ids, layer.complexName);

    this.isSaveInProgress = false;

    // если есть ошибка при сохранении объекта, то не дергаем режимы что бы не провоцировать кучу проблем
    if (!editFeatureStore.geometryValidationError) {
      await mapModeManager.changeMode(
        MapMode.SELECTED_FEATURES,
        {
          payload: {
            features: savedFeatures,
            type: MapSelectionTypes.ADD
          }
        },
        'saveFeatureWithConfirm reopen 1'
      );

      await mapModeManager.changeMode(
        MapMode.EDIT_FEATURE,
        {
          payload: {
            mode: this.mode || EditFeatureMode.single,
            features: savedFeatures,
            layer: this.layer
          }
        },
        'saveFeatureWithConfirm reopen 1.2'
      );
    }

    mapService.refreshAllLayers();
    communicationService.featuresUpdated.emit();

    mapDrawService.drawOff();
  }

  async deleteFeature(): Promise<void> {
    if (!isVectorLayer(this.layer)) {
      throw new Error('Невозможно удалить объект');
    }

    if (
      await konfirmieren({
        message: 'Вы действительно хотите удалить объект?',
        okText: 'Удалить',
        cancelText: 'Отмена'
      })
    ) {
      const { dataset, tableName } = this.layer;

      const firstWfsFeature = (this.features || [])[0];
      if (editFeatureStore.editFeaturesData?.mode === EditFeatureMode.single) {
        await deleteFeaturesAndEmitEvent(dataset, tableName, [firstWfsFeature]);
        mapService.refreshAllLayers();

        await mapModeManager.changeMode(
          MapMode.SELECTED_FEATURES,
          {
            payload: {
              features: [firstWfsFeature],
              type: MapSelectionTypes.REMOVE
            }
          },
          'remove 1 feature'
        );
      } else {
        services.logger.warn(`Удаление только для режима ${EditFeatureMode[EditFeatureMode.single]}`);
      }
    }
  }

  getTooltip(): string {
    const count = Number(this.features?.length);

    return count > 1 ? `Сохранить данные для ${count} объектов` : 'Сохранить объект';
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
  async backToList(): Promise<void> {
    if (!selectedFeaturesStore.features?.length) {
      await services.provided;
      await services.router.navigate([location.pathname], {
        queryParams: { features: null, queryFilter: null, queryLayers: null },
        queryParamsHandling: 'merge'
      });
    }

    const success = await mapModeManager.changeMode(MapMode.SELECTED_FEATURES, undefined, 'backToList');

    if (success) {
      selectedFeaturesStore.clearActiveFeature();
    }
  }

  setIsNew(firstFeature: WfsFeature): void {
    if (firstFeature?.id === undefined) {
      this.isNew = true;
    }

    this.isNew = extractFeatureId(firstFeature?.id) === 0;
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

  private async batchUpdateFeatures(features: WfsFeature[], newProperties: Properties, geometry?: WfsGeometry) {
    if (!isVectorLayer(this.layer)) {
      throw new Error('Невозможно обновить объект');
    }

    try {
      const { dataset, tableName } = this.layer;

      // А как это работает? Передавая массив features, мы обновляем только одну: features[0].id ???
      if (features.length === 1) {
        await updateFeature(dataset, tableName, {
          id: String(extractFeatureId(features[0].id)),
          type: 'Feature',
          geometry: geometry,
          properties: newProperties
        });

        communicationService.featuresUpdated.emit({ type: 'update', data: null });
        editFeatureStore.setPristineFromGeometryFix(false);

        return;
      }

      await transformFeatureService.multipleEdit(dataset, tableName, features, newProperties);

      this.isSaveInProgress = false;
      mapService.refreshAllLayers();
      mapDrawService.clearDraft();

      Toast.success('Сохранено');

      communicationService.featuresUpdated.emit();
    } catch (error) {
      const err = error as AxiosError<{ errors: Record<string, unknown>[]; message?: string }>;

      editFeatureStore.setGeometryValidationErrorMessage(err.response?.data.message || 'Ошибка при сохранении объекта');
      editFeatureStore.setGeometryValidationError(true);

      this.isSaveInProgress = false;
    }
  }

  private publishPristine() {
    if (editFeatureStore.pristineFromGeometryFix) {
      editFeatureStore.setPristine(false);

      return;
    }

    if (this.editFeatureForm) {
      editFeatureStore.setPristine(this.editFeatureForm.pristine);
    } else {
      editFeatureStore.setPristine(false);
    }
  }

  private keyMatchBySchemas(key: string, newProperties: PropertySchema[], oldProperties: OldPropertySchema[]) {
    const keyExistInNew = newProperties.some(item => key.toLowerCase() === item.name.toLowerCase());
    const keyExistInOld = oldProperties.some(item => key.toLowerCase() === item.name.toLowerCase());

    return keyExistInNew || (!keyExistInNew && !keyExistInOld);
  }

  private featureHasNotEmptyGeometry(feature: WfsFeature): boolean {
    if (!feature?.geometry || !feature?.geometry?.coordinates) {
      return false;
    }

    const coordinates = feature.geometry.coordinates.flat(5);

    return coordinates.some(coord => coord !== 0);
  }

  protected readonly sidebars = sidebars;
  protected readonly Number = Number;
  protected readonly editFeatureStore = editFeatureStore;
  protected readonly mapStore = mapStore;
  protected readonly MapMode = MapMode;
}
