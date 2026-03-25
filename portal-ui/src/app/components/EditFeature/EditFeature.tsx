import React, { type FC, type ReactNode, type SyntheticEvent, useCallback, useEffect, useMemo } from 'react';
import { type IReactionDisposer, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { Badge, Tab, Tabs, Tooltip } from '@mui/material';
import { Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import _, { isEqual } from 'lodash';

import { doConfirm } from '../../services/answer-modals.service';
import { communicationService, type DataChangeEventDetail } from '../../services/communication.service';
import {
  applyView,
  applyViewOld,
  changeSchemaNamesCaseByFeature,
  convertNewToOldSchema
} from '../../services/data/schema/schema.utils';
import { deleteFeaturesAndEmitEvent } from '../../services/data/vectorData/vectorData.service';
import { type WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { getEmptyGeometry } from '../../services/geoserver/wfs/wfs.util';
import { type CrgLayer, type CrgVectorLayer, isVectorLayer } from '../../services/gis/layers/layers.models';
import { EditFeatureMode } from '../../services/map/a-map-mode/edit-feature/EditFeature.models';
import { editFeatureStore } from '../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { mapModeManager } from '../../services/map/a-map-mode/MapModeManager';
import { selectedFeaturesStore } from '../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { mapDrawService } from '../../services/map/draw/map-draw.service';
import { MapMode, MapSelectionTypes } from '../../services/map/map.models';
import { mapService } from '../../services/map/map.service';
import { getStyle, KnownStyleKey } from '../../services/map/styles/map-styles';
import { isUpdateAllowed } from '../../services/permissions/permissions.service';
import { services } from '../../services/services';
import { calculateValues } from '../../services/util/form/formValidation.utils';
import { mapStore } from '../../stores/Map.store';
import { Button } from '../Button/Button';
import { EditFeatureActions } from '../EditFeatureActions/EditFeatureActions';
import { EditFeatureForm } from '../EditFeatureForm/EditFeatureForm';
import { EditFeatureGeometry } from '../EditFeatureGeometry/EditFeatureGeometry';
import { EditFeatureNavigation } from '../EditFeatureNavigation/EditFeatureNavigation';
import { IconButton } from '../IconButton/IconButton';
import { Loading } from '../Loading/Loading';
import { EditFeatureThemeProvider } from './EditFeatureTheme';
import { useEditFeatureInitialization } from './hooks/useEditFeatureInitialization';
import { useEditFeatureState } from './hooks/useEditFeatureState';
import { useFeatureFormGenerator } from './hooks/useFeatureFormGenerator';
import { useFeatureSave } from './hooks/useFeatureSave';
import { useFeatureSetup } from './hooks/useFeatureSetup';
import { useLayerData } from './hooks/useLayerData';

import './EditFeature.scss';

export const cnEditFeature = cn('EditFeature');

const featureHasNotEmptyGeometry = (feature: WfsFeature): boolean => {
  if (!feature?.geometry || !feature?.geometry?.coordinates) {
    return false;
  }

  const coordinates = feature.geometry.coordinates.flat(5);

  return coordinates.some(coord => coord !== 0);
};

const featureHasEmptyGeometry = (feature: WfsFeature): boolean => {
  if (!feature?.geometry || !feature?.geometry?.coordinates) {
    return false;
  }

  const coordinates = feature.geometry.coordinates.flat(5);

  return coordinates.every(coord => coord === 0);
};

const cantBeSaved = (): boolean => {
  return mapStore.mode === MapMode.EDIT_FEATURE ? editFeatureStore.pristine : false;
};

type Timer = ReturnType<typeof setTimeout>;

export const EditFeature: FC = observer(() => {
  const state = useEditFeatureState();
  const {
    mode,
    setMode,
    layer,
    setLayer,
    isNew,
    setIsNew,
    features,
    setFeatures,
    selectedTab,
    setSelectedTab,
    setIsGeometryChanged,
    updatingAllowed,
    setUpdatingAllowed,
    setIsGeometryAutoFixed,
    isSaveInProgress,
    setIsSaveInProgress,
    editFeatureData,
    setEditFeatureData,
    shouldRender,
    setShouldRender,
    layerSchema,
    setLayerSchema,
    featureDescription,
    setFeatureDescription,
    formControls,
    setFormControls
  } = state;

  const backToList = useCallback(async (): Promise<void> => {
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
      editFeatureStore.clear();

      await mapModeManager.changeMode(
        MapMode.SELECTED_FEATURES,
        {
          payload: {
            features: selectedFeaturesStore.features,
            type: MapSelectionTypes.REPLACE
          }
        },
        'selectFeaturesByBuffer - 1'
      );

      const currentFeatures = await mapDrawService.getFeatures();
      currentFeatures.forEach(feature => {
        feature.setStyle(getStyle(KnownStyleKey.SelectedFeaturesWithVertices));
      });

      setEditFeatureData([]);
      setFormControls([]);
      setFeatures([]);
      editFeatureStore.setPristine(true);
    }
  }, [setEditFeatureData, setFeatures, setFormControls]);

  useLayerData(layer, shouldRender, setLayerSchema, setShouldRender);

  useEditFeatureInitialization(
    features,
    isNew,
    shouldRender,
    setMode,
    setFeatures,
    setLayer,
    setIsNew,
    setSelectedTab,
    setShouldRender
  );

  const featureSetupMode = features.length > 1 ? EditFeatureMode.multipleEdit : EditFeatureMode.single;

  useFeatureSetup(features, layer, featureSetupMode);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (!isNew && isMounted) {
          await mapDrawService.reDrawFeatures(features);
          setIsGeometryChanged(false);
        }
      } catch {
        // error
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, [features, isNew, layer, setIsGeometryChanged, setLayerSchema]);

  useEffect(() => {
    let timer: Timer | undefined;

    if (isNew && featureHasNotEmptyGeometry(features[0])) {
      timer = setTimeout(() => {
        setIsGeometryChanged(true);
        editFeatureStore.setPristine(true);
      }, 100);
    } else if (isNew && featureHasEmptyGeometry(features[0])) {
      setEditFeatureData([]);
      setFormControls([]);
    }

    return () => clearTimeout(timer);
  }, [features, isNew, setEditFeatureData, setFeatures, setFormControls, setIsGeometryChanged]);

  useEffect(() => {
    if (!layerSchema) {
      return;
    }

    const oldSchema = convertNewToOldSchema(layerSchema);
    const view = isVectorLayer(layer) ? layer.view : undefined;
    const currentFeatureDescription = applyViewOld(changeSchemaNamesCaseByFeature(oldSchema, features[0]), view);

    if (!isEqual(featureDescription, currentFeatureDescription)) {
      setFeatureDescription(currentFeatureDescription);
    }
  }, [featureDescription, features, layer, layerSchema, setFeatureDescription]);

  const currentFeatures = useMemo(() => {
    if (!layerSchema) {
      return features;
    }

    const view = isVectorLayer(layer) ? layer.view : undefined;
    const propertiesWithAppliedView = applyView(layerSchema, view).properties;

    return features.map(feature => {
      if (!feature.properties) {
        return feature;
      }

      const updatedProperties = calculateValues(feature.properties, propertiesWithAppliedView);
      const originalProperties = feature.properties;

      const mergedProperties = Object.fromEntries(
        Object.entries(originalProperties).map(([key, value]) => {
          const matchedKey = Object.keys(updatedProperties).find(k => k.toLowerCase() === key.toLowerCase());

          return [key, matchedKey ? updatedProperties[matchedKey] : value];
        })
      );

      return {
        ...feature,
        properties: mergedProperties
      };
    });
  }, [features, layerSchema, layer]);

  const updateCurrentFeature = (features: WfsFeature[]) => {
    setFormControls([]);
    setEditFeatureData([]);
    setFeatures(features);

    editFeatureStore.setPristine(true);
  };

  useFeatureFormGenerator(
    currentFeatures[0],
    formControls,
    mode,
    setFormControls,
    setEditFeatureData,
    setFeatureDescription,
    layerSchema,
    featureDescription,
    layer
  );

  useEffect(() => {
    let isMounted = true;

    if (!layer) {
      return;
    }

    const fetchData = async () => {
      try {
        if (isMounted) {
          setUpdatingAllowed(!!layer && (await isUpdateAllowed(layer)));
        }
      } catch {
        // error
      }
    };

    void fetchData();

    editFeatureStore.setLayer(layer);

    return () => {
      isMounted = false;
    };
  }, [layer, setUpdatingAllowed]);

  useEffect(() => {
    if (
      features.length &&
      updatingAllowed &&
      mode === EditFeatureMode.single &&
      !features[0]?.geometry &&
      featureDescription?.geometryType
    ) {
      const geometry = getEmptyGeometry(featureDescription.geometryType);

      if (geometry) {
        features[0].geometry = geometry;
      }
    }

    if (features[0]?.id) {
      selectedFeaturesStore.setActiveFeature(features[0]);
    }
  }, [featureDescription?.geometryType, features, mode, updatingAllowed]);

  useEffect(() => {
    const disposers: IReactionDisposer[] = [];

    // Реакция на изменение координат (flat(5) аналогично можно отслеживать просто изменение структуры)
    const coordinatesDisposer = reaction(
      () => editFeatureStore.geometry?.coordinates?.flat(5),
      () => {
        editFeatureStore.setPristine(false);

        const errorDisposer = reaction(
          () => editFeatureStore.geometryErrorMessage,
          msg => {
            if (!msg) {
              setIsGeometryAutoFixed?.(true);
            }
          },
          { fireImmediately: true }
        );

        disposers.push(errorDisposer);
      },
      { fireImmediately: true }
    );

    // адский костыль, как и в мастере Pristine скачет туда сюда при переключении
    const isGeometryChangedDisposer = reaction(
      () => editFeatureStore.isGeometryChanged,
      () => {
        editFeatureStore.setPristine(true);
      },
      { fireImmediately: true }
    );

    const isCurrentFeaturesDataChanged = reaction(
      () => editFeatureStore.editFeaturesData,
      data => {
        updateCurrentFeature(data?.features || []);
      },
      { fireImmediately: true }
    );

    const isSelectedFeatureChangedDisposer = reaction(
      () => selectedFeaturesStore.features,
      features => {
        // Не обновляем editFeaturesData если текущие данные уже правильные
        const currentFeature = editFeatureStore.editFeaturesData?.features?.[0];
        const targetFeature = features.find(f => f.id === currentFeature?.id);

        if (currentFeature && targetFeature && currentFeature.geometry?.type === targetFeature.geometry?.type) {
          return;
        }

        const empty = features.find(({ id }) => id.includes('.0'));

        if (empty) {
          updateCurrentFeature([empty]);
        } else {
          updateCurrentFeature(features);
        }
      }
    );

    disposers.push(
      coordinatesDisposer,
      isGeometryChangedDisposer,
      isCurrentFeaturesDataChanged,
      isSelectedFeatureChangedDisposer
    );

    return () => {
      disposers.forEach(dispose => dispose());
    };
  }, [features, setEditFeatureData, setFeatures, setFormControls, setIsGeometryAutoFixed, updatingAllowed]);

  useEffect(() => {
    const eventHandler = (e: CustomEvent<DataChangeEventDetail<CrgLayer>>) => {
      const modifiedLayer = e.detail.data as CrgVectorLayer;
      if (modifiedLayer) {
        setLayer(modifiedLayer);
        setFormControls([]);
      }
    };

    communicationService.layerUpdated.on(eventHandler);

    return () => {
      communicationService.layerUpdated.off(eventHandler);
    };
  }, [setLayer, setFormControls]);

  const getTooltip = (): string => {
    const count = Number(currentFeatures?.length);

    return count > 1 ? `Сохранить данные для ${count} объектов` : 'Сохранить объект';
  };

  const deleteFeature = useCallback(async (): Promise<void> => {
    if (!isVectorLayer(layer)) {
      throw new Error('Невозможно удалить объект');
    }

    if (
      await doConfirm({
        message: 'Вы действительно хотите удалить объект?',
        okText: 'Удалить',
        cancelText: 'Отмена'
      })
    ) {
      const { dataset, resourceId } = layer;

      const firstWfsFeature = (currentFeatures || [])[0];
      if (editFeatureStore.editFeaturesData?.mode === EditFeatureMode.single) {
        await deleteFeaturesAndEmitEvent(dataset, resourceId, [firstWfsFeature]);
        mapService.refreshAllLayers();

        if (selectedFeaturesStore.features.length > 1) {
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
          selectedFeaturesStore.setFeatures([]);
          await mapModeManager.changeMode(MapMode.NONE, undefined, 'remove 1 feature');
        }
      } else {
        services.logger.warn(`Удаление только для режима ${EditFeatureMode[EditFeatureMode.single]}`);
      }
    }
  }, [currentFeatures, layer]);

  const handleTabsChange = useCallback(
    (e: SyntheticEvent<Element, Event>, value: unknown) => {
      if (typeof value === 'number') {
        setSelectedTab(value);
      }
    },
    [setSelectedTab]
  );

  const { saveFeature } = useFeatureSave({
    features,
    currentFeatures,
    formControls,
    featureDescription,
    editFeatureData,
    layer,
    isNew,
    mode,
    setIsSaveInProgress
  });

  if (shouldRender.noLayerSchema) {
    return <>Нет схемы</>;
  }

  const getEditFeatureForm = (): ReactNode => {
    return (
      !!currentFeatures.length && (
        <EditFeatureForm
          mode={mode}
          editFeatureData={editFeatureData}
          formControls={formControls}
          features={currentFeatures}
          setFormControls={setFormControls}
          updatingAllowed={updatingAllowed}
        />
      )
    );
  };

  return (
    <EditFeatureThemeProvider>
      <div className={cnEditFeature({ readonly: !updatingAllowed })}>
        <div className={cnEditFeature('Controls')}>
          <div className={cnEditFeature('ButtonsBox')}>
            <Tooltip title={getTooltip()}>
              <Badge
                badgeContent={(currentFeatures?.length || 0) > 1 ? currentFeatures?.length : null}
                color='secondary'
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                {updatingAllowed && (
                  <Button
                    className={cnEditFeature('Save')}
                    color='primary'
                    variant='outlined'
                    onClick={saveFeature}
                    disabled={cantBeSaved()}
                  >
                    Сохранить
                  </Button>
                )}
              </Badge>
            </Tooltip>

            {updatingAllowed && !isNew && mode !== 'multipleEdit' && (
              <Button
                className={cnEditFeature('Delete')}
                disabled={editFeatureStore.dirty}
                onClick={deleteFeature}
                color='error'
                variant='outlined'
              >
                Удалить
              </Button>
            )}
          </div>

          <div className={cnEditFeature('NavigationBox')}>
            {mode !== 'multipleEdit' && (
              <EditFeatureNavigation
                className={cnEditFeature('Navigation')}
                setFormControls={setFormControls}
                setFeatures={setFeatures}
              />
            )}
          </div>

          <div className={cnEditFeature('BackBox')}>
            <Tooltip title='Вернуться к списку'>
              <IconButton className={cnEditFeature('Back')} onClick={backToList} color='default'>
                <Close />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <div className={cnEditFeature('Tabs')}>
          {mode === 'single' ? (
            <>
              <Tabs
                className={cnEditFeature('Tab')}
                value={selectedTab}
                variant='scrollable'
                scrollButtons='auto'
                onChange={handleTabsChange}
              >
                <Tab role='Атрибуты' label='Атрибуты' />
                <Tab role='Геометрия' label='Геометрия' />
              </Tabs>

              {selectedTab === 0 ? getEditFeatureForm() : <EditFeatureGeometry readOnly={!updatingAllowed} />}
            </>
          ) : (
            getEditFeatureForm()
          )}

          {mode === 'single' && layer && !!currentFeatures?.length && isVectorLayer(layer) && (
            <EditFeatureActions feature={currentFeatures[0]} layer={layer} />
          )}

          <Loading global visible={isSaveInProgress} />
        </div>
      </div>
    </EditFeatureThemeProvider>
  );
});
