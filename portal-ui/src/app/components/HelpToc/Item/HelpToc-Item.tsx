import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { observer } from 'mobx-react';
import { TreeItem } from '@mui/x-tree-view';
import { action, makeObservable } from 'mobx';

import { TocItem } from '../../../stores/Help.store';

const cnHelpTocItem = cn('HelpToc', 'Item');

import '!style-loader!css-loader!sass-loader!./HelpToc-Item.scss';

interface HelpTocProps extends IClassNameProps {
  item: TocItem;
  onSelect?: (item: TocItem) => void;
}

@observer
export class HelpTocItem extends Component<HelpTocProps> {
  constructor(props: HelpTocProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { item, onSelect } = this.props;

    return (
      <TreeItem
        classes={{ label: cnHelpTocItem({ type: item.children ? 'wrapper' : 'link' }) }}
        key={item.id}
        itemId={item.id}
        label={item.title}
        onClick={this.clickHandler}
      >
        {Array.isArray(item.children)
          ? item.children.map((node, index) => <HelpTocItem key={index} item={node} onSelect={onSelect} />)
          : null}
      </TreeItem>
    );
  }

  @action.bound
  private clickHandler() {
    const { item, onSelect } = this.props;
    if (!item.children && onSelect) {
      onSelect(item);
    }
  }
}
