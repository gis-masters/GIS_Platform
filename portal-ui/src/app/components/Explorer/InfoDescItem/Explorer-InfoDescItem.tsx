import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Explorer-InfoDescItem.scss';

const cnExplorerInfoDescItem = cn('Explorer', 'InfoDescItem');

interface ExplorerInfoDescItemProps extends IClassNameProps, ChildrenProps {
  multiline?: boolean;
}

export const ExplorerInfoDescItem: FC<ExplorerInfoDescItemProps> = ({ children, multiline, className }) => (
  <div className={cnExplorerInfoDescItem({ multiline }, [className])}>{children}</div>
);
