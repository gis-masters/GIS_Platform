import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../services/models';

import './TabTitle.scss';

const cnTabTitle = cn('TabTitle');

interface TabTitleProps extends ChildrenProps {
  selected: boolean;
}

export const TabTitle: FC<TabTitleProps> = ({ selected, children }) => (
  <span className={cnTabTitle({ selected })}>{children}</span>
);
