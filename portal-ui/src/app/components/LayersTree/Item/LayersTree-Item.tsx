import React, { Component } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { Layer } from '../../Layer/Layer';
import { TreeItem } from '../../../services/crg/projects.models';

import '!style-loader!css-loader!sass-loader!./LayersTree-Item.scss';

const cnLayersTree = cn('LayersTree');

interface LayersTreeItemProps {
  item: TreeItem;
}

@observer
export class LayersTreeItem extends Component<LayersTreeItemProps> {
  render() {
    const { isGroup, payload, depth, visible, hiddenByZoom, errors } = this.props.item;

    return (
      <Layer
        className={cnLayersTree('Item', { visible, hiddenByZoom })}
        isGroup={isGroup}
        data={payload}
        depth={depth}
        visible={visible}
        hiddenByZoom={hiddenByZoom}
        onEyeClick={this.eyeHandler}
        errors={errors}
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
