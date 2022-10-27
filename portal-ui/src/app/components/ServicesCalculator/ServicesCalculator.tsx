import React, { FC, lazy, Suspense } from 'react';

export { ServicesInfo, InvoiceInfo, ServicesAdditions } from './ServicesCalculator.async';

const ServicesCalculatorAsync = lazy(() => import('./ServicesCalculator.async'));

export const ServicesCalculator: FC = props => (
  <Suspense>
    <ServicesCalculatorAsync {...props} />
  </Suspense>
);
