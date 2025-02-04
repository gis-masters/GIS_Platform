import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const ContourAdd: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M6.335 17.305v-3.413H3.807v5.057l11.377 5.056 8.85-8.849L18.976 3.78H13.92v2.528h3.413L21 14.65l-6.32 6.321-8.344-3.666M.015 3.78v2.528h3.792V10.1h2.528V6.307h3.793V3.78H6.335V-.014H3.807V3.78z' />
    </SvgIcon>
  ),
  { muiName: 'ContourAdd' }
);
