import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import './BboxPreview-Error.scss';

const cnBboxPreview = cn('BboxPreview');

export interface BboxPreviewErrorProps {
  message?: string;
}

export const BboxPreviewError: FC<BboxPreviewErrorProps> = ({ message = 'Превью недоступно' }) => {
  return <div className={cnBboxPreview('Error')}>{message}</div>;
};
