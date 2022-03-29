import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

const cnServicesCalculatorCounterValue = cn('ServicesCalculator', 'CounterValue');

interface ServicesCalculatorCounterValueProps {
  counter: number;
}

export const ServicesCalculatorCounterValue: FC<ServicesCalculatorCounterValueProps> = ({ counter }) => (
  <div className={cnServicesCalculatorCounterValue()}>{counter}</div>
);
