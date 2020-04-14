import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import { currentProject } from '../../stores/CurrentProject.store';
import { CrgGroup, TreeItem } from '../../services/crg/projects.models';

import { LayersTreeItem } from './Item/LayersTree-Item';

import '!style-loader!css-loader!sass-loader!./LayerTree.scss';

const cnLayersTree = cn('LayersTree');

@observer
export class LayersTree extends Component {
  render() {
    return (
      <div className={cnLayersTree()}>
        {this.data.map(item => <LayersTreeItem key={`${item.isGroup}${item.id}`} item={item} />)}
      </div>
    );
  }

  @computed
  private get data (): TreeItem[] {
    return currentProject.tree.filter(item => !this.hasCollapsedParent(item));
  }

  private hasCollapsedParent (item: TreeItem): boolean {
    if (!item.parent) {
      return false;
    }

    const { expanded } = item.parent.payload as CrgGroup;

    return expanded ? this.hasCollapsedParent(item.parent) : true;
  }
}
