import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { environment } from '../../../../app/services/environment';

const cnUpLogo = cn('Logo');

export const UpLogo: FC = () => (
  <img className={cnUpLogo()} src={environment.logo || '/assets/logo/default/logo.svg'} alt={environment.title} />
);
