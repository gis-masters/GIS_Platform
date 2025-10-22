import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './Attributes-BarHead.scss';

const cnAttributesBarHead = cn('Attributes', 'BarHead');

export const AttributesBarHead: FC<ChildrenProps> = ({ children }) => (
  <div className={cnAttributesBarHead()}>{children}</div>
);
