import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../services/models';

import '!style-loader!css-loader!sass-loader!./Notice.scss';

const cnNotice = cn('Notice');

export const Notice: FC<IClassNameProps & ChildrenProps> = ({ children, className }) => (
  <div className={cnNotice(null, [className])}>{children}</div>
);
