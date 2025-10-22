import React, { type FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { type ServicesInfo } from '../ServicesCalculator.models';

import './ServicesCalculator-Price.scss';

const cnServicesCalculatorPrice = cn('ServicesCalculator', 'Price');

interface ServicesCalculatorPriceProps {
  service: Partial<ServicesInfo>;
}

export const ServicesCalculatorPrice: FC<ServicesCalculatorPriceProps> = observer(({ service }) => (
  <div className={cnServicesCalculatorPrice()}>{(service.price || 0) * (service.counter || 0)} руб.</div>
));
