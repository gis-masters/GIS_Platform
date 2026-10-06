import React, { type FC } from 'react';
import { CircularProgress } from '@mui/material';

import { cnToast } from '../Toast.classname';

import './Toast-Loader.scss';

export const ToastLoader: FC = () => <CircularProgress className={cnToast('Loader')} color='inherit' size={20} />;
