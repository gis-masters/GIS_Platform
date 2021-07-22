import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@material-ui/core';
import { PlaylistAdd } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { MapModes, mapStore } from '../../stores/Map.store';
import { mapSelectionService } from '../../services/map/map-selection.service';

const cnMapSelection = cn('MapSelection');

@observer
export class MapSelection extends Component {
  render() {
    return (
      <Tooltip title='Выбор объектов'>
        <IconButton
          className={cnMapSelection()}
          onClick={this.handleViewModeClick}
          size='small'
          color={mapStore.mode === MapModes.SELECTION ? 'secondary' : 'default'}
        >
          <PlaylistAdd />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private handleViewModeClick(): void {
    mapSelectionService.enableSelectionMode(mapStore.mode === MapModes.SELECTION);
  }
}
