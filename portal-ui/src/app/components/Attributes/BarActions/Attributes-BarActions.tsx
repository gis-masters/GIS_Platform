import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Delete, DeleteOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { pluralize } from 'numeralize-ru';

import { deleteFeaturesAndEmitEvent } from '../../../services/data/vectorData/vectorData.service';
import { type WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { type CrgVectorableLayer, isVectorLayer } from '../../../services/gis/layers/layers.models';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { mapModeManager } from '../../../services/map/a-map-mode/MapModeManager';
import { selectedFeaturesStore } from '../../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { MapMode } from '../../../services/map/map.models';
import { mapService } from '../../../services/map/map.service';
import { type PageOptions } from '../../../services/models';
import { isUpdateAllowed } from '../../../services/permissions/permissions.service';
import { featuresCollectionPrintTemplates } from '../../../services/print/print.service';
import { konfirmieren } from '../../../services/utility-dialogs.service';
import { CopyFeaturesButton } from '../../CopyFeaturesButton/CopyFeaturesButton';
import { EditFeaturesButton } from '../../EditFeaturesButton/EditFeaturesButton';
import { IconButton } from '../../IconButton/IconButton';
import { PrintAction } from '../../PrintAction/PrintAction';
import { type XTableColumn } from '../../XTable/XTable.models';
import { type AttributesTableRecord } from '../Attributes.models';
import { AttributesBarActionExport } from '../BarActionExport/Attributes-BarActionExport';

import './Attributes-BarActions.scss';

const cnAttributesBarActions = cn('Attributes', 'BarActions');

interface AttributesBarActionsProps {
  layer: CrgVectorableLayer;
  cols: XTableColumn<AttributesTableRecord>[];
  pageOptions?: PageOptions;
  featuresTotal: number;
  getData(pageOptions: PageOptions): Promise<[AttributesTableRecord[], number]>;
}

@observer
export class AttributesBarActions extends Component<AttributesBarActionsProps> {
  @observable private featuresUpdateAllowed = false;
  @observable private dialogOpen = false;

  private operationId?: symbol;

  constructor(props: AttributesBarActionsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    await this.init();
  }

  async componentDidUpdate(prevProps: Readonly<AttributesBarActionsProps>): Promise<void> {
    const { layer } = this.props;

    if (prevProps.layer.id !== layer.id) {
      await this.init();
    }
  }

  @computed
  private get selectedCount(): number {
    return this.selectedFeatures.length;
  }

  @computed
  private get objLabel(): string {
    return ` ${this.selectedCount} объект${pluralize(this.selectedCount, '', 'а', 'ов')}`;
  }

  render() {
    const { layer, cols, pageOptions, featuresTotal, getData } = this.props;

    return (
      <div className={cnAttributesBarActions()}>
        {!!this.selectedCount && (
          <>
            {isVectorLayer(layer) && this.featuresUpdateAllowed && (
              <EditFeaturesButton label={this.objLabel} features={this.selectedFeatures} />
            )}

            <CopyFeaturesButton
              tooltipTitle={`Копировать${this.objLabel} в другой слой`}
              layer={layer}
              features={this.selectedFeatures}
              size='small'
            />

            {isVectorLayer(layer) && this.featuresUpdateAllowed && (
              <Tooltip title={`Удалить${this.objLabel}`}>
                <span>
                  <IconButton
                    size='small'
                    onClick={this.openMultipleDeleteDialog}
                    color='error'
                    disabled={editFeatureStore.dirty}
                  >
                    {this.dialogOpen ? <Delete fontSize='small' /> : <DeleteOutline fontSize='small' />}
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </>
        )}
        {!!featuresTotal && isVectorLayer(layer) && (
          <AttributesBarActionExport
            layer={layer}
            cols={cols}
            pageOptions={pageOptions}
            featuresTotal={featuresTotal}
            getData={getData}
          />
        )}
        {!!this.selectedCount && (
          <PrintAction<WfsFeature[]>
            as='iconButton'
            entity={this.selectedFeatures}
            templates={featuresCollectionPrintTemplates}
            size='small'
          />
        )}
      </div>
    );
  }

  @computed
  private get selectedFeatures(): WfsFeature[] {
    return selectedFeaturesStore.featuresByTableName[this.props.layer.tableName] || [];
  }

  private async init() {
    const operationId = Symbol();
    this.operationId = operationId;

    const updateAllowed = await isUpdateAllowed(this.props.layer);

    if (this.operationId === operationId) {
      this.setFeaturesUpdateAllowed(updateAllowed);
    }
  }

  @boundMethod
  private async openMultipleDeleteDialog() {
    this.setDialogOpen(true);
    const confirmed = await konfirmieren({
      message: `Вы действительно хотите удалить${this.objLabel}?`,
      okText: 'Удалить',
      cancelText: 'Отмена'
    });

    if (confirmed) {
      const { layer } = this.props;
      const features: WfsFeature[] = selectedFeaturesStore.featuresByTableName[layer.tableName];
      if (!isVectorLayer(layer)) {
        throw new Error('Невозможно удалить');
      }

      const { dataset, tableName } = layer;
      await deleteFeaturesAndEmitEvent(dataset, tableName, features);
      mapService.refreshAllLayers();

      await mapModeManager.changeMode(MapMode.NONE, undefined, 'openMultipleDeleteDialog');
    }

    this.setDialogOpen(false);
  }

  @action.bound
  private setFeaturesUpdateAllowed(featuresUpdateAllowed: boolean) {
    this.featuresUpdateAllowed = featuresUpdateAllowed;
  }

  @action
  private setDialogOpen(open: boolean) {
    this.dialogOpen = open;
  }
}
