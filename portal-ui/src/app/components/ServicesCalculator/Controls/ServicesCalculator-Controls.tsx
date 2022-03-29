import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { CardActions } from '@mui/material';

import { Button } from '../../Button/Button';
import { ServicesCalculatorSelectAll } from '../SelectAll/ServicesCalculator-SelectAll';

import '!style-loader!css-loader!sass-loader!./ServicesCalculator-Controls.scss';

const cnServicesCalculatorControls = cn('ServicesCalculator', 'Controls');

interface ServicesCalculatorControlsProps {
  selectAllService: () => void;
  selectedAllServices: boolean;
  openServicesDialog: () => void;
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
