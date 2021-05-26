import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { ExplorerStore } from '../Explorer.store';
import { getToolbarActions } from '../Adapter/Explorer-Adapter';

import '!style-loader!css-loader!sass-loader!./Explorer-ToolbarActions.scss';

const cnExplorerToolbarActions = cn('Explorer', 'ToolbarActions');

interface ExplorerToolbarActionsProps {
  store: ExplorerStore;
}

export const ExplorerToolbarActions: FC<ExplorerToolbarActionsProps> = observer(({ store }) => {
  const { path } = store;
  const toolbarActions = path.length > 1 ? getToolbarActions(path[path.length - 2], store) : null;

  return toolbarActions ? <div className={cnExplorerToolbarActions()}>{toolbarActions}</div> : null;
});
