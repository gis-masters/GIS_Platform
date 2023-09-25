import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { mapStore } from '../../../stores/Map.store';
import { mapSelectionService } from '../../../services/map/map-selection.service';
import { RectangleSelectionCancel } from '../../Icons/RectangleSelectionCancel';
import { IconButton } from '../../IconButton/IconButton';

const cnMapSelectionCancel = cn('MapSelection', 'Cancel');

@observer
export class MapSelectionCancel extends Component {
  @observable private timer = 0;
  @observable private escKeyPressed = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

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
        <Tooltip title='Снять выделение (Esc, Esc)'>
          <IconButton
            disabled={!mapStore.selectedFeatures.length}
            className={cnMapSelectionCancel()}
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
    mapSelectionService.selectFeatures([]);
  }
}
