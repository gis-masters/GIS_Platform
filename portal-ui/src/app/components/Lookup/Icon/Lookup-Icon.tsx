import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Lookup-Icon.scss';

const cnLookupIcon = cn('Lookup', 'Icon');

export const LookupIcon: FC<IClassNameProps & ChildrenProps> = ({ children, className }) => (
  <span className={cnLookupIcon(null, [className])}>{children}</span>
);
