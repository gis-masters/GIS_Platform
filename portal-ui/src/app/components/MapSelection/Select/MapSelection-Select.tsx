import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { MapAction, ToolMode } from '../../../services/map/map.models';
import { mapStore } from '../../../stores/Map.store';
import { IconButton } from '../../IconButton/IconButton';
import { RectangleSelectionAdd } from '../../Icons/RectangleSelectionAdd';

const cnMapSelectionSelect = cn('MapSelection', 'Select');

const tooltipMsg = (
  <>
    <div>Выделение рамкой</div>
    <div>Shift + ЛКМ — добавляет объекты</div>
    <div>Ctrl + ЛКМ — снимает выделение с объектов</div>
  </>
);

export const MapSelectionSelect = observer(() => {
  const handleViewModeClick = useCallback((): void => {
    mapStore.setToolMode(mapStore.toolMode === ToolMode.SELECTION ? ToolMode.NONE : ToolMode.SELECTION);
  }, []);

  return (
    <Tooltip title={tooltipMsg}>
      <IconButton
        className={cnMapSelectionSelect()}
        onClick={handleViewModeClick}
        size='small'
        checked={mapStore.toolMode === ToolMode.SELECTION}
        disabled={!mapStore.allowedActions.includes(MapAction.MAP_SELECTION)}
      >
        <RectangleSelectionAdd />
      </IconButton>
    </Tooltip>
  );
});
