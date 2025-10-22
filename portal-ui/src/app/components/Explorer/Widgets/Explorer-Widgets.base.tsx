import { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ExplorerItemData, type ExplorerItemType } from '../Explorer.models';
import { type ExplorerStore } from '../Explorer.store';

import './Explorer-Widgets.scss';

export const cnExplorerWidgets = cn('Explorer', 'Widgets');

export interface ExplorerWidgetsProps extends IClassNameProps {
  item: ExplorerItemData;
  type: ExplorerItemType;
  store: ExplorerStore;
}

export const ExplorerWidgetsBase: FC<ExplorerWidgetsProps> = () => null;
