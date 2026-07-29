import React, { type FC, type PropsWithChildren } from 'react';
import { cn } from '@bem-react/classname';

import './BboxPreview-Coordinates.scss';

const cnBboxPreview = cn('BboxPreview');

export const BboxPreviewCoordinates: FC<PropsWithChildren> = ({ children }) => (
  <div className={cnBboxPreview('Coordinates')}>{children}</div>
);
