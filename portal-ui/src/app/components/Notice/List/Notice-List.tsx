import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Notice-List.scss';

const cnNoticeList = cn('Notice', 'List');

export const NoticeList: FC<ChildrenProps & IClassNameProps> = ({ className, children }) => (
  <ul className={cnNoticeList(null, [className])}>{children}</ul>
);
