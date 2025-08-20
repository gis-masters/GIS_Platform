import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ServicesCalculatorCounter } from '../Counter/ServicesCalculator-Counter';
import { ServicesCalculatorPrice } from '../Price/ServicesCalculator-Price';
import { ServicesInfo } from '../ServicesCalculator';

import '!style-loader!css-loader!sass-loader!./ServicesCalculator-Service-Details.scss';

const cnServicesCalculatorServiceDetails = cn('ServicesCalculator', 'ServiceDetails');

interface ServicesCalculatorServiceDetailsProps {
  service: Partial<ServicesInfo>;
}

export const ServicesCalculatorServiceDetails: FC<ServicesCalculatorServiceDetailsProps> = ({ service }) => (
  <div className={cnServicesCalculatorServiceDetails()}>
    <ServicesCalculatorCounter service={service} />
    <ServicesCalculatorPrice service={service} />
  </div>
);
