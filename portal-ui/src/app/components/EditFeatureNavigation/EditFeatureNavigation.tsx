import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { EditFeatureMode } from '../../services/map/a-map-mode/edit-feature/EditFeature.models';
import { editFeatureStore } from '../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { mapModeManager } from '../../services/map/a-map-mode/MapModeManager';
import { selectedFeaturesStore } from '../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { MapMode } from '../../services/map/map.models';
import { IconButton } from '../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./EditFeatureNavigation.scss';

const changeFeature = async (index: number) => {
  if (!selectedFeaturesStore.features) {
    return;
  }

  await mapModeManager.changeMode(
    MapMode.EDIT_FEATURE,
    {
      payload: { features: [selectedFeaturesStore.features[index]], mode: EditFeatureMode.single }
    },
    'changeFeature'
  );
};

const cnEditFeatureNavigation = cn('EditFeatureNavigation');

export const EditFeatureNavigation: FC = observer(() => {
  const feature = editFeatureStore.editFeaturesData?.features[0];
  const currentIndex = feature ? selectedFeaturesStore.features?.findIndex(feat => feature.id === feat.id) : undefined;

  const prevHandler = useCallback(() => {
    if (typeof currentIndex === 'number' && currentIndex >= 0 && currentIndex >= 0) {
      void changeFeature(currentIndex - 1);
    }
  }, [currentIndex]);

  const nextHandler = useCallback(() => {
    if (typeof currentIndex === 'number' && currentIndex >= 0) {
      void changeFeature(currentIndex + 1);
    }
  }, [currentIndex]);

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
