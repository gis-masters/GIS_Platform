import React from 'react';
import { SvgIcon } from '@mui/material';
import { type SvgIconComponent } from '@mui/icons-material';
import { type SvgIconProps } from '@mui/material/SvgIcon';

export const VerticesModification: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M23 7V1h-6v2H7V1H1v6h2v10H1v6h6v-2h10v2h6v-6h-2V7zM3 3h2v2H3zm2 18H3v-2h2zm12-2H7v-2H5V7h2V5h10v2h2v10h-2zm4 2h-2v-2h2zM19 5V3h2v2z' />
      <path d='M5 5l10 3-3.77 1.26 4.27 4.27-1.98 1.98-4.27-4.27L8 15z' />
    </SvgIcon>
  ),
  { muiName: 'VerticesModification' }
);
