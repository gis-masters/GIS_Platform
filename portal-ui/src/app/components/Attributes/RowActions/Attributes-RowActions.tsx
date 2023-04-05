import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { DeleteOutline, EditLocationOutlined, MyLocationOutlined } from '@mui/icons-material';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { MapSelectionTypes } from '../../../stores/Map.store';
import { EditFeatureMode, sidebars } from '../../../stores/Sidebars.store';
import { sleep } from '../../../services/util/sleep';
import { mapService } from '../../../services/map/map.service';
import { WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { deleteFeatures } from '../../../services/data/vectorData/vectorData.service';
import { mapSelectionService } from '../../../services/map/map-selection.service';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Actions } from '../../Actions/Actions.composed';
import { ViewLocation } from '../../Icons/ViewLocation';
import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./Attributes-RowActions.scss';

const cnAttributesRowActions = cn('Attributes', 'RowActions');

interface AttributesRowActionsProps {
  feature: WfsFeature;
  editable: boolean;
  layer: CrgVectorLayer;
}

@observer
export class AttributesRowActions extends Component<AttributesRowActionsProps> {
  @observable private deletionDialogOpen = false;

  constructor(props: AttributesRowActionsProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { editable } = this.props;

    return (
      <>
        <Actions as='menu' className={cnAttributesRowActions()}>
          <ActionsItem as='menu' icon={<MyLocationOutlined />} title='Перейти к объекту' onClick={this.zoomTo} />
          <ActionsItem
            as='menu'
            icon={editable ? <EditLocationOutlined /> : <ViewLocation />}
            title={editable ? 'Редактировать' : 'Открыть'}
            onClick={this.edit}
          />
          {editable && (
            <ActionsItem as='menu' icon={<DeleteOutline />} title='Удалить' onClick={this.openDeletionDialog} />
          )}
        </Actions>

        <Dialog open={this.deletionDialogOpen} onClose={this.closeDeletionDialog} maxWidth='xs' fullWidth>
          <DialogTitle>Удалить объект?</DialogTitle>
          <DialogActions>
            <Button color='error' onClick={this.delete}>
              Удалить
            </Button>
            <Button onClick={this.closeDeletionDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @boundMethod
  private zoomTo() {
    const { feature } = this.props;
    mapService.positionToFeature(feature);
  }

  @boundMethod
  private async edit() {
    const { feature } = this.props;
    mapSelectionService.selectFeatures([feature], MapSelectionTypes.ADD);
    sidebars.closeEdit();
    await sleep(0);
    sidebars.openEdit({ features: [feature], mode: EditFeatureMode.single });
  }

  @boundMethod
  private async delete() {
    const { feature, layer } = this.props;
    await deleteFeatures(layer.dataset, layer.tableName, [feature]);
    mapSelectionService.selectFeatures([feature], MapSelectionTypes.REMOVE);
    mapService.refreshAllLayers();
    this.closeDeletionDialog();
  }

  @action.bound
  private openDeletionDialog() {
    this.deletionDialogOpen = true;
  }

  @action.bound
  private closeDeletionDialog() {
    this.deletionDialogOpen = false;
  }
}
