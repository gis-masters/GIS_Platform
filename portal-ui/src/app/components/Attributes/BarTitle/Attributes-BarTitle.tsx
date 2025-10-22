import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './Attributes-BarTitle.scss';

const cnAttributesBarTitle = cn('Attributes', 'BarTitle');

export const AttributesBarTitle: FC<ChildrenProps> = ({ children }) => (
  <div className={cnAttributesBarTitle()}>{children}</div>
);
