import React, { Component } from 'react';
import { action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { extractTableNameFromFeatureId } from '../../../services/geoserver/featureType/featureType.util';
import { CrgLayer, isVectorLayer } from '../../../services/gis/layers/layers.models';
import { TreeItem } from '../../../services/gis/projects/projects.models';
import { projectsService } from '../../../services/gis/projects/projects.service';
import { MapSelectionTypes } from '../../../services/map/map.models';
import { mapSelectionService } from '../../../services/map/map-selection.service';
import { mapStore } from '../../../stores/Map.store';
import { Layer } from '../../Layer/Layer';

import '!style-loader!css-loader!sass-loader!./LayersTree-Item.scss';

const cnLayersTree = cn('LayersTree');

interface LayersTreeItemProps {
  item: TreeItem;
  editMode: boolean;
  highlighted: boolean;
}

@observer
export class LayersTreeItem extends Component<LayersTreeItemProps> {
  constructor(props: LayersTreeItemProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { editMode, item, highlighted } = this.props;
    const { isGroup, isEmptyGroup, payload, depth, visible, hiddenByZoom, errors } = item;

    return (
      <Layer
        className={cnLayersTree('Item', { visible, hiddenByZoom, editMode })}
        isGroup={isGroup}
        isEmptyGroup={isEmptyGroup}
        data={payload}
        depth={depth}
        visible={visible}
        hiddenByZoom={hiddenByZoom}
        onEyeClick={this.handleEye}
        errors={errors}
        editMode={editMode}
        highlighted={highlighted}
      />
    );
  }

  @action.bound
  private handleEye() {
    const { item } = this.props;

    if (item.visible) {
      item.payload.enabled = false;

      const layer = item.payload as CrgLayer;

      if (!isVectorLayer(layer)) {
        return;
      }

      // при выключении видимости слоя снимаем выделение с его объектов
      const features = mapStore.selectedFeatures.filter(f => extractTableNameFromFeatureId(f.id) !== layer.tableName);
      mapSelectionService.selectFeatures(features, MapSelectionTypes.REPLACE);

      return;
    }

    item.payload.enabled = true;

    if (item.payload.parentId) {
      projectsService.enableGroupAndAncestors(item.payload.parentId);
    }
  }
}
