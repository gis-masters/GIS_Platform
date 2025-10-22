import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';

import './Notice-ListItem.scss';

const cnNoticeListItem = cn('Notice', 'ListItem');

export const NoticeListItem: FC<ChildrenProps & IClassNameProps> = ({ className, children }) => (
  <li className={cnNoticeListItem(null, [className])}>{children}</li>
);
