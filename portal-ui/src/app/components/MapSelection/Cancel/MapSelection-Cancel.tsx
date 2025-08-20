import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { mapModeManager } from '../../../services/map/a-map-mode/MapModeManager';
import { selectedFeaturesStore } from '../../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { MapAction, MapMode } from '../../../services/map/map.models';
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
      <Tooltip title='Снять выделение со всех объектов (Esc, Esc)'>
        <span>
          <IconButton
            disabled={
              !selectedFeaturesStore.features.length || !mapStore.allowedActions.includes(MapAction.MAP_SELECTION)
            }
            className={cnMapSelectionCancel()}
            onClick={this.clearSelectedFeatures}
            size='small'
          >
            <RectangleSelectionCancel />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  @boundMethod
  private handleKeydown(event: KeyboardEvent): void {
    clearTimeout(this.timer);

    if (this.escKeyPressed && event.key === 'Escape') {
      void this.clearSelectedFeatures();
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

  private async clearSelectedFeatures(): Promise<void> {
    await mapModeManager.changeMode(MapMode.NONE, undefined, 'clearSelectedFeatures');
  }
}
