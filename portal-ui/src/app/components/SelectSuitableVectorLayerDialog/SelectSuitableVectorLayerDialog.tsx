import React, { Component, ReactNode } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { action, observable, makeObservable } from 'mobx';

import { XTableColumn } from '../XTable/XTable.models';
import { currentProject } from '../../stores/CurrentProject.store';
import { getLayerSchema } from '../../services/gis/layers/layers.service';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { CrgLayer, CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { GeometryType, WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { isUpdateAllowed } from '../../services/data/permissions/permissions.service';
import { isLinear, isPolygonal, isPoint } from '../../services/geoserver/wfs/wfs.util';

import '!style-loader!css-loader!sass-loader!./SelectSuitableVectorLayerDialog.scss';

const cnSelectSuitableVectorLayerDialog = cn('SelectSuitableVectorLayerDialog');

interface SelectSuitableVectorLayerDialogProps {
  currentLayer: CrgLayer;
  features?: WfsFeature[];
  open: boolean;
  customLoading?: ReactNode;
  onClose(): void;
  onSelect(layer: CrgVectorLayer[]): void;
}

@observer
export class SelectSuitableVectorLayerDialog extends Component<SelectSuitableVectorLayerDialogProps> {
  @observable private layersAvailableForCopy: CrgVectorLayer[] = [];
  @observable private busy = false;

  private fetchingOperation?: Promise<void>;
  private readonly layerDialogCols: XTableColumn<CrgVectorLayer>[] = [
    {
      field: 'title',
      title: 'Название',
      filterable: true
    }
  ];

  constructor(props: SelectSuitableVectorLayerDialogProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidUpdate(prevProps: Readonly<SelectSuitableVectorLayerDialogProps>): Promise<void> {
    const { open, currentLayer, features } = this.props;
    if ((currentLayer && currentLayer.id !== prevProps.currentLayer.id) || features !== prevProps.features) {
      delete this.fetchingOperation;

      this.fetchingOperation = this.fetchAvailableForCopyingLayers();
      await this.fetchingOperation;
    }

    if (!prevProps.open && open && !this.fetchingOperation) {
      this.fetchingOperation = this.fetchAvailableForCopyingLayers();
      await this.fetchingOperation;
    }
  }

  render() {
    const { currentLayer, open, customLoading, features, onClose, onSelect } = this.props;

    return (
      <ChooseXTableDialog
        className={cnSelectSuitableVectorLayerDialog()}
        data={this.layersAvailableForCopy}
        title='Выбор слоя'
        open={open}
        cols={this.layerDialogCols}
        onClose={onClose}
        onSelect={onSelect}
        loading={this.busy}
        single
        afterTable={customLoading}
        actionButtonProps={{ children: 'Копировать' }}
        additionalAction={
          <div className={cnSelectSuitableVectorLayerDialog('Description')}>
            Для копирования доступны <b>редактируемые</b> слои, совпадающие по типу геометрии&nbsp;(
            {features && features[0]?.geometry?.type}) и&nbsp;проекции&nbsp;({currentLayer?.nativeCRS})
          </div>
        }
      />
    );
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @action.bound
  private setLayersAvailableForCopy(layersAvailableForCopy: CrgVectorLayer[]) {
    this.layersAvailableForCopy = layersAvailableForCopy;
  }

  private async fetchAvailableForCopyingLayers() {
    this.setBusy(true);
    const schemas = await Promise.all(currentProject.vectorLayers.map(layer => getLayerSchema(layer)));

    const { currentLayer, features } = this.props;
    const layersUpdatePermissions: boolean[] = [];
    for (const layer of currentProject.vectorableLayers) {
      layersUpdatePermissions.push(await isUpdateAllowed(layer));
    }
    const layersAvailableForCopy = currentProject.vectorLayers.filter((layer, i) => {
      if (!schemas[i]) {
        return false;
      }

      const { geometryType } = schemas[i];

      if (features && geometryType) {
        return (
          currentLayer.complexName !== layer.complexName &&
          currentLayer.nativeCRS === layer.nativeCRS &&
          this.isCompatibleByGeometry(features, geometryType) &&
          layersUpdatePermissions[i]
        );
      }

      return false;
    });

    this.setBusy(false);
    this.setLayersAvailableForCopy(layersAvailableForCopy);
  }

  private isCompatibleByGeometry(features: WfsFeature[], geometryType: GeometryType): boolean {
    return features?.every(
      ({ geometry }) =>
        geometry.type === geometryType ||
        isLinear(geometryType, geometry.type) ||
        isPolygonal(geometryType, geometry.type) ||
        isPoint(geometryType, geometry.type)
    );
  }
}
