import { AxiosError } from 'axios';

import { communicationService } from '../../../services/communication.service';
import { projectionCodeToProjection } from '../../../services/data/projections/projections.util';
import { PropertyType } from '../../../services/data/schema/schema.models';
import { convertOldToNewProperties } from '../../../services/data/schema/schema.utils';
import { EditedField, OldSchema } from '../../../services/data/schema/schemaOld.models';
import { createFeature, updateFeature } from '../../../services/data/vectorData/vectorData.service';
import { extractFeatureId } from '../../../services/geoserver/featureType/featureType.util';
import { transformFeatureService } from '../../../services/geoserver/wfs/transform-feature.service';
import { WfsFeature, WfsGeometry } from '../../../services/geoserver/wfs/wfs.models';
import { getFeaturesById } from '../../../services/geoserver/wfs/wfs.service';
import {
  CrgLayerType,
  CrgVectorableLayer,
  CrgVectorLayer,
  isVectorLayer
} from '../../../services/gis/layers/layers.models';
import { EditFeatureMode } from '../../../services/map/a-map-mode/edit-feature/EditFeature.models';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { mapModeManager } from '../../../services/map/a-map-mode/MapModeManager';
import { mapDrawService } from '../../../services/map/draw/map-draw.service';
import { MapMode, MapSelectionTypes } from '../../../services/map/map.models';
import { mapService } from '../../../services/map/map.service';
import { services } from '../../../services/services';
import { transformGeometry } from '../../../services/util/coordinates-transform.util';
import { konfirmieren } from '../../../services/utility-dialogs.service';
import { mapStore } from '../../../stores/Map.store';
import { applyFieldValue } from '../../Form/Form.utils';
import { Toast } from '../../Toast/Toast';
import { Properties } from '../EditFeatureContainer';
import { EditFeatureContainerFormControl } from './useEditFeatureState';

const cantBeSaved = (): boolean => {
  return mapStore.mode === MapMode.EDIT_FEATURE ? editFeatureStore.pristine : false;
};

export const useFeatureSave = ({
  features,
  currentFeatures,
  formControls,
  featureDescription,
  editFeatureData,
  layer,
  isNew,
  mode,
  setIsSaveInProgress
}: {
  features: WfsFeature[];
  currentFeatures: WfsFeature[];
  formControls: EditFeatureContainerFormControl[];
  featureDescription: OldSchema | undefined;
  editFeatureData: EditedField[];
  layer: CrgVectorableLayer | CrgVectorLayer | undefined;
  isNew: boolean;
  mode: EditFeatureMode;
  setIsSaveInProgress: (val: boolean) => void;
}): { saveFeature: () => Promise<void> } => {
  const getDirtyProperties = (): EditedField[] => {
    const result: EditedField[] = [];
    if (!editFeatureStore?.dirty) {
      return result;
    }

    formControls.forEach((property: EditFeatureContainerFormControl) => {
      if (property?.dirty) {
        const prop = { ...editFeatureData.find(({ name }) => name === property.key), value: property.value };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        result.push(prop);
      }
    });

    return result;
  };

  const getActualValuesFromForm = (): Properties => {
    return getDirtyProperties().reduce((newProperties: Properties, item) => {
      newProperties[item.name] = formControls.find(({ key }) => key === item.name)?.value;

      return newProperties;
    }, {});
  };

  const saveFeatureWithConfirm = async (): Promise<void> => {
    if (
      await konfirmieren({
        message: 'Точки геометрии, выходят за рамки слоя. Вы уверенны, что хотите внести изменения в геометрию?'
      })
    ) {
      await saveFeatureWithoutConfirm();
    }
  };

  const saveFeatureWithoutConfirm = async (): Promise<void> => {
    if (cantBeSaved()) {
      return;
    }

    if (!layer || layer.type !== CrgLayerType.VECTOR) {
      return;
    }

    setIsSaveInProgress(true);

    const featureProperties = convertOldToNewProperties(featureDescription?.properties || []);
    let actualProperties = getActualValuesFromForm();

    for (const key of Object.keys(actualProperties)) {
      const propertyByKey = featureProperties.find(({ name }) => name === key);
      if (propertyByKey) {
        const { [key]: value, ...rests } = actualProperties;
        let val = value;

        if (propertyByKey.propertyType === PropertyType.STRING) {
          val = (value as string).trim();
        }
        actualProperties = applyFieldValue(propertyByKey, rests, val) as Record<string, string>;
      }
    }

    let ids = currentFeatures?.map(({ id }) => id) || [];

    if (!layer.complexName) {
      throw new Error('Не установлен complexName слоя');
    }

    const firstFeature: WfsFeature = features?.[0];
    if (layer.dataset && isNew && firstFeature) {
      try {
        const createdFeature = await createFeature(layer.dataset, layer.tableName, {
          type: firstFeature.type,
          properties: actualProperties,
          geometry: transformToNativeProjection(layer.nativeCRS, editFeatureStore.currentGeometry)
        });

        ids = [createdFeature.id];
      } catch (error) {
        const err = error as AxiosError<{
          errors: Record<string, unknown>[];
          message?: string;
        }>;

        editFeatureStore.setGeometryErrorMessage(err.response?.data.message || 'Ошибка при сохранении объекта');

        setIsSaveInProgress(false);

        return;
      }
    } else {
      if (!currentFeatures) {
        services.logger.warn('Нет объектов для сохранения');

        return;
      }

      await (currentFeatures.length === 1
        ? updateOneFeature(currentFeatures[0], actualProperties, editFeatureStore.currentGeometry)
        : batchUpdateFeatures(currentFeatures || [], actualProperties));
    }

    editFeatureStore.setPristine(true);

    const savedFeatures = await getFeaturesById(ids, layer.complexName);

    setIsSaveInProgress(false);

    // если есть ошибка при сохранении объекта, то не дергаем режимы что бы не провоцировать кучу проблем
    if (!editFeatureStore.geometryErrorMessage) {
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
            mode: mode || EditFeatureMode.single,
            features: savedFeatures,
            layer: layer
          }
        },
        'saveFeatureWithConfirm reopen 1.2'
      );
    }

    mapService.refreshAllLayers();
    communicationService.featuresUpdated.emit();

    mapDrawService.drawOff();
  };

  const updateOneFeature = async (feature: WfsFeature, newProperties: Properties, newGeometry?: WfsGeometry) => {
    if (!isVectorLayer(layer)) {
      throw new Error('Обновляем только векторные слои');
    }

    try {
      const { dataset, tableName, nativeCRS } = layer;

      await updateFeature(dataset, tableName, {
        id: String(extractFeatureId(feature.id)),
        type: 'Feature',
        geometry: transformToNativeProjection(nativeCRS, newGeometry),
        properties: newProperties
      });

      communicationService.featuresUpdated.emit({
        type: 'update',
        data: null
      });

      editFeatureStore.setPristineFromGeometryFix(true);

      return;
    } catch (error) {
      const err = error as AxiosError<{
        errors: Record<string, unknown>[];
        message?: string;
      }>;

      editFeatureStore.setGeometryErrorMessage(
        err.response?.data.message || `Ошибка при сохранении фичи: ${feature.id}`
      );
      editFeatureStore.setPristineFromGeometryFix(false);

      setIsSaveInProgress(false);
    }
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const transformToNativeProjection = (nativeCRS: string, newGeometry?: WfsGeometry) => {
    let transformedGeometry;
    if (newGeometry && editFeatureStore.currentProjection) {
      transformedGeometry = transformGeometry(
        newGeometry,
        editFeatureStore.currentProjection,
        projectionCodeToProjection(nativeCRS)
      );
    }

    return transformedGeometry;
  };

  const batchUpdateFeatures = async (features: WfsFeature[], newProperties: Properties) => {
    if (!isVectorLayer(layer)) {
      throw new Error('Невозможно обновить объект');
    }

    try {
      const { dataset, tableName } = layer;

      await transformFeatureService.multipleEdit(dataset, tableName, features, newProperties);

      setIsSaveInProgress(false);
      mapService.refreshAllLayers();
      mapDrawService.clearDraft();

      Toast.success('Сохранено');

      communicationService.featuresUpdated.emit();
    } catch (error) {
      const err = error as AxiosError<{
        errors: Record<string, unknown>[];
        message?: string;
      }>;

      editFeatureStore.setGeometryErrorMessage(err.response?.data.message || 'Ошибка при сохранении объектов');
      editFeatureStore.setPristineFromGeometryFix(false);

      setIsSaveInProgress(false);
    }
  };

  const saveFeature = async () => {
    setIsSaveInProgress(true);

    await (editFeatureStore.hasGeometryWarning ? saveFeatureWithConfirm() : saveFeatureWithoutConfirm());

    editFeatureStore.setPristine(true);
    setIsSaveInProgress(false);
  };

  return { saveFeature };
};
