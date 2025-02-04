import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const TypeMidLine: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M9 13.5v-2.41L11.7 8H16V2h-6v4.9L7.3 10H3v6l3-2H5v-2h2v1.5zM12 4h2v2h-2z' />
      <g>
        <path
          d='M6 22.5V15h1.07l2.678 5.307L12.425 15h1.071v7.5h-1.285v-4.316L10.283 22.5h-1.07l-1.928-4.316V22.5ZM15 22.5V15h1.5v7.5z'
          transform='matrix(.99998 0 0 .99998 0 0)'
        />
        <path
          d='M18 15v7.493h2.5s2.002-.063 2.002-3.743c0-3.68-2.002-3.75-2.002-3.75Zm2.14 6h-.64v-4.5h.64s.86 0 .86 2.25-.86 2.25-.86 2.25Z'
          transform='matrix(.99998 0 0 .99998 0 0)'
        />
      </g>
    </SvgIcon>
  ),
  { muiName: 'TypeMidLine' }
);
