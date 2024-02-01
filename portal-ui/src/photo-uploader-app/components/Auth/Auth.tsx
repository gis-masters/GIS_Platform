import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { AuthLogo } from './Logo/Logo';
import { LoginForm } from '../../../app/components/LoginForm/LoginForm';

import '!style-loader!css-loader!sass-loader!./Auth.scss';

const cnAuth = cn('Auth');

export const Auth: FC = () => (
  <div className={cnAuth()}>
    <AuthLogo />
    <LoginForm className={cnAuth('Form')} inDialog notShowEsiaIn notRightActions />
  </div>
);
