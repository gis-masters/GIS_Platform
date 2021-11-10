import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Tooltip } from '@mui/material';

const cnForm = cn('Form');

import '!style-loader!css-loader!sass-loader!./Form-Required.scss';

export const FormRequired: FC = () => (
  <Tooltip title='Обязательное поле'>
    <span className={cnForm('Required')}>*</span>
  </Tooltip>
);
