import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Tooltip } from '@mui/material';
import { WarningAmberOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { pluralize } from 'numeralize-ru';

import { getProjectionByCode } from '../../services/data/projections/projections.service';
import { Schema } from '../../services/data/schema/schema.models';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { isPolygonal } from '../../services/geoserver/wfs/wfs.util';
import { CrgLayer } from '../../services/gis/layers/layers.models';
import { getLayerSchema } from '../../services/gis/layers/layers.service';
import { isUpdateAllowed } from '../../services/permissions/permissions.service';
import { currentProject } from '../../stores/CurrentProject.store';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { FormControlProps } from '../Form/Control/Form-Control';
import { XTableColumn } from '../XTable/XTable.models';

import '!style-loader!css-loader!sass-loader!./SelectSuitableLayerDialog.scss';

const cnSelectSuitableLayerDialog = cn('SelectSuitableLayerDialog');

interface SelectSuitableLayerDialogProps extends FormControlProps {
  currentLayer: CrgLayer;
  feature: WfsFeature;
}

@observer
export class SelectSuitableLayerDialog extends Component<SelectSuitableLayerDialogProps> {
  @observable private layersAvailableForCopy: CrgLayer[] = [];
  @observable warningContent: string | null = null;
  @observable selectedLayer: CrgLayer | null = null;
  @observable private busy = false;
  @observable private open = false;

  private fetchingOperation?: Promise<void>;
  private readonly layerDialogCols: XTableColumn<CrgLayer>[] = [
    {
      field: 'title',
      title: 'Название',
      filterable: true
    }
  ];

  constructor(props: SelectSuitableLayerDialogProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidUpdate(prevProps: Readonly<SelectSuitableLayerDialogProps>): Promise<void> {
    const { currentLayer, feature } = this.props;
    if ((currentLayer && currentLayer.id !== prevProps.currentLayer.id) || feature !== prevProps.feature) {
      delete this.fetchingOperation;

      this.fetchingOperation = this.fetchAvailableForCopyingLayers();
      await this.fetchingOperation;
    }

    if (!this.fetchingOperation) {
      this.fetchingOperation = this.fetchAvailableForCopyingLayers();
      await this.fetchingOperation;
    }
  }

  render() {
    return (
      <>
        <Button
          className={cnSelectSuitableLayerDialog('LayerSelect', { empty: !this.selectedLayer })}
          onClick={this.openDialog}
          color='primary'
        >
          {this.selectedLayer?.title || 'Не выбрано'}
        </Button>

        <ChooseXTableDialog
          className={cnSelectSuitableLayerDialog()}
          data={this.layersAvailableForCopy}
          title='Выбор слоя'
          open={this.open}
          cols={this.layerDialogCols}
          selectedItems={this.selectedLayer ? [this.selectedLayer] : []}
          alwaysShowActionButton
          onClose={this.onClose}
          onSelect={this.selectLayer}
          onChange={this.onChange}
          loading={this.busy}
          single
          actionButtonProps={{
            children: 'Выбрать',
            startIcon: this.warningContent ? (
              <Tooltip title={this.warningContent}>
                <WarningAmberOutlined color='warning' />
              </Tooltip>
            ) : null
          }}
          additionalAction={
            <div className={cnSelectSuitableLayerDialog('Description')}>
              Для создания буфера доступны <b>редактируемые</b> слои, c типом геометрии <b>"Полигон"</b>
            </div>
          }
        />
      </>
    );
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @action.bound
  private setLayersAvailableForCopy(layersAvailableForCopy: CrgLayer[]) {
    this.layersAvailableForCopy = layersAvailableForCopy;
  }

  @boundMethod
  private async onChange(selected: CrgLayer[]): Promise<void> {
    if (!selected.length || this.props.currentLayer.nativeCRS === selected[0].nativeCRS) {
      this.setWarningContent(null);

      return;
    }

    const objectStringEnd = pluralize(selected.length, 'а', 'ов', 'ов');

    if (selected[0].nativeCRS) {
      const projection = await getProjectionByCode(selected[0].nativeCRS);

      const changedCrsName = projection?.title || selected[0].nativeCRS;

      this.setWarningContent(
        `Внимание, будет выполнена трансформация координат объект${objectStringEnd} к проекции выбранного слоя (${changedCrsName})`
      );
    }
  }

  private async fetchAvailableForCopyingLayers() {
    this.setBusy(true);
    const schemas: Schema[] = [];

    for (const layer of currentProject.vectorLayers) {
      const schema = await getLayerSchema(layer);

      if (schema) {
        schemas.push(schema);
      }
    }

    const { feature } = this.props;
    const layersUpdatePermissions: boolean[] = [];

    for (const layer of currentProject.vectorLayers) {
      layersUpdatePermissions.push(await isUpdateAllowed(layer));
    }

    const layersAvailableForCopy = currentProject.vectorLayers.filter((_, i) => {
      const schema = schemas[i];

      if (!schema) {
        return false;
      }

      const { geometryType } = schema;

      if (feature && geometryType) {
        return isPolygonal(geometryType) && layersUpdatePermissions[i];
      }

      return false;
    });

    this.setBusy(false);
    this.setLayersAvailableForCopy(layersAvailableForCopy);
  }

  @action
  private setWarningContent(content: string | null): void {
    this.warningContent = content;
  }

  @action.bound
  private openDialog(): void {
    this.open = true;
  }

  @action.bound
  private onClose(): void {
    this.open = false;
  }

  @action.bound
  private setSelectedLayer(selectedLayer: CrgLayer): void {
    this.selectedLayer = selectedLayer;
  }

  @boundMethod
  private selectLayer(layer: CrgLayer[]): void {
    this.setSelectedLayer(layer[0]);
    const { property, onChange } = this.props;

    if (onChange) {
      onChange({
        value: layer[0],
        propertyName: property.name
      });
    }

    this.onClose();
  }
}
