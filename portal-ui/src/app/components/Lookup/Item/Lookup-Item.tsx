import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';

import './Lookup-Item.scss';

const cnLookupItem = cn('Lookup', 'Item');

export const LookupItem: FC<IClassNameProps & ChildrenProps> = ({ children, className }) => (
  <div className={cnLookupItem(null, [className])}>{children}</div>
);
