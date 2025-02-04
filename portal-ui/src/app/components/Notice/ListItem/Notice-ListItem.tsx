import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Notice-ListItem.scss';

const cnNoticeListItem = cn('Notice', 'ListItem');

export const NoticeListItem: FC<ChildrenProps & IClassNameProps> = ({ className, children }) => (
  <li className={cnNoticeListItem(null, [className])}>{children}</li>
);
