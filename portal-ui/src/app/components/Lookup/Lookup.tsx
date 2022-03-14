import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

const cnLookup = cn('Lookup');

export const Lookup: FC<IClassNameProps> = ({ children, className }) => (
  <div className={cnLookup(null, [className])}>{children}</div>
);
