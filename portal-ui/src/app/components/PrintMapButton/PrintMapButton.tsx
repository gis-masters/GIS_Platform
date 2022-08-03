import React, { Component } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@mui/material';
import { Print, PrintOutlined } from '@mui/icons-material';

import { printSettings } from '../../stores/PrintSettings.store';
import { PrintMapDialog } from '../PrintMapDialog/PrintMapDialog';
import { Loading } from '../Loading/Loading';

import '!style-loader!css-loader!sass-loader!./PrintMapButton.scss';

const cnPrintMapButton = cn('PrintMapButton');

@observer
export class PrintMapButton extends Component {
  @observable private dialogOpen = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Распечатать карту (PDF)'>
          <IconButton className={cnPrintMapButton()} onClick={this.openDialog} color='inherit'>
            {this.dialogOpen ? <Print /> : <PrintOutlined />}
          </IconButton>
        </Tooltip>

        <PrintMapDialog onClose={this.closeDialog} open={this.dialogOpen} directlyPrint allowJpg />

        <Loading className={cnPrintMapButton('Loading')} visible={printSettings.printingInProcess} />
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
