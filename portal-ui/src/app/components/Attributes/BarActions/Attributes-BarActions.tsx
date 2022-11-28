import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { pluralize } from 'numeralize-ru';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { action, computed, makeObservable, observable } from 'mobx';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogContentText, Tooltip } from '@mui/material';

import { AttributesBarActionExport } from '../BarActionExport/Attributes-BarActionExport';
import { mapSelectionService } from '../../../services/map/map-selection.service';
import { CopyFeaturesButton } from '../../CopyFeaturesButton/CopyFeaturesButton';
import { isUpdateAllowed } from '../../../services/data/permissions.service';
import { EditFeatureMode, sidebars } from '../../../stores/Sidebars.store';
import { MapSelectionTypes, mapStore } from '../../../stores/Map.store';
import { CrgVectorLayer } from '../../../services/gis/projects.models';
import { deleteFeatures } from '../../../services/data/data.service';
import { WfsFeature } from '../../../services/geoserver/wfs.models';
import { AttributesTableRecord } from '../Table/Attributes-Table';
import { mapService } from '../../../services/map/map.service';
import { IconButton } from '../../IconButton/IconButton';
import { PageOptions } from '../../../services/models';
import { XTableColumn } from '../../XTable/XTable';
import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./Attributes-BarActions.scss';

const cnAttributesBarActions = cn('Attributes', 'BarActions');

interface AttributesBarActionsProps {
  layer: CrgVectorLayer;
  cols: XTableColumn<AttributesTableRecord>[];
  pageOptions: PageOptions;
  featuresTotal: number;
  getData(pageOptions: PageOptions): Promise<[AttributesTableRecord[], number]>;
}

@observer
export class AttributesBarActions extends Component<AttributesBarActionsProps> {
  @observable private multipleDeleteDialogOpen = false;
  @observable private featuresUpdateAllowed = false;

  private operationId: symbol;

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
            {this.featuresUpdateAllowed && (
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
            />

            {this.featuresUpdateAllowed && (
              <Tooltip title={`Удалить${objLabel}`}>
                <IconButton size='small' onClick={this.openMultipleDeleteDialog}>
                  <DeleteOutlined fontSize='small' />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
        {!!featuresTotal && (
          <AttributesBarActionExport
            layer={layer}
            cols={cols}
            pageOptions={pageOptions}
            featuresTotal={featuresTotal}
            getData={getData}
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
    this.closeMultipleDeleteDialog();

    const features: WfsFeature[] = mapStore.selectedFeaturesByTableName[this.props.layer.tableName];
    const { dataset, tableName } = this.props.layer;

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
