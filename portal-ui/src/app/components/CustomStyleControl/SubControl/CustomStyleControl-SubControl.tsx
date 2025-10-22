import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';

import './CustomStyleControl-SubControl.scss';

const cnCustomStyleControlSubControl = cn('CustomStyleControl', 'SubControl');

export const CustomStyleControlSubControl: FC<ChildrenProps & IClassNameProps> = ({ children, className }) => (
  <span className={cnCustomStyleControlSubControl(null, [className])}>{children}</span>
);
