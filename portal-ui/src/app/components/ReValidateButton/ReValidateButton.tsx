import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { Loop, LoopOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { ValidateLayersDialog } from '../ValidateLayersDialog/ValidateLayersDialog';

const cnReValidateButton = cn('ReValidateButton');

@observer
export class ReValidateButton extends Component {
  @observable private open = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Выполнить проверку данных'>
          <IconButton className={cnReValidateButton()} onClick={this.openDialog} color='primary'>
            {this.open ? <Loop /> : <LoopOutlined />}
          </IconButton>
        </Tooltip>
        <ValidateLayersDialog open={this.open} onClose={this.onClose} />
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
