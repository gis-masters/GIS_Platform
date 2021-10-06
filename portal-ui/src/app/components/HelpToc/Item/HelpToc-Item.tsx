import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { observer } from 'mobx-react';
import { TreeItem } from '@mui/lab';
import { action } from 'mobx';

import { TocItem } from '../../../stores/Help.store';

const cnHelpTocItem = cn('HelpToc', 'Item');

import '!style-loader!css-loader!sass-loader!./HelpToc-Item.scss';

interface HelpTocProps extends IClassNameProps {
  item: TocItem;
  onSelect?: (item: TocItem) => void;
}

@observer
export class HelpTocItem extends Component<HelpTocProps> {
  render() {
    const { item, onSelect } = this.props;

    return (
      <TreeItem
        classes={{ label: cnHelpTocItem({ type: item.children ? 'wrapper' : 'link' }) }}
        key={item.id}
        nodeId={item.id}
        label={item.title}
        onClick={() => this.clickHandler(item)}
      >
        {Array.isArray(item.children)
          ? item.children.map((node, index) => <HelpTocItem key={index} item={node} onSelect={onSelect} />)
          : null}
      </TreeItem>
    );
  }

  @action
  private clickHandler(item: TocItem) {
    item.children ? null : this.props.onSelect(item);
  }
}
