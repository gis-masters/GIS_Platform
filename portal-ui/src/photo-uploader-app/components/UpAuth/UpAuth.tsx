import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { LoginForm } from '../../../app/components/LoginForm/LoginForm';
import { UpLogo } from './UpLogo/UpLogo';

import '!style-loader!css-loader!sass-loader!./UpAuth.scss';

const cnUpAuth = cn('UpAuth');

export const UpAuth: FC = () => (
  <div className={cnUpAuth()}>
    <UpLogo />
    <LoginForm className={cnUpAuth('Form')} inDialog notShowEsiaIn notRightActions />
  </div>
);
