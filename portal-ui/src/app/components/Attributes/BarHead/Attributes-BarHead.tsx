import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Attributes-BarHead.scss';

const cnAttributesBarHead = cn('Attributes', 'BarHead');

export const AttributesBarHead: FC<ChildrenProps> = ({ children }) => (
  <div className={cnAttributesBarHead()}>{children}</div>
);
