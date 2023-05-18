import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const LayerAdd: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M13.043.83l-2.918 2.269v3.679H6.882v3.19H2.846l1.211.944 8.986 6.986 8.973-6.986 2-1.548L13.043.829zm8.985 13.167l-8.997 6.998-8.986-6.986-1.975 1.536 10.973 8.535 10.973-8.535-1.988-1.548z' />
      <path d='M3.261 3.19V0h2.162v3.19h3.242v2.128H5.423v3.19H3.26v-3.19H.018V3.191z' />
    </SvgIcon>
  ),
  { muiName: 'LayerAdd' }
);
