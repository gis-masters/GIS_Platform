import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../services/models';

const cnLookup = cn('Lookup');

export const Lookup: FC<IClassNameProps & ChildrenProps> = ({ children, className }) => (
  <div className={cnLookup(null, [className])}>{children}</div>
);
