import React, { FC } from 'react';
import { Card } from '@mui/material';
import { cn } from '@bem-react/classname';

import { ServicesCalculatorControls } from '../Controls/ServicesCalculator-Controls';
import { ServicesCalculatorService } from '../Service/ServicesCalculator-Service';
import { ServicesInfo } from '../ServicesCalculator';

const cnServicesCalculatorScrollContainer = cn('ServicesCalculator', 'ScrollContainer');

interface ServicesCalculatorScrollContainerProps {
  selectedAllServices: boolean;
  selectedServices: ServicesInfo[];
  selectAllService(): void;
  openServicesDialog(): void;
  selectService(service: ServicesInfo): void;
  deleteService(service: ServicesInfo): void;
}

export const ServicesCalculatorScrollContainer: FC<ServicesCalculatorScrollContainerProps> = ({
  selectedAllServices,
  selectedServices,
  selectAllService,
  openServicesDialog,
  selectService,
  deleteService
}) => (
  <div className={cnServicesCalculatorScrollContainer('ScrollContainer')}>
    <Card sx={{ minWidth: 300 }}>
      <ServicesCalculatorControls
        selectAllService={selectAllService}
        selectedAllServices={selectedAllServices}
        openServicesDialog={openServicesDialog}
      />
    </Card>

    {selectedServices.map((service, index) => (
      <ServicesCalculatorService
        key={index}
        service={service}
        selectService={selectService}
        deleteService={deleteService}
      />
    ))}
  </div>
);
