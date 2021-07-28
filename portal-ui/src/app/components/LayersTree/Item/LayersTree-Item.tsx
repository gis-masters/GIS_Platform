import React, { Component } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { TreeItem } from '../../../services/crg/projects.models';
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
        onEyeClick={this.eyeHandler}
        errors={errors}
        editMode={editMode}
        highlighted={highlighted}
      />
    );
  }

  @action.bound
  private eyeHandler() {
    const { item } = this.props;

    if (item.visible) {
      item.payload.enabled = false;

      return;
    }

    this.getDisabledAncestors(item).forEach(element => (element.payload.enabled = true));
  }

  getDisabledAncestors(item: TreeItem, result: TreeItem[] = []): TreeItem[] {
    if (!item.parent || item.parent.visible) {
      result.push(item);

      return result;
    }

    if (!item.payload.enabled) {
      result.push(item);
    }

    return this.getDisabledAncestors(item.parent, result);
  }
}
