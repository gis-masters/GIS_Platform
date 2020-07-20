import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { Toc, TocItem } from '../../stores/Help.store';

import { HelpTocItem } from './Item/HelpToc-Item';

import '!style-loader!css-loader!sass-loader!./HelpToc.scss';

const cnHelpToc = cn('HelpToc');

interface HelpTocProps extends IClassNameProps {
  items: Toc;
  selectedItem?: TocItem;
  onSelect: (item: TocItem) => void;
}

export const HelpToc: FC<HelpTocProps> = ({ className, items, onSelect, selectedItem }) => (
  <div className={cnHelpToc(null, [className])}>
    {items.map((item, i) => (
      <HelpTocItem item={item} onSelect={onSelect} selectedItem={selectedItem} key={i} />
    ))}
  </div>
);
