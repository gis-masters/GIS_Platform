import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { pluralize } from 'numeralize-ru';

import { deleteFeatures } from '../../../services/data/vectorData/vectorData.service';
import { WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { CrgVectorableLayer, isVectorLayer } from '../../../services/gis/layers/layers.models';
import { MapSelectionTypes } from '../../../services/map/map.models';
import { mapService } from '../../../services/map/map.service';
import { mapSelectionService } from '../../../services/map/map-selection.service';
import { PageOptions } from '../../../services/models';
import { isUpdateAllowed } from '../../../services/permissions/permissions.service';
import { featuresCollectionPrintTemplates } from '../../../services/print/print.service';
import { konfirmieren } from '../../../services/utility-dialogs.service';
import { mapStore } from '../../../stores/Map.store';
import { EditFeatureMode, sidebars } from '../../../stores/Sidebars.store';
import { CopyFeaturesButton } from '../../CopyFeaturesButton/CopyFeaturesButton';
import { IconButton } from '../../IconButton/IconButton';
import { PrintAction } from '../../PrintAction/PrintAction';
import { XTableColumn } from '../../XTable/XTable.models';
import { AttributesTableRecord } from '../Attributes.models';
import { AttributesBarActionExport } from '../BarActionExport/Attributes-BarActionExport';

import '!style-loader!css-loader!sass-loader!./Attributes-BarActions.scss';

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
              <Tooltip title={`Редактировать${this.objLabel}`}>
                <IconButton size='small' onClick={this.multipleEdit}>
                  <EditOutlined fontSize='small' />
                </IconButton>
              </Tooltip>
            )}

            <CopyFeaturesButton
              tooltipTitle={`Копировать${this.objLabel} в другой слой`}
              layer={layer}
              features={this.selectedFeatures}
              size='small'
            />

            {isVectorLayer(layer) && this.featuresUpdateAllowed && (
              <Tooltip title={`Удалить${this.objLabel}`}>
                <IconButton size='small' onClick={this.openMultipleDeleteDialog}>
                  <DeleteOutlined fontSize='small' />
                </IconButton>
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
    return mapStore.selectedFeaturesByTableName[this.props.layer.tableName] || [];
  }

  @boundMethod
  private multipleEdit() {
    const features: WfsFeature[] = mapStore.selectedFeaturesByTableName[this.props.layer.tableName];

    sidebars.openEdit({
      features,
      mode: features.length > 1 ? EditFeatureMode.multipleEdit : EditFeatureMode.single
    });
  }

  @boundMethod
  private async multipleDelete() {
    const { layer } = this.props;
    const features: WfsFeature[] = mapStore.selectedFeaturesByTableName[layer.tableName];

    if (!isVectorLayer(layer)) {
      throw new Error('Невозможно удалить');
    }

    const { dataset, tableName } = layer;
    await deleteFeatures(dataset, tableName, features);
    mapSelectionService.selectFeatures(features, MapSelectionTypes.REMOVE);
    mapService.refreshAllLayers();
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
    const confirmed = await konfirmieren({
      message: `Вы действительно хотите удалить${this.objLabel}?`,
      okText: 'Удалить',
      cancelText: 'Отмена'
    });

    if (confirmed) {
      await this.multipleDelete();
    }
  }

  @action.bound
  private setFeaturesUpdateAllowed(featuresUpdateAllowed: boolean) {
    this.featuresUpdateAllowed = featuresUpdateAllowed;
  }
}
