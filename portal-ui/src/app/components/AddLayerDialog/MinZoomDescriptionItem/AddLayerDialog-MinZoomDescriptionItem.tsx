import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

const cnAddLayerDialogMinZoomDescriptionItem = cn('AddLayerDialog', 'MinZoomDescriptionItem');

interface AddLayerDialogMinZoomDescriptionItemProps {
  zoom: number;
  scale: string;
}

export const AddLayerDialogMinZoomDescriptionItem: FC<AddLayerDialogMinZoomDescriptionItemProps> = ({
  zoom,
  scale
}) => <div className={cnAddLayerDialogMinZoomDescriptionItem()}>{`${zoom} — ${scale}`}</div>;
