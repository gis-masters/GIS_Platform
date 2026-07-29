import React, { type FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';
import { cloneDeep } from 'lodash';

import { type WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { MapMode } from '../../services/map/map.models';
import { EditFeatureMode } from '../../services/map/mode/map-mode.models';
import { mapModeService } from '../../services/map/mode/map-mode.service';
import { editFeatureStore } from '../../stores/EditFeature.store';
import { selectedFeaturesStore } from '../../stores/SelectedFeatures.store';
import { type EditFeatureFormControl } from '../EditFeature/hooks/useEditFeatureState';
import { IconButton } from '../IconButton/IconButton';

import './EditFeatureNavigation.scss';

const changeFeature = async (
  feature: WfsFeature,
  setFeatures: (features: WfsFeature[]) => void,
  setFormControls: (features: EditFeatureFormControl[]) => void
) => {
  if (!selectedFeaturesStore.features) {
    return;
  }

  const status = await mapModeService.changeMode(
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

interface EditFeatureNavigationProps extends IClassNameProps {
  setFeatures(features: WfsFeature[]): void;
  setFormControls(formControl: EditFeatureFormControl[]): void;
}

export const EditFeatureNavigation: FC<EditFeatureNavigationProps> = observer(
  ({ className, setFeatures, setFormControls }) => {
    const feature = editFeatureStore.editFeaturesData?.features[0];
    const currentIndex = feature
      ? selectedFeaturesStore.features?.findIndex(feat => feature.id === feat.id)
      : undefined;

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
          <div className={cnEditFeatureNavigation(null, [className])}>
            <Tooltip title='Предыдущий объект'>
              <span className={cnEditFeatureNavigation('Prev')}>
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
              <span className={cnEditFeatureNavigation('Next')}>
                <IconButton
                  disabled={
                    !selectedFeaturesStore.features || currentIndex + 1 === selectedFeaturesStore.features.length
                  }
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
  }
);
