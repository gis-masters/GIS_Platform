import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

const cnLoginFormOrgSelectHead = cn('LoginForm', 'OrgSelectHead');

export const LoginFormOrgSelectHead: FC<ChildrenProps> = ({ children }) => (
  <div className={cnLoginFormOrgSelectHead()}>{children}</div>
);
