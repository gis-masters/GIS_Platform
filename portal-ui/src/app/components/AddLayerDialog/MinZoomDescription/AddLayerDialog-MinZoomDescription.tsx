import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { AddLayerDialogMinZoomDescriptionItem } from '../MinZoomDescriptionItem/AddLayerDialog-MinZoomDescriptionItem';

const cnAddLayerDialogMinZoomDescription = cn('AddLayerDialog', 'MinZoomDescription');

const minZoomLevels = [
  { zoom: 10, scale: '1:250 000' },
  { zoom: 12, scale: '1:100 000' },
  { zoom: 15, scale: '1:10 000' },
  { zoom: 20, scale: '1:500' },
  { zoom: 25, scale: '1:10' }
];

export const AddLayerDialogMinZoomDescription: FC = () => (
  <div className={cnAddLayerDialogMinZoomDescription()}>
    Скрывает слой при отдалении карты, начиная указанного уровня:
    {minZoomLevels.map(({ zoom, scale }) => (
      <AddLayerDialogMinZoomDescriptionItem key={zoom} zoom={zoom} scale={scale} />
    ))}
  </div>
);
