import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../services/models';

import './Notice.scss';

const cnNotice = cn('Notice');

export const Notice: FC<IClassNameProps & ChildrenProps> = ({ children, className }) => (
  <div className={cnNotice(null, [className])}>{children}</div>
);
