import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const TypeGmlPoint: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M12 2C6.49 2 2 6.49 2 12c0 .51.038 1.01.113 1.5h2.053A7.528 7.528 0 0 1 4 12.06C4 7.65 7.59 4 12 4s8 3.59 8 8c.009.45-.046.98-.145 1.5h2.03c.075-.506.115-1.02.115-1.5 0-5.51-4.49-10-10-10zm0 7c-1.66 0-3 1.34-3 3 .021.58.151 1.036.397 1.5H14.603c.256-.46.394-1.043.397-1.5 0-1.66-1.34-3-3-3z' />
      <g>
        <path d='m4.5 16.496 2.898.008L6.059 15H4.182L3 16.668v4.215L4.145 22.5h2.15L7.5 20.799v-2.042H6V21H4.5Z' />
        <path d='M9 22.5V15h1.071l2.679 5.307L15.429 15H16.5v7.5h-1.286v-4.316L13.286 22.5h-1.072l-1.928-4.316V22.5ZM18 22.5V15h1.5v6h3v1.5h-3z' />
      </g>
    </SvgIcon>
  ),
  { muiName: 'TypeGmlPoint' }
);
