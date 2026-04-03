import React, { type FC } from 'react';
import { Edit } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import './PrintMapImageControl-Overlay.scss';

const cnPrintMapImageControlOverlay = cn('PrintMapImageControl', 'Overlay');

export const PrintMapImageControlOverlay: FC = () => (
  <span className={cnPrintMapImageControlOverlay()} aria-hidden>
    <Edit fontSize='medium' />
  </span>
);
