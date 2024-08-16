import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Adjust } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { mapLabelsService } from '../../services/map/map-labels.service';
import { mapStore } from '../../stores/Map.store';
import { IconButton } from '../IconButton/IconButton';

const cnMapTurningPoints = cn('MapTurningPoints');

@observer
export class MapTurningPoints extends Component {
  render() {
    return (
      <Tooltip
        title={
          mapStore.selectedFeatures.length === 1
            ? 'Добавить поворотные точки'
            : 'Поворотные точки включаются только при выборе одного объекта'
        }>
        <span>
          <IconButton
            disabled={mapStore.selectedFeatures.length !== 1}
            className={cnMapTurningPoints()}
            onClick={this.handleTurningPointsClick}
            size='small'>
            <Adjust />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  private async handleTurningPointsClick() {
    await mapLabelsService.addTurningPoints();
  }
}
