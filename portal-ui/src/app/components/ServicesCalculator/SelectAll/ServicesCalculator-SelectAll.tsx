import React, { FC } from 'react';
import { Checkbox } from '@mui/material';
import { cn } from '@bem-react/classname';

import { generateRandomId } from '../../../services/util/randomId';

const cnServicesCalculatorSelectAll = cn('ServicesCalculator', 'SelectAll');

interface ServicesCalculatorSelectAllProps {
  selectedAllServices: boolean;
  selectAllService(): void;
}

const htmlId = 'servicesCalculator_' + generateRandomId();

export const ServicesCalculatorSelectAll: FC<ServicesCalculatorSelectAllProps> = ({
  selectAllService,
  selectedAllServices
}) => (
  <div className={cnServicesCalculatorSelectAll()}>
    <Checkbox onChange={selectAllService} inputProps={{ id: htmlId }} checked={selectedAllServices} />
    <label htmlFor={htmlId}>Выделить все</label>
  </div>
);
