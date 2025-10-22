import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './Attributes-BarRightActions.scss';

const cnAttributesBarRightActions = cn('Attributes', 'BarRightActions');

export const AttributesBarRightActions: FC<ChildrenProps> = ({ children }) => (
  <div className={cnAttributesBarRightActions()}>{children}</div>
);
