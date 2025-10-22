import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import './ServicesCalculator-Button.scss';

const cnServicesCalculatorButton = cn('ServicesCalculator', 'Button');

interface ServicesCalculatorButtonProps {
  action: string;
  onClick(): void;
}

export const ServicesCalculatorButton: FC<ServicesCalculatorButtonProps> = ({ action, onClick }) => (
  <button className={cnServicesCalculatorButton()} onClick={onClick}>
    {action}
  </button>
);
