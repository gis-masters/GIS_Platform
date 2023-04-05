import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { action, observable, makeObservable } from 'mobx';

import { XTableColumn } from '../XTable/XTable.models';
import { currentProject } from '../../stores/CurrentProject.store';
import { schemaService } from '../../services/data/schema/schema.service';
import { isUpdateAllowed } from '../../services/data/permissions/permissions.service';
import { CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';

const cnSelectSuitableVectorLayerDialog = cn('SelectSuitableVectorLayerDialog');

interface SelectSuitableVectorLayerDialogProps {
  currentLayer: CrgVectorLayer;
  features?: WfsFeature[];
  open: boolean;
  onClose(): void;
  onSelect(layer: CrgVectorLayer[]): void;
}

@observer
export class SelectSuitableVectorLayerDialog extends Component<SelectSuitableVectorLayerDialogProps> {
  @observable private layersAvailableForCopy: CrgVectorLayer[];

  private fetchingOperation: Promise<void>;

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
    const { currentLayer, open, onClose, onSelect } = this.props;

    return (
      <ChooseXTableDialog
        description={`Для копирования доступны редактируемые слои, совпадающие по геометрии и проекции ${currentLayer?.nativeCRS}`}
        className={cnSelectSuitableVectorLayerDialog()}
        data={this.layersAvailableForCopy}
        title='Выбор слоя'
        open={open}
        cols={this.layerDialogCols}
        onClose={onClose}
        onSelect={onSelect}
        single
        actionButtonProps={{ children: 'Копировать' }}
      />
    );
  }

  @action.bound
  private setLayersAvailableForCopy(layersAvailableForCopy: CrgVectorLayer[]) {
    this.layersAvailableForCopy = layersAvailableForCopy;
  }

  private async fetchAvailableForCopyingLayers() {
    const schemas = await Promise.all(
      currentProject.vectorLayers.map(({ schemaId }) => schemaService.getSchema(schemaId))
    );

    const currentLayer = this.props.currentLayer;
    const layersUpdatePermissions = [];
    for (const layer of currentProject.vectorableLayers) {
      layersUpdatePermissions.push(await isUpdateAllowed(layer));
    }

    const layersAvailableForCopy = currentProject.vectorLayers.filter((layer, i) => {
      if (!schemas[i]) {
        return false;
      }

      const { geometryType } = schemas[i];

      return (
        currentLayer.complexName !== layer.complexName &&
        currentLayer.nativeCRS === layer.nativeCRS &&
        this.props.features.every(item => item.geometry.type === geometryType) &&
        layersUpdatePermissions[i]
      );
    });

    this.setLayersAvailableForCopy(layersAvailableForCopy);
  }
}
