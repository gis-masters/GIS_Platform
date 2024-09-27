import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Adjust } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { mapLabelsService } from '../../services/map/map-labels.service';
import { mapStore } from '../../stores/Map.store';
import { sidebars } from '../../stores/Sidebars.store';
import { IconButton } from '../IconButton/IconButton';

const cnMapTurningPoints = cn('MapTurningPoints');

@observer
export class MapTurningPoints extends Component {
  render() {
    const disabled =
      !mapStore.selectedFeatures.length ||
      (mapStore.selectedFeatures.length > 1 && sidebars.editFeaturesData?.features.length !== 1);

    return (
      <Tooltip
        title={`Подписать поворотные точки${mapStore.selectedFeatures.length ? '' : ' (доступно только для выбранного объекта)'}`}
      >
        <span>
          <IconButton
            disabled={disabled}
            className={cnMapTurningPoints()}
            onClick={this.handleTurningPointsClick}
            size='small'
          >
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
