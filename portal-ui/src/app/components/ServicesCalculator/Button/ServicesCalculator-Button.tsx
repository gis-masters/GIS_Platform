import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./ServicesCalculator-Button.scss';

const cnServicesCalculatorButton = cn('ServicesCalculator', 'Button');

interface ServicesCalculatorButtonProps {
  clickHandler: () => void;
  action: string;
}

export const ServicesCalculatorButton: FC<ServicesCalculatorButtonProps> = ({ clickHandler, action }) => (
  <button className={cnServicesCalculatorButton()} onClick={clickHandler}>
    {action}
  </button>
);
