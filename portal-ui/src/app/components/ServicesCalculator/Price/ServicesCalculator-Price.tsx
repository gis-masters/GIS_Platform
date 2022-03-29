import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';

import { ServicesInfo } from '../ServicesCalculator';

import '!style-loader!css-loader!sass-loader!./ServicesCalculator-Price.scss';

const cnServicesCalculatorPrice = cn('ServicesCalculator', 'Price');

interface ServicesCalculatorPriceProps {
  service: Partial<ServicesInfo>;
}

export const ServicesCalculatorPrice: FC<ServicesCalculatorPriceProps> = observer(({ service }) => (
  <div className={cnServicesCalculatorPrice()}>{service.price * service.counter} руб.</div>
));
