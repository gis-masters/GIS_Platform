import React, { type FC, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Brush, BrushOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { mapDrawService } from '../../../services/map/draw/map-draw.service';
import { toDrawGeometry } from '../../../services/map/draw/map-draw.util';
import { ToolMode } from '../../../services/map/map.models';
import { services } from '../../../services/services';
import { editFeatureStore } from '../../../stores/EditFeature.store';
import { mapStore } from '../../../stores/Map.store';
import { mapLabelsStore } from '../../../stores/MapLabels.store';
import { IconButton } from '../../IconButton/IconButton';

import './EditFeatureGeometry-Draw.scss';

const cnEditFeatureGeometryDraw = cn('EditFeatureGeometry', 'Draw');

export const EditFeatureGeometryDraw: FC = observer(() => {
  useEffect(() => {
    return () => {
      mapDrawService.drawOff();
    };
  }, []);

  const drawEnabled = mapStore.toolMode === ToolMode.DRAW;

  const handleClick = useCallback(() => {
    if (!editFeatureStore.editFeaturesData?.features.length) {
      services.logger.error('Нет фичи для редактирования геометрии');

      return;
    }

    if (drawEnabled) {
      mapDrawService.drawOff();
    } else {
      mapLabelsStore.setLabelsVisibility(false);
      void mapDrawService.drawOn(toDrawGeometry(editFeatureStore.geometryType));
    }
  }, [drawEnabled]);

  return (
    <div className={cnEditFeatureGeometryDraw()}>
      <Tooltip title='Редактировать геометрию'>
        <span>
          <IconButton onClick={handleClick} checked={drawEnabled}>
            {drawEnabled ? <Brush color='primary' /> : <BrushOutlined color='primary' />}
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
});
