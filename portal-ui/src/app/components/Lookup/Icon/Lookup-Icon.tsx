import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';

import './Lookup-Icon.scss';

const cnLookupIcon = cn('Lookup', 'Icon');

export const LookupIcon: FC<IClassNameProps & ChildrenProps> = ({ children, className }) => (
  <span className={cnLookupIcon(null, [className])}>{children}</span>
);
