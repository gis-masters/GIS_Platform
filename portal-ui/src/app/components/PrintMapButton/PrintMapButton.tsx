import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { Print, PrintOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { MapAction } from '../../services/map/map.models';
import { mapStore } from '../../stores/Map.store';
import { printSettings } from '../../stores/PrintSettings.store';
import { Loading } from '../Loading/Loading';
import { PrintMapDialog } from '../PrintMapDialog/PrintMapDialog';

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
          <span>
            <IconButton
              className={cnPrintMapButton()}
              onClick={this.openDialog}
              color='inherit'
              disabled={!mapStore.allowedActions.includes(MapAction.PRINT_MAP_PDF)}
            >
              {this.dialogOpen ? <Print /> : <PrintOutlined />}
            </IconButton>
          </span>
        </Tooltip>

        <PrintMapDialog onClose={this.closeDialog} open={this.dialogOpen} directlyPrint allowPdf allowJpg />

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
