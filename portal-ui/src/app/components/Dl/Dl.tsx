import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../services/models';

import './Dl.scss';

export { DlDt as Dt } from './Dt/Dl-Dt';
export { DlDd as Dd } from './Dd/Dl-Dd';

const cnDl = cn('Dl');

export const Dl: FC<ChildrenProps & IClassNameProps> = ({ children, className }) => (
  <dl className={cnDl(null, [className])}>{children}</dl>
);
