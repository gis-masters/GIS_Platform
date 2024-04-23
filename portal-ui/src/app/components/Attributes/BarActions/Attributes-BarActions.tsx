import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, Tooltip } from '@mui/material';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { pluralize } from 'numeralize-ru';

import { isUpdateAllowed } from '../../../services/data/permissions/permissions.service';
import { deleteFeatures } from '../../../services/data/vectorData/vectorData.service';
import { WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { CrgVectorableLayer, isVectorLayer } from '../../../services/gis/layers/layers.models';
import { MapSelectionTypes } from '../../../services/map/map.models';
import { mapService } from '../../../services/map/map.service';
import { mapSelectionService } from '../../../services/map/map-selection.service';
import { PageOptions } from '../../../services/models';
import { featuresCollectionPrintTemplates } from '../../../services/print/print.service';
import { mapStore } from '../../../stores/Map.store';
import { EditFeatureMode, sidebars } from '../../../stores/Sidebars.store';
import { Button } from '../../Button/Button';
import { CopyFeaturesButton } from '../../CopyFeaturesButton/CopyFeaturesButton';
import { IconButton } from '../../IconButton/IconButton';
import { PrintAction } from '../../PrintAction/PrintAction';
import { XTableColumn } from '../../XTable/XTable.models';
import { AttributesBarActionExport } from '../BarActionExport/Attributes-BarActionExport';
import { AttributesTableRecord } from '../Table/Attributes-Table';

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
  @observable private multipleDeleteDialogOpen = false;
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

  render() {
    const { layer, cols, pageOptions, featuresTotal, getData } = this.props;
    const count = this.selectedFeatures.length;
    const objLabel = ` ${count} объект${pluralize(count, '', 'а', 'ов')}`;

    return (
      <div className={cnAttributesBarActions()}>
        {!!count && (
          <>
            {isVectorLayer(layer) && this.featuresUpdateAllowed && (
              <Tooltip title={`Редактировать${objLabel}`}>
                <IconButton size='small' onClick={this.multipleEdit}>
                  <EditOutlined fontSize='small' />
                </IconButton>
              </Tooltip>
            )}

            <CopyFeaturesButton
              tooltipTitle={`Копировать${objLabel} в другой слой`}
              layer={layer}
              features={this.selectedFeatures}
              size='small'
            />

            {isVectorLayer(layer) && this.featuresUpdateAllowed && (
              <Tooltip title={`Удалить${objLabel}`}>
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
        {!!count && (
          <PrintAction<WfsFeature[]>
            as='iconButton'
            entity={this.selectedFeatures}
            templates={featuresCollectionPrintTemplates}
            size='small'
          />
        )}
        <Dialog open={this.multipleDeleteDialogOpen} onClose={this.closeMultipleDeleteDialog}>
          <DialogContent>
            <DialogContentText>Вы действительно хотите удалить {objLabel}?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.multipleDelete} color='primary'>
              Удалить
            </Button>
            <Button onClick={this.closeMultipleDeleteDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
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

    this.closeMultipleDeleteDialog();

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

  @action.bound
  private openMultipleDeleteDialog() {
    this.multipleDeleteDialogOpen = true;
  }

  @action.bound
  private closeMultipleDeleteDialog() {
    this.multipleDeleteDialogOpen = false;
  }

  @action.bound
  private setFeaturesUpdateAllowed(featuresUpdateAllowed: boolean) {
    this.featuresUpdateAllowed = featuresUpdateAllowed;
  }
}
