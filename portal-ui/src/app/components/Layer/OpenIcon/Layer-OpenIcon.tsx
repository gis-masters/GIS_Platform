import React, { type FC } from 'react';
import { ChevronRight } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import './Layer-OpenIcon.scss';

const cnLayerOpenIcon = cn('Layer', 'OpenIcon');

interface LayerOpenIconProps {
  open: boolean;
}

export const LayerOpenIcon: FC<LayerOpenIconProps> = ({ open }) => (
  <ChevronRight fontSize='inherit' className={cnLayerOpenIcon({ open })} />
);
