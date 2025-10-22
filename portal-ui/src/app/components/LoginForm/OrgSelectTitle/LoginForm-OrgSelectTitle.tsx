import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import './LoginForm-OrgSelectTitle.scss';

const cnLoginFormOrgSelectTitle = cn('LoginForm', 'OrgSelectTitle');

export const LoginFormOrgSelectTitle: FC = () => (
  <span className={cnLoginFormOrgSelectTitle()}>Выберите организацию</span>
);
