import React, { type FC } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { DeleteSweepOutlined, SquareFoot } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { MapAction, ToolMode } from '../../services/map/map.models';
import { mapMeasureService } from '../../services/map/measure/map-measure.service';
import { mapStore } from '../../stores/Map.store';
import { mapMeasureStore } from '../../stores/MapMeasure.store';
import { IconButton } from '../IconButton/IconButton';
import { Ruler } from '../Icons/Ruler';

import './MapMeasure.scss';
import '../HelpMessage/HelpMessage.scss';

const cnMapMeasure = cn('MapMeasure');

function handleMeasureClick(toolMode: ToolMode) {
  mapMeasureService.removeHelpMsg();

  const isActive = mapStore.toolMode === toolMode;
  if (isActive) {
    mapMeasureService.measureOff();
    mapStore.setToolMode(ToolMode.NONE);
  } else {
    mapMeasureService.createMeasureStartTooltip();
    mapMeasureService.measureOn(toolMode);
    mapStore.setToolMode(toolMode);
  }
}

function handleLengthClick() {
  handleMeasureClick(ToolMode.MEASURE_LENGTH);
}

function handleAreaClick() {
  handleMeasureClick(ToolMode.MEASURE_AREA);
}

export const MapMeasure: FC = observer(() => {
  return (
    <div className={cnMapMeasure()}>
      <Tooltip title='Измерить длину'>
        <span>
          <IconButton
            onClick={handleLengthClick}
            checked={mapStore.toolMode === ToolMode.MEASURE_LENGTH}
            size='small'
            disabled={!mapStore.allowedActions.includes(MapAction.MAP_TOOL_MEASURE_LENGTH)}
          >
            <Ruler />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title='Измерить площадь'>
        <span>
          <IconButton
            onClick={handleAreaClick}
            checked={mapStore.toolMode === ToolMode.MEASURE_AREA}
            size='small'
            disabled={!mapStore.allowedActions.includes(MapAction.MAP_TOOL_MEASURE_AREA)}
          >
            <SquareFoot />
          </IconButton>
        </span>
      </Tooltip>
      {Boolean(mapMeasureStore.measureItems.length) && (
        <Tooltip title='Удалить все измерения'>
          <IconButton onClick={mapMeasureService.clearAll} size='small'>
            <DeleteSweepOutlined />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
});
