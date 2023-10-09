import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const TypeGmlPolygon: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M21 14V7h2V1h-6v2H7V1H1v6h2v9l2-2V7h2V5h10v2h2v7M3 3h2v2H3Zm16 2V3h2v2z' />
      <g>
        <path
          d='m4.5 16.496 2.898.008L6.059 15H4.182L3 16.668v4.215L4.145 22.5h2.15L7.5 20.799v-2.042H6V21H4.5Z'
          transform='translate(1.5)'
        />
        <path
          d='M9 22.5V15h1.071l2.679 5.307L15.429 15H16.5v7.5h-1.286v-4.316L13.286 22.5h-1.072l-1.928-4.316V22.5ZM18 22.5V15h1.5v6h3v1.5h-3z'
          transform='translate(1.5)'
        />
      </g>
    </SvgIcon>
  ),
  { muiName: 'TypeGmlPolygon' }
);
