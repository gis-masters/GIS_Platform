import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!../TitleCount/ChooseXTable-TitleCount.scss';

const cnChooseXTableTitle = cn('ChooseXTable', 'Title');
const cnChooseXTableTitleCount = cn('ChooseXTable', 'TitleCount');

interface ChooseXTableTitleProps {
  title: string;
  items: unknown[];
  selectedItems: unknown[];
  single: boolean;
}

export const ChooseXTableTitle: FC<ChooseXTableTitleProps> = ({ title, items, selectedItems, single }) => (
  <span className={cnChooseXTableTitle()}>
    {title}{' '}
    {!single && (
      <span className={cnChooseXTableTitleCount()}>
        {items.length ? `(выбрано ${selectedItems.length} из ${items.length})` : `(выбрано ${selectedItems.length})`}
      </span>
    )}
  </span>
);
