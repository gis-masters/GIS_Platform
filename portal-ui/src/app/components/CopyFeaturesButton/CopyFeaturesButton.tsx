import React, { Component } from 'react';
import { AxiosError } from 'axios';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { pluralize } from 'numeralize-ru';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { action, observable, makeObservable } from 'mobx';
import { ContentCopyOutlined } from '@mui/icons-material';

import { Toast } from '../Toast/Toast';
import { IconButton } from '../IconButton/IconButton';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { isVectorFromFile } from '../../services/gis/layers/layers.utils';
import { CrgLayer, CrgLayerType, CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { copyFeaturesBetweenLayers, createFeature } from '../../services/data/vectorData/vectorData.service';
import { SelectSuitableVectorLayerDialog } from '../SelectSuitableVectorLayerDialog/SelectSuitableVectorLayerDialog';

const cnCopyFeaturesButton = cn('CopyFeaturesButton');

interface CopyErrors {
  field: string;
  message: string[];
}

interface CopyFeaturesButtonProps {
  tooltipTitle: string;
  layer: CrgLayer;
  features: WfsFeature[];
  size?: 'small' | 'medium';
}

@observer
export class CopyFeaturesButton extends Component<CopyFeaturesButtonProps> {
  @observable private dialogOpen = false;

  constructor(props: CopyFeaturesButtonProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { tooltipTitle, layer, features, size } = this.props;

    return (
      <>
        <Tooltip title={tooltipTitle}>
          <IconButton className={cnCopyFeaturesButton()} size={size} onClick={this.openDialog}>
            <ContentCopyOutlined fontSize={size} />
          </IconButton>
        </Tooltip>

        <SelectSuitableVectorLayerDialog
          currentLayer={layer}
          open={this.dialogOpen}
          features={features}
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

      if (layer.type === CrgLayerType.VECTOR) {
        await copyFeaturesBetweenLayers(layer, selectedLayer, features);
      } else if (features[0] != null && isVectorFromFile(layer.type)) {
        await createFeature(selectedLayer.dataset, selectedLayer.tableName, features[0]);
      } else {
        throw new Error('Ошибка копирования объектов: неподдерживаемый тип слоя ' + layer.type);
      }

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
