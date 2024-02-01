import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { environment } from '../../../../app/services/environment';

const cnAuthLogo = cn('Auth', 'Logo');

export const AuthLogo: FC = () => (
  <img className={cnAuthLogo()} src={environment.logo || '/assets/logo/default/logo.svg'} alt={environment.title} />
);
