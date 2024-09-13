import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import StraightenIcon from '@mui/icons-material/Straighten';
import { cn } from '@bem-react/classname';

import { mapLabelsService } from '../../services/map/map-labels.service';
import { mapStore } from '../../stores/Map.store';
import { IconButton } from '../IconButton/IconButton';

const cnMapDistances = cn('MapDistances');

export const MapDistances: FC = observer(() => {
  const handleOpen = useCallback(async () => {
    await mapLabelsService.addPointsDistances();
  }, []);

  return (
    <div className={cnMapDistances()}>
      <Tooltip
        title={
          mapStore.selectedFeatures.length === 1
            ? 'Расстояние между точками'
            : 'Расстояния между точками отображаются только при выборе одного объекта'
        }
      >
        <span className={cnMapDistances('Wrapper')}>
          <IconButton onClick={handleOpen} disabled={mapStore.selectedFeatures.length !== 1}>
            <StraightenIcon />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
});
