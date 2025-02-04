import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Lookup-Item.scss';

const cnLookupItem = cn('Lookup', 'Item');

export const LookupItem: FC<IClassNameProps & ChildrenProps> = ({ children, className }) => (
  <div className={cnLookupItem(null, [className])}>{children}</div>
);
