import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Dialog, DialogContent, DialogActions, IconButton, Tooltip } from '@material-ui/core';
import { Print } from '@material-ui/icons';

import { openLayersService } from '../../services/open-layer/open-layers.service';
import { printSettings } from '../../stores/PrintSettings.store';
import { Button } from '../Button/Button';
import { PrintDialog } from '../PrintDialog/PrintDialog';
import { Loading } from '../Loading/Loading';

import '!style-loader!css-loader!sass-loader!./PrintButton.scss';

const cnPrintButton = cn('PrintButton');

@observer
export class PrintButton extends Component {
  @observable private dialogOpen = false;

  constructor (props: {}) {
    super(props);

    this.keyHandler = this.keyHandler.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.print = this.print.bind(this);
  }

  render () {
    return (
      <>
        <Tooltip title='Распечатать карту (PDF)'>
          <IconButton className={cnPrintButton()} onClick={this.openDialog}>
            <Print />
          </IconButton>
        </Tooltip>
        <Dialog open={this.dialogOpen} onKeyDown={this.keyHandler}>
          <DialogContent>
            <PrintDialog onSubmit={this.print} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.print} color='primary' variant='outlined'>
              Печать
            </Button>
            <Button onClick={this.closeDialog} variant='outlined'>
              Отмена
            </Button>
          </DialogActions>
        </Dialog>
        <Loading className={cnPrintButton('Loading')} visible={printSettings.printingInProcess} />
      </>
    );
  }

  private print () {
    openLayersService.print();
    this.closeDialog();
  }

  private keyHandler (e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' && e.ctrlKey) {
      this.print();
    }
    if (e.key === 'Escape') {
      this.closeDialog();
    }
  }

  @action
  private openDialog () {
    this.dialogOpen = true;
  }

  @action
  private closeDialog () {
    this.dialogOpen = false;
  }
}
