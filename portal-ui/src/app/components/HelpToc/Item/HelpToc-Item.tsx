import * as React from 'react';
import { cn } from '@bem-react/classname';

import { PseudoLink } from '../../PseudoLink/PseudoLink';

import { TocItem } from '../../../stores/Help.store';

const cnHelpToc = cn('HelpToc');

interface HelpTocItemProps {
  item: TocItem;
  onSelect: (item: TocItem) => void;
  selectedItem: TocItem;
}

export class HelpTocItem extends React.Component<HelpTocItemProps> {
  constructor (props: HelpTocItemProps) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
  }

  render () {
    const { item, selectedItem, onSelect } = this.props;
    const selected = selectedItem && (selectedItem.id === item.id);

    return (
      <div className={cnHelpToc('Item')}>
        <PseudoLink className={cnHelpToc('ItemTitle', { selected })} onClick={this.clickHandler}>
          {item.title}
        </PseudoLink>

        {item.children && item.children.length ? (
          <div className={cnHelpToc('Subitems')}>
            {item.children.map((subItem, i) => (
              <HelpTocItem item={subItem}
                           selectedItem={selectedItem}
                           onSelect={onSelect}
                           key={i} />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  private clickHandler () {
    this.props.onSelect(this.props.item);
  }
}
