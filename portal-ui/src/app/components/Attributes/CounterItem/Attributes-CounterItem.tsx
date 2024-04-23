import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Attributes-CounterItem.scss';

const cnAttributesCounterItem = cn('Attributes', 'CounterItem');

export interface AttributesCounterItemProps extends ChildrenProps {
  color?: string;
}

export const AttributesCounterItem: FC<AttributesCounterItemProps> = ({ children, color }) => (
  <div className={cnAttributesCounterItem({ type: color })}>{children}</div>
);
