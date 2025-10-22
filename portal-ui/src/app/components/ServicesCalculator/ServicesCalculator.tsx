import React, { type FC, lazy, Suspense } from 'react';

const ServicesCalculatorAsync = lazy(() => import('./ServicesCalculator.chunkroot'));

export const ServicesCalculator: FC = props => (
  <Suspense>
    <ServicesCalculatorAsync {...props} />
  </Suspense>
);
