import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Tooltip } from '@mui/material';
import { Straighten } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { mapLabelsService } from '../../services/map/labels/map-labels.service';
import { IconButton } from '../IconButton/IconButton';

const cnMapDistances = cn('MapDistances');

export const MapDistances = observer(() => {
  const handleClick = useCallback(async () => {
    await mapLabelsService.addPointsDistances();
  }, []);

  const feature = mapLabelsService.getSelectedOneOrEditedFeature();

  return (
    <Tooltip title={`Подписать промеры${feature ? '' : ' (доступно только для выбранного объекта)'}`}>
      <span className={cnMapDistances('Wrapper')}>
        <IconButton className={cnMapDistances()} onClick={handleClick} disabled={!feature} size='small'>
          <Straighten />
        </IconButton>
      </span>
    </Tooltip>
  );
});
