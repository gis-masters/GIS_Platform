import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Card-Title.scss';

const cnCardTitle = cn('Card', 'Title');

export const CardTitle: FC<ChildrenProps & IClassNameProps> = ({ className, children }) => (
  <div className={cnCardTitle(null, [className])}>{children}</div>
);
