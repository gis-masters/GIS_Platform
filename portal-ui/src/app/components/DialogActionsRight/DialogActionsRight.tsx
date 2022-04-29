import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./DialogActionsRight.scss';

const cnDialogActionsRight = cn('DialogActionsRight');

export const DialogActionsRight: FC<{ children: ReactNode }> = ({ children }) => (
  <div className={cnDialogActionsRight()}>{children}</div>
);
