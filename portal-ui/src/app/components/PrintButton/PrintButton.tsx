import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Dialog, DialogContent, DialogActions, IconButton, Tooltip } from '@material-ui/core';
import { Print, PrintOutlined } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';

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

  render() {
    return (
      <>
        <Tooltip title='Распечатать карту (PDF)'>
          <IconButton className={cnPrintButton()} onClick={this.openDialog} color='inherit'>
            {this.dialogOpen ? <Print /> : <PrintOutlined />}
          </IconButton>
        </Tooltip>
        <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
          <DialogContent>
            <PrintDialog onSubmit={this.print} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.print} color='primary'>
              Печать
            </Button>
            <Button onClick={this.closeDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
        <Loading className={cnPrintButton('Loading')} visible={printSettings.printingInProcess} />
      </>
    );
  }

  @boundMethod
  private print() {
    openLayersService.print();
    this.closeDialog();
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
