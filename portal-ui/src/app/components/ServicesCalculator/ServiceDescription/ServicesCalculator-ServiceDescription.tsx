import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

const cnServicesCalculatorServiceDescription = cn('ServicesCalculator', 'ServiceDescription');

interface ServicesCalculatorServiceDescriptionProps {
  serviceDescription: string;
}

export const ServicesCalculatorServiceDescription: FC<ServicesCalculatorServiceDescriptionProps> = ({
  serviceDescription
}) => <div className={cnServicesCalculatorServiceDescription()}>{serviceDescription}</div>;
