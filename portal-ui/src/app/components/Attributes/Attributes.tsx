import React, { type FC, lazy, Suspense } from 'react';
import { type IClassNameProps } from '@bem-react/core';

const AttributesAsync = lazy(() => import('./Attributes.chunkroot'));

export const Attributes: FC<IClassNameProps> = props => (
  <Suspense>
    <AttributesAsync {...props} />
  </Suspense>
);
