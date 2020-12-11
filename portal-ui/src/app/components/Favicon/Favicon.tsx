import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { default as ReactFavicon } from 'react-favicon';

import { env } from '../../stores/Env.store';

const cnFavicon = cn('Favicon');

const defaultFavicon = '/assets/logo/default/favicon-32x32.png';

export const Favicon: FC = observer(() => env.loaded && <ReactFavicon url={env.favicon || defaultFavicon} />);
