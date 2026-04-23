import React, { type FC, useCallback } from 'react';
import { cn } from '@bem-react/classname';

import { type TocItem } from '../../../stores/Help.store';

import './HelpToc-ItemTitleLink.scss';

const cnHelpTocItemTitleLink = cn('HelpToc', 'ItemTitleLink');

interface HelpTocItemTitleLinkProps {
  item: TocItem;
  onClick(item: TocItem): void;
}

export const HelpTocItemTitleLink: FC<HelpTocItemTitleLinkProps> = ({ item, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(item);
  }, [item, onClick]);

  return (
    <div className={cnHelpTocItemTitleLink()} onClick={handleClick} dangerouslySetInnerHTML={{ __html: item.title }} />
  );
};
