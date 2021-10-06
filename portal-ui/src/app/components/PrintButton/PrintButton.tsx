import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@mui/material';
import { Print, PrintOutlined } from '@mui/icons-material';

import { printSettings } from '../../stores/PrintSettings.store';
import { PrintDialog } from '../PrintDialog/PrintDialog';
import { Loading } from '../Loading/Loading';

import '!style-loader!css-loader!sass-loader!./PrintButton.scss';

const cnPrintButton = cn('PrintButton');

@observer
export class PrintButton extends Component {
  @observable private dialogOpen = false;

  render() {
    return (
      <>
        <Tooltip title='Распечатать карту (PDF)'>
          <IconButton className={cnPrintButton()} onClick={this.openDialog} color='inherit'>
            {this.dialogOpen ? <Print /> : <PrintOutlined />}
          </IconButton>
        </Tooltip>

        <PrintDialog onClose={this.closeDialog} open={this.dialogOpen} />

        <Loading className={cnPrintButton('Loading')} visible={printSettings.printingInProcess} />
      </>
    );
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }
}
