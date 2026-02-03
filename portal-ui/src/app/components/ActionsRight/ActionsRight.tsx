import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../services/models';

import './ActionsRight.scss';

const cnActionsRight = cn('ActionsRight');

export const ActionsRight: FC<ChildrenProps & IClassNameProps> = ({ children, className }) => (
  <div className={cnActionsRight(null, [className])}>{children}</div>
);
