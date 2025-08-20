import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { ServicesCalculatorServiceDescription } from '../ServiceDescription/ServicesCalculator-ServiceDescription';
import { ServicesCalculatorServiceDetails } from '../ServiceDetails/ServicesCalculator-Service-Details';
import { ServicesAdditions } from '../ServicesCalculator';

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
