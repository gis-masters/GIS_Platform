import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./LoginForm-OrgSelectTitle.scss';

const cnLoginFormOrgSelectTitle = cn('LoginForm', 'OrgSelectTitle');

export const LoginFormOrgSelectTitle: FC = () => (
  <span className={cnLoginFormOrgSelectTitle()}>Выберите организацию</span>
);
