import React, { Component, ReactNode } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { WarningAmberOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { pluralize } from 'numeralize-ru';

import { getProjectionByCode } from '../../services/data/projections/projections.service';
import { GeometryType, WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { isLinear, isPoint, isPolygonal } from '../../services/geoserver/wfs/wfs.util';
import { CrgLayer, CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { getLayerSchema } from '../../services/gis/layers/layers.service';
import { isUpdateAllowed } from '../../services/permissions/permissions.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { XTableColumn } from '../XTable/XTable.models';

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
  @observable warningContent: string | null = null;
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
    const { open, customLoading, features, onClose, onSelect } = this.props;

    return (
      <ChooseXTableDialog
        className={cnSelectSuitableVectorLayerDialog()}
        data={this.layersAvailableForCopy}
        title='Выбор слоя'
        open={open}
        cols={this.layerDialogCols}
        onClose={onClose}
        onSelect={onSelect}
        onChange={this.onChange}
        loading={this.busy}
        single
        afterTable={customLoading}
        actionButtonProps={{
          children: 'Копировать',
          startIcon: this.warningContent ? (
            <Tooltip title={this.warningContent}>
              <WarningAmberOutlined color='warning' />
            </Tooltip>
          ) : null
        }}
        additionalAction={
          <div className={cnSelectSuitableVectorLayerDialog('Description')}>
            Для копирования доступны <b>редактируемые</b> слои, совпадающие по типу геометрии&nbsp;(
            {features && features[0]?.geometry?.type})
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

  @boundMethod
  private async onChange(selected: CrgVectorLayer[]): Promise<void> {
    if (!selected.length || this.props.currentLayer.nativeCRS === selected[0].nativeCRS) {
      this.setWarningContent(null);

      return;
    }

    const objectStringEnd = pluralize(selected.length, 'а', 'ов', 'ов');
    const projection = await getProjectionByCode(selected[0].nativeCRS);

    const changedCrsName = projection?.title || selected[0].nativeCRS;

    this.setWarningContent(
      `Внимание, будет выполнена трансформация координат объект${objectStringEnd} к проекции выбранного слоя (${changedCrsName})`
    );
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
      const schema = schemas[i];

      if (!schema) {
        return false;
      }

      const { geometryType } = schema;

      if (features && geometryType) {
        return (
          currentLayer.complexName !== layer.complexName &&
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
        !geometry?.type ||
        geometry.type === geometryType ||
        isLinear(geometryType, geometry.type) ||
        isPolygonal(geometryType, geometry.type) ||
        isPoint(geometryType, geometry.type)
    );
  }

  @action
  private setWarningContent(content: string | null): void {
    this.warningContent = content;
  }
}
