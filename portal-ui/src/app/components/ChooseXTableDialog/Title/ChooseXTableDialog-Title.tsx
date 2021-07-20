import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!../TitleCount/ChooseXTableDialog-TitleCount.scss';

const cnChooseXTableDialogTitle = cn('ChooseXTableDialog', 'Title');
const cnChooseXTableDialogTitleCount = cn('ChooseXTableDialog', 'TitleCount');

interface ChooseXTableDialogTitleProps {
  title: string;
  items: unknown[];
  selectedItems: unknown[];
}

export const ChooseXTableDialogTitle: FC<ChooseXTableDialogTitleProps> = ({ title, items, selectedItems }) => (
  <span className={cnChooseXTableDialogTitle()}>
    {title}{' '}
    <span className={cnChooseXTableDialogTitleCount()}>
      (выбрано {selectedItems.length} из {items.length})
    </span>
  </span>
);
