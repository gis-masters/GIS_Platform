import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Adjust } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { mapLabelsService } from '../../services/map/labels/map-labels.service';
import { IconButton } from '../IconButton/IconButton';

const cnMapTurningPoints = cn('MapTurningPoints');

export const MapTurningPoints = observer(() => {
  const handleClick = useCallback(async () => {
    await mapLabelsService.addTurningPoints();
  }, []);

  const feature = mapLabelsService.getSelectedOneOrEditedFeature();

  return (
    <Tooltip title={`Подписать поворотные точки${feature ? '' : ' (доступно только для выбранного объекта)'}`}>
      <span>
        <IconButton disabled={!feature} className={cnMapTurningPoints()} onClick={handleClick} size='small'>
          <Adjust />
        </IconButton>
      </span>
    </Tooltip>
  );
});
