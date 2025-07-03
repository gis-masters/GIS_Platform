import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { GetApp, GetAppOutlined } from '@mui/icons-material';

import { MapAction } from '../../services/map/map.models';
import { mapStore } from '../../stores/Map.store';
import { ExportGmlDialog } from '../ExportGmlDialog/ExportGmlDialog';

@observer
export class ExportGmlButton extends Component {
  @observable private open = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Выгрузка GML'>
          <span>
            <IconButton
              onClick={this.openDialog}
              color='inherit'
              disabled={!mapStore.allowedActions.includes(MapAction.EXPORT_GML)}
            >
              {this.open ? <GetApp /> : <GetAppOutlined />}
            </IconButton>
          </span>
        </Tooltip>

        <ExportGmlDialog open={this.open} onClose={this.onClose} />
      </>
    );
  }

  @action.bound
  private openDialog() {
    this.open = true;
  }

  @action.bound
  private onClose() {
    this.open = false;
  }
}
