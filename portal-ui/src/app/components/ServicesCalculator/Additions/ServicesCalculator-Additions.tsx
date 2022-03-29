import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { ServicesAdditions } from '../ServicesCalculator';
import { ServicesCalculatorServiceDetails } from '../ServiceDetails/ServicesCalculator-Service-Details';
import { ServicesCalculatorServiceDescription } from '../ServiceDescription/ServicesCalculator-ServiceDescription';

import '!style-loader!css-loader!sass-loader!./ServicesCalculator-Additions.scss';

const cnServicesCalculatorAdditions = cn('ServicesCalculator', 'Additions');

interface ServicesCalculatorAdditionsProps {
  addition: ServicesAdditions;
}

export const ServicesCalculatorAdditions: FC<ServicesCalculatorAdditionsProps> = observer(({ addition }) => (
  <div className={cnServicesCalculatorAdditions()}>
    <ServicesCalculatorServiceDescription serviceDescription={addition.service} />
    <ServicesCalculatorServiceDetails service={addition} />
  </div>
));
