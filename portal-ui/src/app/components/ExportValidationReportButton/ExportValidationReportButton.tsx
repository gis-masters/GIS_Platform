import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { GetApp, GetAppOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { ExportValidationReportDialog } from '../ExportValidationReportDialog/ExportValidationReportDialog';

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
          <span>
            <IconButton
              className={cnExportValidationReportButton()}
              disabled={!layers.length}
              onClick={this.openDialog}
              color='primary'
            >
              {this.open ? <GetApp /> : <GetAppOutlined />}
            </IconButton>
          </span>
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
