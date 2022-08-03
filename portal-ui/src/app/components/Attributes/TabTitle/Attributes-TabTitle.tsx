import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Attributes-TabTitle.scss';

const cnAttributesTabTitle = cn('Attributes', 'TabTitle');

interface AttributesTabTitleProps extends ChildrenProps {
  selected: boolean;
}

export const AttributesTabTitle: FC<AttributesTabTitleProps> = ({ selected, children }) => (
  <span className={cnAttributesTabTitle({ selected })}>{children}</span>
);
