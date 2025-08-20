import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

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

@observer
export class MapSelectionSelect extends Component {
  render() {
    return (
      <Tooltip title={tooltipMsg}>
        <IconButton
          className={cnMapSelectionSelect()}
          onClick={this.handleViewModeClick}
          size='small'
          checked={mapStore.toolMode === ToolMode.SELECTION}
          disabled={!mapStore.allowedActions.includes(MapAction.MAP_SELECTION)}
        >
          <RectangleSelectionAdd />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private handleViewModeClick() {
    mapStore.setToolMode(mapStore.toolMode === ToolMode.SELECTION ? ToolMode.NONE : ToolMode.SELECTION);
  }
}
