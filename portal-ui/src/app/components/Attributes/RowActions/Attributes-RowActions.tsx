import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { DeleteOutline, EditLocationOutlined, MyLocationOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { deleteFeatures } from '../../../services/data/vectorData/vectorData.service';
import { WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { MapSelectionTypes } from '../../../services/map/map.models';
import { mapService } from '../../../services/map/map.service';
import { mapSelectionService } from '../../../services/map/map-selection.service';
import { sleep } from '../../../services/util/sleep';
import { konfirmieren } from '../../../services/utility-dialogs.service';
import { EditFeatureMode, sidebars } from '../../../stores/Sidebars.store';
import { Actions } from '../../Actions/Actions.composed';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { ViewLocation } from '../../Icons/ViewLocation';

import '!style-loader!css-loader!sass-loader!./Attributes-RowActions.scss';

const cnAttributesRowActions = cn('Attributes', 'RowActions');

interface AttributesRowActionsProps {
  feature: WfsFeature;
  editable: boolean;
  layer: CrgVectorLayer;
}

@observer
export class AttributesRowActions extends Component<AttributesRowActionsProps> {
  render() {
    const { editable } = this.props;

    return (
      <Actions as='menu' className={cnAttributesRowActions()}>
        <ActionsItem as='menu' icon={<MyLocationOutlined />} title='Перейти к объекту' onClick={this.zoomTo} />
        <ActionsItem
          as='menu'
          icon={editable ? <EditLocationOutlined /> : <ViewLocation />}
          title={editable ? 'Редактировать' : 'Открыть'}
          onClick={this.edit}
        />
        {editable && (
          <ActionsItem as='menu' icon={<DeleteOutline color='error' />} title='Удалить' onClick={this.delete} />
        )}
      </Actions>
    );
  }

  @boundMethod
  private async zoomTo() {
    const { feature } = this.props;
    await mapService.positionToFeature(feature);
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

    const confirmed = await konfirmieren({
      message: 'Вы действительно хотите удалить 1 объект?',
      okText: 'Удалить',
      cancelText: 'Отмена'
    });

    if (confirmed) {
      await deleteFeatures(layer.dataset, layer.tableName, [feature]);
      mapSelectionService.selectFeatures([feature], MapSelectionTypes.REMOVE);
      mapService.refreshAllLayers();
    }
  }
}
