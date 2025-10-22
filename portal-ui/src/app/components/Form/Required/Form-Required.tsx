import React, { type FC } from 'react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

const cnForm = cn('Form');

import './Form-Required.scss';

export const FormRequired: FC = () => (
  <Tooltip title='Обязательное поле'>
    <span className={cnForm('Required')}>*</span>
  </Tooltip>
);
