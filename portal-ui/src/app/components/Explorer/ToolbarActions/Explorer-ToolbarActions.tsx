import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

const cnExplorerToolbarActions = cn('Explorer', 'ToolbarActions');

import '!style-loader!css-loader!sass-loader!./Explorer-ToolbarActions.scss';

export const ExplorerToolbarActions: FC = ({ children }) => (
  <div className={cnExplorerToolbarActions()}>{children}</div>
);
