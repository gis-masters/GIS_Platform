import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { ExplorerStore } from '../Explorer.store';
import { ExplorerService } from '../Explorer.service';
import { getToolbarActions } from '../Adapter/Explorer-Adapter';

import '!style-loader!css-loader!sass-loader!./Explorer-ToolbarActions.scss';

const cnExplorerToolbarActions = cn('Explorer', 'ToolbarActions');

interface ExplorerToolbarActionsProps {
  store: ExplorerStore;
  service: ExplorerService;
}

export const ExplorerToolbarActions: FC<ExplorerToolbarActionsProps> = observer(({ store, service }) => {
  const { path } = store;
  const toolbarActions = path.length > 1 ? getToolbarActions(path[path.length - 2], store, service) : null;

  return toolbarActions ? <div className={cnExplorerToolbarActions()}>{toolbarActions}</div> : null;
});
