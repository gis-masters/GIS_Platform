import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { getActions } from '../Adapter/Explorer-Adapter';
import { ExplorerStore } from '../Explorer.store';

import '!style-loader!css-loader!sass-loader!./Explorer-Actions.scss';

const cnExplorer = cn('Explorer');

interface ExplorerActionsProps {
  store: ExplorerStore;
}

export const ExplorerActions: FC<ExplorerActionsProps> = observer(({ store }) => {
  const actions = getActions(store.selectedItem, store);

  return (store.selectedItem && actions && <div className={cnExplorer('Actions')}>{actions}</div>) || null;
});
