import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { MapAction } from '../../../services/map/map.models';
import { mapSelectionService } from '../../../services/map/map-selection.service';
import { mapStore } from '../../../stores/Map.store';
import { IconButton } from '../../IconButton/IconButton';
import { RectangleSelectionCancel } from '../../Icons/RectangleSelectionCancel';

const cnMapSelectionCancel = cn('MapSelection', 'Cancel');

@observer
export class MapSelectionCancel extends Component {
  private timer = 0;
  private escKeyPressed = false;

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('keyup', this.handleKeyup);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('keyup', this.handleKeyup);
  }

  render() {
    return (
      <Tooltip title='Снять выделение (Esc, Esc)'>
        <IconButton
          disabled={!mapStore.selectedFeatures.length || !mapStore.allowedActions.includes(MapAction.MAP_SELECTION)}
          className={cnMapSelectionCancel()}
          onClick={this.clearSelectedFeatures}
          size='small'
        >
          <RectangleSelectionCancel />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private handleKeydown(event: KeyboardEvent): void {
    clearTimeout(this.timer);

    if (this.escKeyPressed && event.key === 'Escape') {
      this.clearSelectedFeatures();
    }
  }

  @boundMethod
  private handleKeyup(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.escKeyPressed = true;
    }

    this.timer = window.setTimeout(() => {
      this.escKeyPressed = false;
    }, 400);
  }

  private clearSelectedFeatures(): void {
    mapSelectionService.selectFeatures([]);
  }
}
