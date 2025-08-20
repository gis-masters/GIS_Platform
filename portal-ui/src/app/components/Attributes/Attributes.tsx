import React, { FC, lazy, Suspense } from 'react';
import { IClassNameProps } from '@bem-react/core';

const AttributesAsync = lazy(() => import('./Attributes.async'));

export const Attributes: FC<IClassNameProps> = props => (
  <Suspense>
    <AttributesAsync {...props} />
  </Suspense>
);
