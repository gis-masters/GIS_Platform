import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { mapStore } from '../../../stores/Map.store';
import { MapMode } from '../../../services/map/map.models';
import { mapSelectionService } from '../../../services/map/map-selection.service';
import { RectangleSelectionAdd } from '../../Icons/RectangleSelectionAdd';
import { IconButton } from '../../IconButton/IconButton';

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
