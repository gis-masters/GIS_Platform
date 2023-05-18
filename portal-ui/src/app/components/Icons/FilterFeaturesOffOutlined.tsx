import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const FilterFeaturesOffOutlined: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M8.393 11.02a1.857 1.857 0 0 1-.36-1.1c0-1.028.84-1.87 1.868-1.87s1.87.842 1.87 1.87c-.265-.182-.718-.655-1.06-.96-.828.729-1.108 1.003-2.318 2.06zm5.4 6.353c-1.062 1.2-2.359 2.453-3.892 3.761-4.98-4.252-7.476-7.925-7.476-11.028 0-4.654 3.551-7.663 7.476-7.663s7.477 3.01 7.477 7.663c-1.796.003-1.87 0-1.87 0 0-3.392-2.476-5.794-5.607-5.794-3.13 0-5.607 2.402-5.607 5.794 0 2.187 1.822 5.085 5.607 8.542a33.393 33.393 0 0 0 2.555-2.578' />
      <path d='M21.138 13.003l-2.595 3.307 1.039 1.04c.749-.953 3.62-4.631 3.62-4.631a.725.725 0 0 0-.574-1.17H13.78l1.454 1.454zm-10.28-2.32L9.828 11.71l6.258 6.382v4.362c0 .4.328.727.727.727h1.454a.73.73 0 0 0 .727-.727v-1.578l4.202 4.202 1.025-1.025z' />
    </SvgIcon>
  ),
  { muiName: 'FilterFeaturesOffOutlined' }
);
