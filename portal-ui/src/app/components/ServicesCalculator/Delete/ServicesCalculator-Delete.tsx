import React, { FC } from 'react';
import { Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./ServicesCalculator-Delete.scss';

const cnServicesCalculatorDelete = cn('ServicesCalculator', 'Delete');

interface ServicesCalculatorDeleteProps {
  onClick(): void;
}

export const ServicesCalculatorDelete: FC<ServicesCalculatorDeleteProps> = ({ onClick }) => (
  <IconButton className={cnServicesCalculatorDelete()} onClick={onClick}>
    <Close />
  </IconButton>
);
