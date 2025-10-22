import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './Attributes-Footer.scss';

const cnAttributesFooter = cn('Attributes', 'Footer');

export const AttributesFooter: FC<ChildrenProps> = ({ children }) => (
  <div className={cnAttributesFooter()}>{children}</div>
);
