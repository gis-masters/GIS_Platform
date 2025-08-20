import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Attributes-BarRightActions.scss';

const cnAttributesBarRightActions = cn('Attributes', 'BarRightActions');

export const AttributesBarRightActions: FC<ChildrenProps> = ({ children }) => (
  <div className={cnAttributesBarRightActions()}>{children}</div>
);
