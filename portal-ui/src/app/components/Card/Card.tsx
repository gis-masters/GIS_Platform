import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../services/models';

const cnCard = cn('Card');

export const Card: FC<ChildrenProps & IClassNameProps> = ({ className, children }) => (
  <div className={cnCard(null, [className])}>{children}</div>
);
