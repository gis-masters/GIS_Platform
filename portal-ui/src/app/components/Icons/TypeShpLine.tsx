import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const TypeShpLine: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M9 13.5v-2.41L11.7 8H16V2h-6v4.9L7.3 10H3v6l3-2H5v-2h2v1.5zM12 4h2v2h-2z' />
      <path d='M19.5 22.514h1.286v-6.01h1.285s.643-.005.643.75c0 .756-.643.752-.643.752h-1.285v1.502h1.285c.643 0 1.929-.052 1.929-2.253 0-2.202-1.29-2.254-1.93-2.254H19.5zm-3.002-.001h1.332v-7.512h-1.333v3.004H13.5V15h-1.334v7.512H13.5v-3.005h2.997m-5.994-3.004v-1.502H7.258c-.625 0-1.258.377-1.258 2.254s.633 2.253 1.258 2.253h1.37s.625 0 .625.751c0 .752-.625.752-.625.752H6v1.502h3.253c.625 0 1.25-.373 1.25-2.254 0-1.88-.625-2.252-1.25-2.253h-1.37s-.625 0-.625-.751c0-.752.625-.752.625-.752z' />
    </SvgIcon>
  ),
  { muiName: 'TypeShpLine' }
);
