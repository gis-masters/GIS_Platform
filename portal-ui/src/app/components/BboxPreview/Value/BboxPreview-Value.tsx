import React, { type FC, type PropsWithChildren } from 'react';
import { cn } from '@bem-react/classname';

import './BboxPreview-Value.scss';

const cnBboxPreview = cn('BboxPreview');

export const BboxPreviewValue: FC<PropsWithChildren> = ({ children }) => (
  <div className={cnBboxPreview('Value')}>{children}</div>
);
