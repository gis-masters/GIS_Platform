import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Close } from '@mui/icons-material';

import { IconButton } from '../../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./ServicesCalculator-Delete.scss';

const cnServicesCalculatorDelete = cn('ServicesCalculator', 'Delete');

interface ServicesCalculatorDeleteProps {
  clickHandler: () => void;
}

export const ServicesCalculatorDelete: FC<ServicesCalculatorDeleteProps> = ({ clickHandler }) => (
  <IconButton className={cnServicesCalculatorDelete()} onClick={clickHandler}>
    <Close />
  </IconButton>
);
