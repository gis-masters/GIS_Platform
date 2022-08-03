import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Attributes-TabInner.scss';

const cnAttributesTabInner = cn('Attributes', 'TabInner');

export const AttributesTabInner: FC<ChildrenProps> = ({ children }) => (
  <span className={cnAttributesTabInner()}>{children}</span>
);
