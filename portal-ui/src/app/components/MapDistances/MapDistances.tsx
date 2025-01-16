import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Straighten } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { mapLabelsService } from '../../services/map/labels/map-labels.service';
import { mapStore } from '../../stores/Map.store';
import { sidebars } from '../../stores/Sidebars.store';
import { IconButton } from '../IconButton/IconButton';

const cnMapDistances = cn('MapDistances');

export const MapDistances: FC = observer(() => {
  const handleOpen = useCallback(async () => {
    await mapLabelsService.addPointsDistances();
  }, []);

  const disabled =
    sidebars.editFeaturesData?.isNew ||
    !mapStore.selectedFeatures.length ||
    (mapStore.selectedFeatures.length > 1 && sidebars.editFeaturesData?.features.length !== 1);

  return (
    <Tooltip
      title={`Подписать промеры${mapStore.selectedFeatures.length ? '' : ' (доступно только для выбранного объекта)'}`}
    >
      <span className={cnMapDistances('Wrapper')}>
        <IconButton className={cnMapDistances()} onClick={handleOpen} disabled={!!disabled} size='small'>
          <Straighten />
        </IconButton>
      </span>
    </Tooltip>
  );
});
