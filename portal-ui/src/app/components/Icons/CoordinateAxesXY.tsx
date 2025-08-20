import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const CoordinateAxesXY: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M20.006 13.72l2.026-3.38h-1.668l-1.189 1.984-1.196-1.984h-1.668l2.026 3.38-2.27 3.78h1.669l1.432-2.39L20.6 17.5h1.676zM10.577 4.987l2.106-3.38h-1.668l-1.19 1.984L8.63 1.608H6.962l2.083 3.38.001 3.754c.52.009.567.011 1.53.009z' />
      <path d='M23.244 20.093l-4-2.942v1.942H1.069v2h18.175v1.942z' />
      <path d='M3.917.997L1.024 5.033l1.942-.024.223 18.173 2-.024-.223-18.174 1.941-.023z' />
    </SvgIcon>
  ),
  { muiName: 'CoordinateAxesXY' }
);
