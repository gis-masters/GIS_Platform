import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../services/models';

import '!style-loader!css-loader!sass-loader!./DialogActionsRight.scss';

const cnDialogActionsRight = cn('DialogActionsRight');

export const DialogActionsRight: FC<ChildrenProps> = ({ children }) => (
  <div className={cnDialogActionsRight()}>{children}</div>
);
