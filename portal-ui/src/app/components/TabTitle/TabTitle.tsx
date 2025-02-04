import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../services/models';

import '!style-loader!css-loader!sass-loader!./TabTitle.scss';

const cnTabTitle = cn('TabTitle');

interface TabTitleProps extends ChildrenProps {
  selected: boolean;
}

export const TabTitle: FC<TabTitleProps> = ({ selected, children }) => (
  <span className={cnTabTitle({ selected })}>{children}</span>
);
