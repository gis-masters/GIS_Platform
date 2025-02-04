import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const LabelsOutlined: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M19.647 3.83c-.36-.51-.96-.84-1.63-.84l-11 .01c-1.1 0-2 .89-2 1.99v10c0 1.1.9 1.99 2 1.99l11 .01c.67 0 1.27-.33 1.63-.84l4.37-6.16zm-1.63 11.16h-11v-10h11l3.55 5z' />
      <path d='M2.976 7.016c-1.1 0-1.999.89-1.999 1.99v10c0 1.1.9 1.99 2 1.99l11 .01c.67 0 1.27-.33 1.63-.84l.823-1.158H2.976Z' />
    </SvgIcon>
  ),
  { muiName: 'LabelsOutlined' }
);
