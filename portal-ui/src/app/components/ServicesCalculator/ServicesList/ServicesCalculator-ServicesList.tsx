import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ServicesCalculatorScrollContainer } from '../ScrollContainer/ServicesCalculator-ScrollContainer';
import { ServicesInfo } from '../ServicesCalculator';

import '!style-loader!css-loader!sass-loader!./ServicesCalculator-ServicesList.scss';

const cnServicesCalculatorServicesList = cn('ServicesCalculator', 'ServicesList');

interface ServicesCalculatorServicesListProps {
  selectedAllServices: boolean;
  selectedServices: ServicesInfo[];
  selectAllService(): void;
  openServicesDialog(): void;
  selectService(service: ServicesInfo): void;
  deleteService(service: ServicesInfo): void;
}

export const ServicesCalculatorServicesList: FC<ServicesCalculatorServicesListProps> = props => (
  <div className={cnServicesCalculatorServicesList(null, ['scroll'])}>
    <ServicesCalculatorScrollContainer {...props} />
  </div>
);
