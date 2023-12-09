import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../services/models';

const cnCard = cn('Card');

export const Card: FC<ChildrenProps & IClassNameProps> = ({ className, children }) => (
  <div className={cnCard(null, [className])}>{children}</div>
);
