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
import { Loading } from '../Loading/Loading';
import { IconButton } from '../IconButton/IconButton';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { isVectorFromFile } from '../../services/gis/layers/layers.utils';
import { CrgLayer, CrgLayerType, CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { copyFeaturesBetweenLayers, createFeature } from '../../services/data/vectorData/vectorData.service';
import { SelectSuitableVectorLayerDialog } from '../SelectSuitableVectorLayerDialog/SelectSuitableVectorLayerDialog';
import { communicationService } from '../../services/communication.service';

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
  @observable private busy = false;
  @observable private createdFeatures = 0;

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
          customLoading={
            <Loading noBackdrop visible={this.busy} value={(this.createdFeatures / features.length) * 100} />
          }
          onClose={this.closeDialog}
          onSelect={this.copy}
        />
      </>
    );
  }

  @action.bound
  private closeDialog() {
    if (!this.busy) {
      this.dialogOpen = false;
    }
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action
  private setBusy(isBusy: boolean) {
    this.busy = isBusy;
  }

  @action
  private setCreatedFeatures(createdFeatures: number) {
    this.createdFeatures = createdFeatures;
  }

  @boundMethod
  private async copy([selectedLayer]: CrgVectorLayer[]) {
    this.setCreatedFeatures(0);
    this.setBusy(true);
    try {
      const { layer, features } = this.props;

      if (layer.type === CrgLayerType.VECTOR) {
        await copyFeaturesBetweenLayers(layer, selectedLayer, features);
      } else if (features[0] != null && layer?.type && isVectorFromFile(layer.type)) {
        for (const feature of features) {
          await createFeature(selectedLayer.dataset, selectedLayer.tableName, feature, true);
          this.setCreatedFeatures(this.createdFeatures + 1);
        }
      } else {
        throw new Error('Ошибка копирования объектов: неподдерживаемый тип слоя ' + layer.type);
      }

      Toast.success(
        `Успешно ${pluralize(features.length, 'скопирован', 'скопировано', 'скопировано')} ${
          features.length
        } ${pluralize(features.length, 'объект', 'объекта', 'объектов')}`
      );
      communicationService.featuresUpdated.emit();
    } catch (error) {
      const err = error as AxiosError<{ errors: CopyErrors[]; message?: string }>;

      Toast.error({
        message: err?.response?.data?.message,
        details: err?.response?.data?.errors?.map(item => item.message).join('. ')
      });
    } finally {
      this.setBusy(false);
      this.closeDialog();
    }
  }
}
