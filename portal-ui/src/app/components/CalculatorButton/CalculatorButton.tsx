import React, { FC } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { CalculateOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./CalculatorButton.scss';

const cnCalculatorButton = cn('CalculatorButton');

export const CalculatorButton: FC = () => (
  <Tooltip title={'Калькулятор предоставления сведений'}>
    <IconButton className={cnCalculatorButton()} target='_blank' href={'/services-calculator'} color='inherit'>
      <CalculateOutlined />
    </IconButton>
  </Tooltip>
);
