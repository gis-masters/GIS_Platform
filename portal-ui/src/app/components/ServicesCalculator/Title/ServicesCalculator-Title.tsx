import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import './ServicesCalculator-Title.scss';

const cnServicesCalculatorTitle = cn('ServicesCalculator', 'Title');

export const ServicesCalculatorTitle: FC = () => (
  <h1 className={cnServicesCalculatorTitle('Title')}>Калькулятор услуг</h1>
);
