import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@mui/material';
import { GetApp, GetAppOutlined } from '@mui/icons-material';

import { ExportValidationReportDialog } from '../ExportValidationReportDialog/ExportValidationReportDialog';
import { CrgVectorLayer } from '../../services/gis/layers/layers.models';

const cnExportValidationReportButton = cn('ExportValidationReportButton');

interface ExportValidationReportButtonProps {
  layers: CrgVectorLayer[];
}

@observer
export class ExportValidationReportButton extends Component<ExportValidationReportButtonProps> {
  @observable private open = false;

  constructor(props: ExportValidationReportButtonProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { layers } = this.props;

    return (
      <>
        <Tooltip title='Выгрузка отчета об ошибках'>
          <IconButton
            className={cnExportValidationReportButton()}
            disabled={!layers.length}
            onClick={this.openDialog}
            color='primary'
          >
            {this.open ? <GetApp /> : <GetAppOutlined />}
          </IconButton>
        </Tooltip>
        <ExportValidationReportDialog layers={layers} open={this.open} onClose={this.onClose} />
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
