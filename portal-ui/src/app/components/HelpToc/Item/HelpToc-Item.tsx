import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PseudoLink } from '../../PseudoLink/PseudoLink';

import { TocItem } from '../../../stores/Help.store';

const cnHelpToc = cn('HelpToc');

interface HelpTocItemProps {
  item: TocItem;
  onSelect: (item: TocItem) => void;
  selectedItem: TocItem;
}

export class HelpTocItem extends Component<HelpTocItemProps> {
  render() {
    const { item, selectedItem, onSelect } = this.props;
    const selected = selectedItem && selectedItem.id === item.id;

    return (
      <div className={cnHelpToc('Item')}>
        <PseudoLink className={cnHelpToc('ItemTitle', { selected })} onClick={this.clickHandler}>
          {item.title}
        </PseudoLink>

        {item.children && item.children.length ? (
          <div className={cnHelpToc('Subitems')}>
            {item.children.map((subItem, i) => (
              <HelpTocItem item={subItem} selectedItem={selectedItem} onSelect={onSelect} key={i} />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  @boundMethod
  private clickHandler() {
    this.props.onSelect(this.props.item);
  }
}
