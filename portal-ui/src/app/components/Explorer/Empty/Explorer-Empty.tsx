import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { EmptyListView } from '../../EmptyListView/EmptyListView';

const cnExplorerEmpty = cn('Explorer', 'Empty');

export const ExplorerEmpty: FC = () => (
  <div className={cnExplorerEmpty()}>
    <EmptyListView text='Здесь пока пусто — добавьте первый элемент!' />
  </div>
);
