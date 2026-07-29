import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { RingSpinner } from '../../RingSpinner/RingSpinner';

import './BboxPreview-Loading.scss';

const cnBboxPreview = cn('BboxPreview');

export const BboxPreviewLoading: FC = () => (
  <div className={cnBboxPreview('Loading')}>
    <RingSpinner text='Загрузка превью' />
  </div>
);
