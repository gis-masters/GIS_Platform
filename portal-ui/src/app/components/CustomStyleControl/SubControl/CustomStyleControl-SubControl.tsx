import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./CustomStyleControl-SubControl.scss';

const cnCustomStyleControlSubControl = cn('CustomStyleControl', 'SubControl');

export const CustomStyleControlSubControl: FC<ChildrenProps & IClassNameProps> = ({ children, className }) => (
  <span className={cnCustomStyleControlSubControl(null, [className])}>{children}</span>
);
