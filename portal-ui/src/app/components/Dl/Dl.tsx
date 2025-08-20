import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../services/models';

import '!style-loader!css-loader!sass-loader!./Dl.scss';

export { DlDt as Dt } from './Dt/Dl-Dt';
export { DlDd as Dd } from './Dd/Dl-Dd';

const cnDl = cn('Dl');

export const Dl: FC<ChildrenProps & IClassNameProps> = ({ children, className }) => (
  <dl className={cnDl(null, [className])}>{children}</dl>
);
