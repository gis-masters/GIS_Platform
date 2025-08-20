import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { ContentCopyOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';
import { pluralize } from 'numeralize-ru';

import { communicationService } from '../../services/communication.service';
import { getProjectionByCode } from '../../services/data/projections/projections.service';
import { createFeature } from '../../services/data/vectorData/vectorData.service';
import { createFeatureId } from '../../services/geoserver/featureType/featureType.util';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { CrgLayer, CrgLayerType, CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { isVectorFromFile } from '../../services/gis/layers/layers.utils';
import { editFeatureStore } from '../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { mapModeManager } from '../../services/map/a-map-mode/MapModeManager';
import { MapMode, MapSelectionTypes } from '../../services/map/map.models';
import { mapService } from '../../services/map/map.service';
import { transformGeometry } from '../../services/util/coordinates-transform.util';
import { IconButton } from '../IconButton/IconButton';
import { Loading } from '../Loading/Loading';
import { PseudoLink } from '../PseudoLink/PseudoLink';
import { SelectSuitableVectorLayerDialog } from '../SelectSuitableVectorLayerDialog/SelectSuitableVectorLayerDialog';
import { Toast } from '../Toast/Toast';

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
  @observable private createdFeaturesCounter = 0;
  @observable private wfsFeatures: WfsFeature[] = [];
  @observable private selectedLayer: CrgVectorLayer | null = null;

  constructor(props: CopyFeaturesButtonProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { tooltipTitle, layer, features, size } = this.props;

    return (
      <>
        <Tooltip title={tooltipTitle}>
          <span>
            <IconButton
              className={cnCopyFeaturesButton()}
              size={size}
              onClick={this.openDialog}
              disabled={editFeatureStore.dirty}
            >
              <ContentCopyOutlined fontSize={size} />
            </IconButton>
          </span>
        </Tooltip>

        <SelectSuitableVectorLayerDialog
          currentLayer={layer}
          open={this.dialogOpen}
          features={features}
          customLoading={
            <Loading noBackdrop visible={this.busy} value={(this.createdFeaturesCounter / features.length) * 100} />
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
  private setCreatedFeaturesCounter(createdFeaturesCounter: number) {
    this.createdFeaturesCounter = createdFeaturesCounter;
  }

  @action
  private setWfsFeature(wfsFeatures: WfsFeature[]) {
    this.wfsFeatures = wfsFeatures;
  }
  @action
  private setSelectedLayer(selectedLayer: CrgVectorLayer) {
    this.selectedLayer = selectedLayer;
  }

  @boundMethod
  private async copy([selectedLayer]: CrgVectorLayer[]) {
    this.setSelectedLayer(selectedLayer);
    this.setCreatedFeaturesCounter(0);
    this.setBusy(true);

    try {
      const { layer, features } = this.props;
      const createdFeatures: WfsFeature[] = [];
      if (!layer.nativeCRS) {
        throw new Error(`Отсутствует nativeCRS у слоя "${layer.title}"`);
      }
      const selectedProjection = await getProjectionByCode(selectedLayer.nativeCRS);
      if (!selectedProjection) {
        throw new Error(`Не найдена проекция "${selectedLayer.nativeCRS}" для слоя "${selectedLayer.title}"`);
      }

      const currentProjection = await getProjectionByCode(layer.nativeCRS);
      if (!currentProjection) {
        throw new Error(`Не найдена проекция "${layer.nativeCRS}" для слоя "${layer.title}"`);
      }

      if (layer.type && (layer.type === CrgLayerType.VECTOR || isVectorFromFile(layer.type))) {
        for (const feature of features) {
          if (layer.nativeCRS && layer.nativeCRS !== selectedLayer.nativeCRS && feature.geometry) {
            feature.geometry = transformGeometry(feature.geometry, currentProjection, selectedProjection);
          }

          const createdFeature = await createFeature(selectedLayer.dataset, selectedLayer.tableName, feature, true);

          createdFeatures.push(createdFeature);
          this.setCreatedFeaturesCounter(this.createdFeaturesCounter + 1);
        }
      } else {
        Toast.error('Ошибка копирования объектов: неподдерживаемый тип слоя ' + layer.type);

        return;
      }

      const featuresWithId: WfsFeature[] = createdFeatures.map(feat => {
        feat.properties.objectid = feat.id;
        feat.id = createFeatureId(selectedLayer.tableName, selectedLayer.nativeCRS, feat.id);

        return feat;
      });

      const message = `Успешно ${pluralize(features.length, 'скопирован', 'скопировано', 'скопировано')}
          ${features.length}
          ${pluralize(features.length, 'объект', 'объекта', 'объектов')}. `;

      this.setWfsFeature(featuresWithId);

      Toast.success(
        <>
          {message}
          <PseudoLink className={cnCopyFeaturesButton('GoTo')} onClick={this.positionToCopiedFeatures}>
            Открыть скопированные объекты
          </PseudoLink>
        </>,
        { duration: 15_000 }
      );

      communicationService.featuresUpdated.emit();
    } catch (error) {
      const err = error as AxiosError<{ errors: CopyErrors[]; message?: string }>;

      Toast.error({
        message: err?.message || err?.response?.data?.message,
        details: err?.response?.data?.errors?.map(item => item.message).join('. ')
      });
    } finally {
      this.setBusy(false);
      this.closeDialog();
    }
  }

  @boundMethod
  private async positionToCopiedFeatures() {
    await mapModeManager.changeMode(
      MapMode.SELECTED_FEATURES,
      {
        payload: {
          features: this.wfsFeatures,
          type: MapSelectionTypes.REPLACE
        }
      },
      'positionToCopiedFeatures'
    );

    await mapService.positionToFeatures(this.wfsFeatures);

    if (this.selectedLayer) {
      communicationService.openAttributesBar.emit(this.selectedLayer);
    }
  }
}
