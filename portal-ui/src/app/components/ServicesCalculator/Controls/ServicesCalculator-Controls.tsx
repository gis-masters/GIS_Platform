import React, { FC } from 'react';
import { CardActions } from '@mui/material';
import { cn } from '@bem-react/classname';

import { Button } from '../../Button/Button';
import { ServicesCalculatorSelectAll } from '../SelectAll/ServicesCalculator-SelectAll';

import '!style-loader!css-loader!sass-loader!./ServicesCalculator-Controls.scss';

const cnServicesCalculatorControls = cn('ServicesCalculator', 'Controls');

interface ServicesCalculatorControlsProps {
  selectedAllServices: boolean;
  selectAllService(): void;
  openServicesDialog(): void;
}

export const ServicesCalculatorControls: FC<ServicesCalculatorControlsProps> = ({
  selectAllService,
  selectedAllServices,
  openServicesDialog
}) => (
  <CardActions className={cnServicesCalculatorControls()}>
    <ServicesCalculatorSelectAll selectAllService={selectAllService} selectedAllServices={selectedAllServices} />
    <Button size='small' color='primary' onClick={openServicesDialog}>
      Выбрать услуги
    </Button>
  </CardActions>
);
