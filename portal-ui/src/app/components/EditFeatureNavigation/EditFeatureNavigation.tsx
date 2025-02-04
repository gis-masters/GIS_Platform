import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { EditFeatureMode, sidebars } from '../../stores/Sidebars.store';
import { IconButton } from '../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./EditFeatureNavigation.scss';

const changeFeature = (index: number) => {
  if (!sidebars.memorizedViewFeatures) {
    return;
  }
  sidebars.closeSidebar();
  sidebars.openEdit({ features: [sidebars.memorizedViewFeatures[index]], mode: EditFeatureMode.single });
};

const cnEditFeatureNavigation = cn('EditFeatureNavigation');

export const EditFeatureNavigation: FC = observer(() => {
  const feature = sidebars.editFeaturesData?.features[0];
  const currentIndex = feature ? sidebars.memorizedViewFeatures?.findIndex(feat => feature.id === feat.id) : undefined;

  const prevHandler = useCallback(() => {
    if (typeof currentIndex === 'number' && currentIndex >= 0 && currentIndex >= 0) {
      changeFeature(currentIndex - 1);
    }
  }, [currentIndex]);

  const nextHandler = useCallback(() => {
    if (typeof currentIndex === 'number' && currentIndex >= 0) {
      changeFeature(currentIndex + 1);
    }
  }, [currentIndex]);

  return (
    <>
      {!!sidebars.memorizedViewFeatures &&
        sidebars.memorizedViewFeatures?.length > 1 &&
        typeof currentIndex === 'number' &&
        currentIndex >= 0 && (
          <div className={cnEditFeatureNavigation()}>
            <Tooltip title='Предыдущий объект'>
              <span className={cnEditFeatureNavigation('Wrap')}>
                <IconButton disabled={!sidebars.memorizedViewFeatures || currentIndex === 0} onClick={prevHandler}>
                  <ArrowBackIos />
                </IconButton>
              </span>
            </Tooltip>
            <span className={cnEditFeatureNavigation('FeaturesInfo')}>
              {currentIndex + 1}
              <span className={cnEditFeatureNavigation('Text')}> из</span>
              {sidebars.memorizedViewFeatures.length}
            </span>
            <Tooltip title='Следующий объект'>
              <span className={cnEditFeatureNavigation('Wrap')}>
                <IconButton
                  disabled={
                    !sidebars.memorizedViewFeatures || currentIndex + 1 === sidebars.memorizedViewFeatures.length
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
});
