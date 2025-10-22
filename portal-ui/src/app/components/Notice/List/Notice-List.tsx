import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';

import './Notice-List.scss';

const cnNoticeList = cn('Notice', 'List');

export const NoticeList: FC<ChildrenProps & IClassNameProps> = ({ className, children }) => (
  <ul className={cnNoticeList(null, [className])}>{children}</ul>
);
