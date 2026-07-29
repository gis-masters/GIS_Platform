import React, { forwardRef } from 'react';
import { cn } from '@bem-react/classname';

import './BboxPreview-MapContainer.scss';

const cnBboxPreview = cn('BboxPreview');

export const BboxPreviewMapContainer = forwardRef<HTMLDivElement, object>(function BboxPreviewMapContainer(_, ref) {
  return <div ref={ref} className={cnBboxPreview('MapContainer')} />;
});
