import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

const cnDt = cn('Dt');

interface DlDtProps extends IClassNameProps {
  children: ReactNode;
}

export const DlDt: FC<DlDtProps> = ({ children, className }) => <dt className={cnDt(null, [className])}>{children}</dt>;
