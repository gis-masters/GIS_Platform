import { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ExplorerItemData, ExplorerItemType } from '../Explorer.models';
import { ExplorerStore } from '../Explorer.store';

import '!style-loader!css-loader!sass-loader!./Explorer-Widgets.scss';

export const cnExplorerWidgets = cn('Explorer', 'Widgets');

export interface ExplorerWidgetsProps extends IClassNameProps {
  item: ExplorerItemData;
  type: ExplorerItemType;
  store: ExplorerStore;
}

export const ExplorerWidgetsBase: FC<ExplorerWidgetsProps> = () => null;
