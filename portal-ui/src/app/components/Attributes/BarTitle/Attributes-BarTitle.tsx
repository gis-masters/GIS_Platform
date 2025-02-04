import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Attributes-BarTitle.scss';

const cnAttributesBarTitle = cn('Attributes', 'BarTitle');

export const AttributesBarTitle: FC<ChildrenProps> = ({ children }) => (
  <div className={cnAttributesBarTitle()}>{children}</div>
);
