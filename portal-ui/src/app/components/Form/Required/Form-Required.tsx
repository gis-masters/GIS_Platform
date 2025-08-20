import React, { FC } from 'react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

const cnForm = cn('Form');

import '!style-loader!css-loader!sass-loader!./Form-Required.scss';

export const FormRequired: FC = () => (
  <Tooltip title='Обязательное поле'>
    <span className={cnForm('Required')}>*</span>
  </Tooltip>
);
