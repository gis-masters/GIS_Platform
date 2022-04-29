import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import '!style-loader!css-loader!sass-loader!./Dl.scss';

export { DlDt as Dt } from './Dt/Dl-Dt';
export { DlDd as Dd } from './Dd/Dl-Dd';

const cnDl = cn('Dl');

interface DlProps extends IClassNameProps {
  children: ReactNode;
}

export const Dl: FC<DlProps> = ({ children, className }) => <dl className={cnDl(null, [className])}>{children}</dl>;
