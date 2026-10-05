import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { ContentCopyOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { pluralize } from 'numeralize-ru';

import { communicationService } from '../../services/communication.service';
import { type Projection } from '../../services/data/projections/projections.models';
import { getProjectionByCode } from '../../services/data/projections/projections.service';
import { createFeature } from '../../services/data/vectorData/vectorData.service';
import { createFeatureId, extractFeatureId } from '../../services/geoserver/featureType/featureType.util';
import { type WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { type CrgLayer, CrgLayerType, type CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { isVectorFromFile } from '../../services/gis/layers/layers.utils';
import { MapMode, MapSelectionTypes } from '../../services/map/map.models';
import { mapService } from '../../services/map/map.service';
import { mapModeService } from '../../services/map/mode/map-mode.service';
import { transformGeometry } from '../../services/util/coordinates-transform.util';
import { isAxiosError } from '../../services/util/typeGuards/isAxiosError';
import { editFeatureStore } from '../../stores/EditFeature.store';
import { IconButton } from '../IconButton/IconButton';
import { Loading } from '../Loading/Loading';
import { PseudoLink } from '../PseudoLink/PseudoLink';
import { SelectSuitableVectorLayerDialog } from '../SelectSuitableVectorLayerDialog/SelectSuitableVectorLayerDialog';
import { Toast } from '../Toast/Toast';

const cnCopyFeaturesButton = cn('CopyFeaturesButton');

interface CopyErrors {
  field: string;
  message: string | string[];
}

interface CopyErrorResponse {
  errors?: CopyErrors[];
  message?: string;
}

function errorMessages(message: string | string[] | undefined): string[] {
  if (!message) {
    return [];
  }

  if (typeof message === 'string') {
    return message.trim() ? [message] : [];
  }

  return message.filter(Boolean);
}

function copyFeatureErrorText(error: unknown): string {
  if (!isAxiosError<CopyErrorResponse>(error)) {
    return error instanceof Error ? error.message : 'Ошибка копирования объекта';
  }

  const data = error.response?.data;
  const parts: string[] = [];

  if (data?.message) {
    parts.push(data.message);
  }

  for (const item of data?.errors ?? []) {
    parts.push(...errorMessages(item.message));
  }

  return joinErrorParts(parts) || error.message;
}

function joinErrorParts(parts: string[]): string {
  const [first, ...rest] = parts.map(part => part.trim()).filter(Boolean);

  if (!first) {
    return '';
  }

  return rest.reduce((text, part) => `${text}${text.endsWith('.') ? ' ' : '. '}${part}`, first);
}

function featureNumber(feature: WfsFeature): string | number {
  try {
    return extractFeatureId(feature.id);
  } catch {
    return feature.id;
  }
}

function copiedObjectsPhrase(count: number): string {
  return `${pluralize(count, 'скопирован', 'скопировано', 'скопировано')} ${count} ${pluralize(count, 'объект', 'объекта', 'объектов')}`;
}

function copyFeatureFailureLine(feature: WfsFeature, error: unknown): string {
  return `объект ${featureNumber(feature)} — ${copyFeatureErrorText(error)}`;
}

function fatalCopyError(error: unknown): { message: string; details?: string } {
  if (!isAxiosError<CopyErrorResponse>(error)) {
    return { message: error instanceof Error ? error.message : 'Ошибка копирования объектов' };
  }

  const data = error.response?.data;
  const message = error.message || data?.message || 'Ошибка копирования объектов';
  const details = data?.errors?.flatMap(item => errorMessages(item.message)).join('. ');

  if (details) {
    return { message, details };
  }

  return { message };
}

async function createCopiedFeature(
  feature: WfsFeature,
  layer: CrgLayer,
  selectedLayer: CrgVectorLayer,
  currentProjection: Projection,
  selectedProjection: Projection
): Promise<WfsFeature> {
  let geometry = feature.geometry;

  if (layer.nativeCRS && layer.nativeCRS !== selectedLayer.nativeCRS && feature.geometry) {
    geometry = transformGeometry(feature.geometry, currentProjection, selectedProjection);
  }

  return createFeature(
    selectedLayer.dataset,
    selectedLayer.resourceId,
    { type: feature.type, geometry, properties: feature.properties },
    { notUpdateFeatures: true, skipGeometryValidation: true }
  );
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
  @observable private processedFeaturesCounter = 0;
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
            <Loading noBackdrop visible={this.busy} value={(this.processedFeaturesCounter / features.length) * 100} />
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
  private setProcessedFeaturesCounter(processedFeaturesCounter: number) {
    this.processedFeaturesCounter = processedFeaturesCounter;
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
  private async copy(selectedLayers: CrgVectorLayer[]) {
    const selectedLayer = selectedLayers[0];

    if (!selectedLayer) {
      Toast.error('Не выбран слой для копирования');

      return;
    }

    this.setSelectedLayer(selectedLayer);
    this.setProcessedFeaturesCounter(0);
    this.setBusy(true);

    try {
      const { layer, features } = this.props;
      const createdFeatures: WfsFeature[] = [];
      const failures: string[] = [];
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

      if (
        layer.type &&
        (layer.type === CrgLayerType.VECTOR ||
          isVectorFromFile(layer.type) ||
          layer.type === CrgLayerType.EXTERNAL_NSPD)
      ) {
        for (const feature of features) {
          try {
            const createdFeature = await createCopiedFeature(
              feature,
              layer,
              selectedLayer,
              currentProjection,
              selectedProjection
            );

            createdFeatures.push(createdFeature);
          } catch (error) {
            failures.push(copyFeatureFailureLine(feature, error));
          }

          this.setProcessedFeaturesCounter(this.processedFeaturesCounter + 1);
        }
      } else {
        Toast.error('Ошибка копирования объектов: неподдерживаемый тип слоя ' + layer.type);

        return;
      }

      this.showCopyResult(createdFeatures, failures);
    } catch (error) {
      Toast.error(fatalCopyError(error));
    } finally {
      this.setBusy(false);
      this.closeDialog();
    }
  }

  private showCopyResult(createdFeatures: WfsFeature[], failures: string[]) {
    const selectedLayer = this.selectedLayer;

    if (createdFeatures.length > 0 && selectedLayer) {
      const featuresWithId: WfsFeature[] = createdFeatures.map(feat => {
        feat.properties.objectid = feat.id;
        feat.id = createFeatureId(selectedLayer.resourceId, selectedLayer.nativeCRS, feat.id);

        return feat;
      });

      const createdCount = createdFeatures.length;
      const message = `Успешно ${copiedObjectsPhrase(createdCount)}. `;

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
    }

    if (failures.length > 0) {
      const failedCount = failures.length;

      Toast.warn({
        message: `Не ${copiedObjectsPhrase(failedCount)}`,
        details: failures.join('\n'),
        autoClose: false
      });
    }
  }

  @boundMethod
  private async positionToCopiedFeatures() {
    await mapModeService.changeMode(
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
