import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';

const cnCardDescription = cn('Card', 'Description');

export const CardDescription: FC<ChildrenProps & IClassNameProps> = ({ className, children }) => (
  <p className={cnCardDescription(null, [className])}>{children}</p>
);
