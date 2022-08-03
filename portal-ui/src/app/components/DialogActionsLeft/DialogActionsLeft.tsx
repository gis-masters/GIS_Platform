import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../services/models';

import '!style-loader!css-loader!sass-loader!./DialogActionsLeft.scss';

const cnDialogActionsLeft = cn('DialogActionsLeft');

export const DialogActionsLeft: FC<ChildrenProps> = ({ children }) => (
  <div className={cnDialogActionsLeft()}>{children}</div>
);
