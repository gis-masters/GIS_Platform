import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../services/models';

const cnLookup = cn('Lookup');

export const Lookup: FC<IClassNameProps & ChildrenProps> = ({ children, className }) => (
  <div className={cnLookup(null, [className])}>{children}</div>
);
