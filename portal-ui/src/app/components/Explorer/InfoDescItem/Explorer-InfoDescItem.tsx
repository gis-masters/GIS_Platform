import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';

import './Explorer-InfoDescItem.scss';

const cnExplorerInfoDescItem = cn('Explorer', 'InfoDescItem');

interface ExplorerInfoDescItemProps extends IClassNameProps, ChildrenProps {
  multiline?: boolean;
}

export const ExplorerInfoDescItem: FC<ExplorerInfoDescItemProps> = ({ children, multiline, className }) => (
  <div className={cnExplorerInfoDescItem({ multiline }, [className])}>{children}</div>
);
