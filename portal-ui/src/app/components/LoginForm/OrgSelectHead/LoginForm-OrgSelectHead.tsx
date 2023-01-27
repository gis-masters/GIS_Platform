import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

const cnLoginFormOrgSelectHead = cn('LoginForm', 'OrgSelectHead');

export const LoginFormOrgSelectHead: FC<ChildrenProps> = ({ children }) => (
  <div className={cnLoginFormOrgSelectHead()}>{children}</div>
);
