import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const CoordinateAxesYX: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M10.69 4.505l2.022-3.372h-1.664L9.862 3.112 8.669 1.133H7.005l2.021 3.372-2.264 3.771h1.664L9.855 5.89l1.428 2.386h1.672zM20.17 13.814l2.1-3.372h-1.664l-1.185 1.979-1.193-1.979h-1.665l2.08 3.372v3.745c.52.009.565.011 1.525.009z' />
      <path d='M23.244 20.093l-4-2.942v1.942H1.069v2h18.175v1.942z' />
      <path d='M3.917.997L1.024 5.033l1.942-.024.223 18.173 2-.024-.223-18.174 1.941-.023z' />
    </SvgIcon>
  ),
  { muiName: 'CoordinateAxesYX' }
);
