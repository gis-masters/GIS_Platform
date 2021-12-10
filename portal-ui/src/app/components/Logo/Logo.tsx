import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { env } from '../../stores/Env.store';
import { Favicon } from '../Favicon/Favicon';
import { Link } from '../Link/Link';

const cnLogo = cn('Logo');

const defaultLogo = '/assets/logo/default/logo.svg';

export const Logo: FC = observer(() => (
  <>
    <Favicon />
    {env.loaded && (
      <Link href='/' className={cnLogo()}>
        <img src={env.logo || defaultLogo} alt='logo' />
      </Link>
    )}
  </>
));
