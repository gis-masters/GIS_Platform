import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { action, observable } from 'mobx';

import { mapStore } from '../../stores/Map.store';
import { IconButton } from '../IconButton/IconButton';
import { mapService } from '../../services/map/map.service';
import { RectangleSelectionCancel } from '../Icons/RectangleSelectionCancel';

const cnCancelSelection = cn('CancelSelection');

@observer
export class CancelSelection extends Component {
  @observable private timer = 0;
  @observable private escKeyPressed = false;

  componentDidMount() {
    document.addEventListener('keydown', this.keydownHandler);
    document.addEventListener('keyup', this.keyupHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydownHandler);
    document.removeEventListener('keyup', this.keyupHandler);
  }

  render() {
    return (
      Boolean(mapStore.selectedFeatures.length) && (
        <Tooltip title='Очистка выделенных на карте объектов (Esc+Esc)'>
          <IconButton
            disabled={!mapStore.selectedFeatures.length}
            className={cnCancelSelection()}
            onClick={this.clearSelectedFeatures}
            size='small'
          >
            <RectangleSelectionCancel />
          </IconButton>
        </Tooltip>
      )
    );
  }

  @boundMethod
  private keydownHandler(event: KeyboardEvent): void {
    clearTimeout(this.timer);

    if (this.escKeyPressed && event.key === 'Escape') {
      this.clearSelectedFeatures();
    }
  }

  @boundMethod
  private keyupHandler(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.setEscKeyState(true);
    }

    this.setTimer(
      window.setTimeout(() => {
        this.setEscKeyState(false);
      }, 400)
    );
  }

  @action
  private setEscKeyState(status: boolean): void {
    this.escKeyPressed = status;
  }

  @action
  private setTimer(timer: number): void {
    this.timer = timer;
  }

  @boundMethod
  private clearSelectedFeatures(): void {
    mapStore.setSelectedFeatures([]);
    mapService.highlightFeatures([]);

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
  }
}
