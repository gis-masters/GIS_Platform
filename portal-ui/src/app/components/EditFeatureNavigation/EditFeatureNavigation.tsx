import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { cloneDeep } from 'lodash';

import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { EditFeatureMode } from '../../services/map/a-map-mode/edit-feature/EditFeature.models';
import { editFeatureStore } from '../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { mapModeManager } from '../../services/map/a-map-mode/MapModeManager';
import { selectedFeaturesStore } from '../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { MapMode } from '../../services/map/map.models';
import { EditFeatureContainerFormControl } from '../EditFeatureContainer/hooks/useEditFeatureState';
import { IconButton } from '../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./EditFeatureNavigation.scss';

const changeFeature = async (
  feature: WfsFeature,
  setFeatures: (features: WfsFeature[]) => void,
  setFormControls: (features: EditFeatureContainerFormControl[]) => void
) => {
  if (!selectedFeaturesStore.features) {
    return;
  }

  const status = await mapModeManager.changeMode(
    MapMode.EDIT_FEATURE,
    {
      payload: { features: [feature], mode: EditFeatureMode.single }
    },
    'changeFeature'
  );

  const editFeaturesData = cloneDeep(editFeatureStore.editFeaturesData);

  if (status && editFeaturesData) {
    editFeaturesData.features = [feature];

    setFeatures([feature]);
    setFormControls([]);

    editFeatureStore.setEditFeaturesData(editFeaturesData);
    editFeatureStore.setPristine(true);
  }
};

const cnEditFeatureNavigation = cn('EditFeatureNavigation');

interface EditFeatureNavigationProps {
  setFeatures(features: WfsFeature[]): void;
  setFormControls(formControl: EditFeatureContainerFormControl[]): void;
}

export const EditFeatureNavigation: FC<EditFeatureNavigationProps> = observer(({ setFeatures, setFormControls }) => {
  const feature = editFeatureStore.editFeaturesData?.features[0];
  const currentIndex = feature ? selectedFeaturesStore.features?.findIndex(feat => feature.id === feat.id) : undefined;

  const prevHandler = useCallback(() => {
    if (typeof currentIndex === 'number' && currentIndex >= 0 && currentIndex >= 0) {
      void changeFeature(selectedFeaturesStore.features[currentIndex - 1], setFeatures, setFormControls);
    }
  }, [currentIndex, setFeatures, setFormControls]);

  const nextHandler = useCallback(() => {
    if (typeof currentIndex === 'number' && currentIndex >= 0) {
      void changeFeature(selectedFeaturesStore.features[currentIndex + 1], setFeatures, setFormControls);
    }
  }, [currentIndex, setFeatures, setFormControls]);

  const canBeRendered =
    !!selectedFeaturesStore.features &&
    selectedFeaturesStore.features?.length > 1 &&
    typeof currentIndex === 'number' &&
    currentIndex >= 0;

  return (
    <>
      {canBeRendered && (
        <div className={cnEditFeatureNavigation()}>
          <Tooltip title='Предыдущий объект'>
            <span className={cnEditFeatureNavigation('Wrap')}>
              <IconButton disabled={!selectedFeaturesStore.features || currentIndex === 0} onClick={prevHandler}>
                <ArrowBackIosNew />
              </IconButton>
            </span>
          </Tooltip>

          <span className={cnEditFeatureNavigation('TextBox')}>
            {currentIndex + 1}
            <span className={cnEditFeatureNavigation('Text')}> из</span>
            {selectedFeaturesStore.features.length}
          </span>

          <Tooltip title='Следующий объект'>
            <span className={cnEditFeatureNavigation('Wrap')}>
              <IconButton
                disabled={!selectedFeaturesStore.features || currentIndex + 1 === selectedFeaturesStore.features.length}
                onClick={nextHandler}
              >
                <ArrowForwardIos />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      )}
    </>
  );
});
