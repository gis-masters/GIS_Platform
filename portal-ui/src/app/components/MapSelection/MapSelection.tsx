import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { MapMode, mapStore } from '../../stores/Map.store';
import { mapSelectionService } from '../../services/map/map-selection.service';
import { RectangleSelectionAdd } from '../Icons/RectangleSelectionAdd';
import { IconButton } from '../IconButton/IconButton';

const cnMapSelection = cn('MapSelection');

const tooltipMsg = (
  <>
    <div>Выделение рамкой</div>
    <div>Shift + ЛКМ - добавляет объекты</div>
    <div>Ctrl + ЛКМ - снимает выделение с объектов</div>
  </>
);

@observer
export class MapSelection extends Component {
  render() {
    return (
      <Tooltip title={tooltipMsg}>
        <IconButton
          className={cnMapSelection()}
          onClick={this.handleViewModeClick}
          size='small'
          checked={mapStore.mode === MapMode.SELECTION}
        >
          <RectangleSelectionAdd />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private handleViewModeClick(): void {
    mapSelectionService.enableSelectionMode(mapStore.mode === MapMode.SELECTION);
  }
}
