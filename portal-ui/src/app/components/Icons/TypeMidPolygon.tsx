import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const TypeMidPolygon: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M21 14V7h2V1h-6v2H7V1H1v6h2v10H1v6h4V7h2V5h10v2h2v7M3 3h2v2H3Zm2 18H3v-2h2ZM19 5V3h2v2z' />
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
  { muiName: 'TypeMidPolygon' }
);
