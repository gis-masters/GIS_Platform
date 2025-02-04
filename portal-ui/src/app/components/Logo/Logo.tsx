import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { environment } from '../../services/environment';
import { Favicon } from '../Favicon/Favicon';
import { Link } from '../Link/Link';

import '!style-loader!css-loader!sass-loader!./Logo.scss';

const cnLogo = cn('Logo');

const defaultLogo = '/assets/logo/default/logo.svg';

export const Logo: FC = observer(() => (
  <>
    <Favicon />
    {
      <Link href='/' className={cnLogo()}>
        <img src={environment.logo || defaultLogo} alt='logo' />
        <h1 className={cnLogo('Title')}>{environment.title}</h1>
      </Link>
    }
  </>
));
