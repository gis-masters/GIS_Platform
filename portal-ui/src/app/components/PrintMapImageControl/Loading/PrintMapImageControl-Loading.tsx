import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { Loading } from '../../Loading/Loading';

import './PrintMapImageControl-Loading.scss';

const cnPrintMapImageControlLoading = cn('PrintMapImageControl', 'Loading');

export const PrintMapImageControlLoading: FC = () => <Loading className={cnPrintMapImageControlLoading()} size={28} />;
