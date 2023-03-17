import React, { Component } from 'react';
import { AxiosError } from 'axios';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { action, observable, makeObservable } from 'mobx';
import { ContentCopyOutlined } from '@mui/icons-material';

import { Toast } from '../Toast/Toast';
import { IconButton } from '../IconButton/IconButton';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { CrgVectorLayer } from '../../services/gis/projects/projects.models';
import { createFeature } from '../../services/data/vectorData/vectorData.service';
import { SelectSuitableVectorLayerDialog } from '../SelectSuitableVectorLayerDialog/SelectSuitableVectorLayerDialog';

interface CopyErrors {
  field: string;
  message: string[];
}

interface CopyFeatureButtonProps {
  layer: CrgVectorLayer;
  feature: WfsFeature;
}

@observer
export class CopyFeatureButton extends Component<CopyFeatureButtonProps> {
  @observable private dialogOpen = false;

  constructor(props: CopyFeatureButtonProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Копировать объект в другой слой'>
          <IconButton onClick={this.openDialog}>
            <ContentCopyOutlined />
          </IconButton>
        </Tooltip>

        <SelectSuitableVectorLayerDialog
          currentLayer={this.props.layer}
          features={[this.props.feature]}
          open={this.dialogOpen}
          onClose={this.closeDialog}
          onSelect={this.copy}
        />
      </>
    );
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @boundMethod
  private async copy([selectedLayer]: CrgVectorLayer[]) {
    try {
      const featureForCopy = {
        ...this.props.feature,
        id: undefined,
        geometry_name: undefined
      };

      await createFeature(selectedLayer.dataset, selectedLayer.tableName, featureForCopy);

      Toast.success('Объект успешно скопирован');
    } catch (error) {
      const err = error as AxiosError<{ errors: CopyErrors[]; message?: string }>;

      Toast.error({
        message: err?.response?.data?.message,
        details: err?.response?.data?.errors?.map(item => item.message).join('. ')
      });
    } finally {
      this.closeDialog();
    }
  }
}
