import React, { Component } from 'react';
import { AxiosError } from 'axios';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { pluralize } from 'numeralize-ru';
import { boundMethod } from 'autobind-decorator';
import { action, observable, makeObservable } from 'mobx';
import { ContentCopyOutlined } from '@mui/icons-material';

import { Toast } from '../Toast/Toast';
import { IconButton } from '../IconButton/IconButton';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { CrgVectorLayer } from '../../services/gis/projects.models';
import { copyFeaturesBetweenLayers } from '../../services/data/data.service';
import { SelectSuitableVectorLayerDialog } from '../SelectSuitableVectorLayerDialog/SelectSuitableVectorLayerDialog';

interface CopyErrors {
  field: string;
  message: string[];
}

interface CopyFeaturesButtonProps {
  tooltipTitle: string;
  layer: CrgVectorLayer;
  features: WfsFeature[];
}

@observer
export class CopyFeaturesButton extends Component<CopyFeaturesButtonProps> {
  @observable private dialogOpen = false;

  constructor(props: CopyFeaturesButtonProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { tooltipTitle, layer } = this.props;

    return (
      <>
        <Tooltip title={tooltipTitle}>
          <IconButton size='small' onClick={this.openDialog}>
            <ContentCopyOutlined fontSize='small' />
          </IconButton>
        </Tooltip>

        <SelectSuitableVectorLayerDialog
          currentLayer={layer}
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
      const { layer, features } = this.props;

      await copyFeaturesBetweenLayers(layer, selectedLayer, features);

      Toast.success(
        `Успешно ${pluralize(features.length, 'скопирован', 'скопировано', 'скопировано')} ${
          features.length
        } ${pluralize(features.length, 'объект', 'объекта', 'объектов')}`
      );
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
