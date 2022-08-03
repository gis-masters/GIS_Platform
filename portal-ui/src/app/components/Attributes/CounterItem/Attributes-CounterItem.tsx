import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Attributes-CounterItem.scss';

const cnAttributesCounterItem = cn('Attributes', 'CounterItem');

export const AttributesCounterItem: FC<ChildrenProps> = ({ children }) => (
  <div className={cnAttributesCounterItem()}>{children}</div>
);
