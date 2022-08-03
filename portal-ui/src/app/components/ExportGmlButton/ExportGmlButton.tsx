import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, makeObservable } from 'mobx';
import { GetApp, GetAppOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

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
          <IconButton onClick={this.openDialog} color='inherit'>
            {this.open ? <GetApp /> : <GetAppOutlined />}
          </IconButton>
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
