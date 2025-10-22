import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import './ServicesCalculator-ResultPrice.scss';

const cnServicesCalculatorResultPrice = cn('ServicesCalculator', 'ResultPrice');

interface ServicesCalculatorResultPriceProps {
  resultPrice: number;
}

export const ServicesCalculatorResultPrice: FC<ServicesCalculatorResultPriceProps> = ({ resultPrice }) => (
  <div className={cnServicesCalculatorResultPrice()}>Итого: {resultPrice} рублей</div>
);
