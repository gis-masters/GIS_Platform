import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./PermissionsListDialog-TitleText.scss';

const cnPermissionsListDialogTitleText = cn('PermissionsListDialog', 'TitleText');

export const PermissionsListDialogTitleText: FC = ({ children }) => (
  <div className={cnPermissionsListDialogTitleText()}>{children}</div>
);
