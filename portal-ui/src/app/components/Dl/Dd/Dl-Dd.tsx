import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

const cnDd = cn('Dd');

export const DlDd: FC<IClassNameProps> = ({ children, className }) => (
  <dd className={cnDd(null, [className])}>{children}</dd>
);
