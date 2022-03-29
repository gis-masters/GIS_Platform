import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ServicesInfo } from '../ServicesCalculator';
import { ServicesCalculatorScrollContainer } from '../ScrollContainer/ServicesCalculator-ScrollContainer';

import '!style-loader!css-loader!sass-loader!./ServicesCalculator-ServicesList.scss';

const cnServicesCalculatorServicesList = cn('ServicesCalculator', 'ServicesList');

interface ServicesCalculatorServicesListProps {
  selectAllService: () => void;
  selectedAllServices: boolean;
  openServicesDialog: () => void;
  selectService: (service: ServicesInfo) => void;
  deleteService: (service: ServicesInfo) => void;
  selectedServices: ServicesInfo[];
}

export const ServicesCalculatorServicesList: FC<ServicesCalculatorServicesListProps> = props => (
  <div className={cnServicesCalculatorServicesList(null, ['scroll'])}>
    <ServicesCalculatorScrollContainer {...props} />
  </div>
);
