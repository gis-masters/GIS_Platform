import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Attributes-Footer.scss';

const cnAttributesFooter = cn('Attributes', 'Footer');

export const AttributesFooter: FC<ChildrenProps> = ({ children }) => (
  <div className={cnAttributesFooter()}>{children}</div>
);
