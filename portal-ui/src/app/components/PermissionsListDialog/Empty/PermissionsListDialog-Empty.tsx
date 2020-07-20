import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./PermissionsListDialog-Empty.scss';

const cnPermissionsListDialogEmpty = cn('PermissionsListDialog', 'Empty');

export const PermissionsListEmpty: FC = () => <div className={cnPermissionsListDialogEmpty()}>Нет записей.</div>;
