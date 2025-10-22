import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './Attributes-CounterItem.scss';

const cnAttributesCounterItem = cn('Attributes', 'CounterItem');

export interface AttributesCounterItemProps extends ChildrenProps {
  color?: string;
}

export const AttributesCounterItem: FC<AttributesCounterItemProps> = ({ children, color }) => (
  <div className={cnAttributesCounterItem({ type: color })}>{children}</div>
);
