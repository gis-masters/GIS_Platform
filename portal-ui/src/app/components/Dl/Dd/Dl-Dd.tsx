import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

const cnDd = cn('Dd');
interface DlDdProps extends IClassNameProps {
  children: ReactNode;
}

export const DlDd: FC<DlDdProps> = ({ children, className }) => <dd className={cnDd(null, [className])}>{children}</dd>;
