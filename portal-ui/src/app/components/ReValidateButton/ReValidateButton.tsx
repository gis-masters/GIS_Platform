import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { LoopOutlined, Loop } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { ValidateLayersDialog } from '../ValidateLayersDialog/ValidateLayersDialog';

const cnReValidateButton = cn('ReValidateButton');

@observer
export class ReValidateButton extends Component {
  @observable private open = false;

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
