import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

const cnLookup = cn('Lookup');

interface LookupProps extends IClassNameProps {
  children: ReactNode;
}

export const Lookup: FC<LookupProps> = ({ children, className }) => (
  <div className={cnLookup(null, [className])}>{children}</div>
);
