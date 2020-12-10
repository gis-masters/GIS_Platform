import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import Favicon from 'react-favicon';

import { Link } from '../Link/Link';
import { env } from '../../stores/Env.store';

const cnLogo = cn('Logo');

const defaultLogo = '/assets/logo/default/logo.svg';
const defaultFavicon = '/assets/logo/default/favicon-32x32.png';

export const Logo: FC = observer(
  () =>
    env.loaded && (
      <>
        <Favicon url={env.favicon || defaultFavicon} />
        <Link url='/' className={cnLogo()}>
          <img src={env.logo || defaultLogo} alt='logo' />
        </Link>
      </>
    )
);
