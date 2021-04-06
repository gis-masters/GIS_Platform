import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

const cnDt = cn('Dt');

export const DlDt: FC<IClassNameProps> = ({ children, className }) => (
  <dt className={cnDt(null, [className])}>{children}</dt>
);
