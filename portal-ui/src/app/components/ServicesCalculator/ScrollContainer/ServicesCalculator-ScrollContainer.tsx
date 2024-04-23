import React, { FC } from 'react';
import { Card } from '@mui/material';
import { cn } from '@bem-react/classname';

import { ServicesCalculatorControls } from '../Controls/ServicesCalculator-Controls';
import { ServicesCalculatorService } from '../Service/ServicesCalculator-Service';
import { ServicesInfo } from '../ServicesCalculator';

const cnServicesCalculatorScrollContainer = cn('ServicesCalculator', 'ScrollContainer');

interface ServicesCalculatorScrollContainerProps {
  selectAllService: () => void;
  selectedAllServices: boolean;
  openServicesDialog: () => void;
  selectService: (service: ServicesInfo) => void;
  deleteService: (service: ServicesInfo) => void;
  selectedServices: ServicesInfo[];
}

export const ServicesCalculatorScrollContainer: FC<ServicesCalculatorScrollContainerProps> = ({
  selectAllService,
  selectedAllServices,
  openServicesDialog,
  selectedServices,
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
