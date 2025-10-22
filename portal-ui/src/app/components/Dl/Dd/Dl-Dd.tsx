import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';

const cnDd = cn('Dd');

export const DlDd: FC<ChildrenProps & IClassNameProps> = ({ children, className }) => (
  <dd className={cnDd(null, [className])}>{children}</dd>
);
