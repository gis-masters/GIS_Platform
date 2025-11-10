import React, { type FC, type ReactNode } from 'react';
import { cn } from '@bem-react/classname';

const cnCustomStyleControlOptionsWrapper = cn('CustomStyleControl', 'OptionsWrapper');

interface CustomStyleControlOptionsWrapperProps {
  children: ReactNode;
}

export const CustomStyleControlOptionsWrapper: FC<CustomStyleControlOptionsWrapperProps> = ({ children }) => (
  <div className={cnCustomStyleControlOptionsWrapper()}>{children}</div>
);
