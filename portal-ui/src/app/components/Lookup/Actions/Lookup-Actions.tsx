import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Lookup-Actions.scss';

const cnLookupActions = cn('Lookup', 'Actions');

export const LookupActions: FC<IClassNameProps & ChildrenProps> = ({ className, children }) => (
  <div className={cnLookupActions(null, [className])}>{children}</div>
);
