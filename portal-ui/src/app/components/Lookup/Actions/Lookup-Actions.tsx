import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';

import './Lookup-Actions.scss';

const cnLookupActions = cn('Lookup', 'Actions');

export const LookupActions: FC<IClassNameProps & ChildrenProps> = ({ className, children }) => (
  <div className={cnLookupActions(null, [className])}>{children}</div>
);
