import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const FilterOutlined: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 19 20'>
      <path
        d='M1 1h17l-6 8v10l-5-4V9z'
        strokeWidth='2'
        stroke='currentColor'
        fill='none'
        fillRule='evenodd'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgIcon>
  ),
  { muiName: 'FilterOutlined' }
);
