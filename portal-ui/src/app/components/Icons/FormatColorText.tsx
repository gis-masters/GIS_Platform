import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const FormatColorText: SvgIconComponent = Object.assign(
  ({ stroke, ...props }: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M8.45961 18H5.92836L10.537 4.90909H13.4646L18.0796 18H15.5484L12.0519 7.59375H11.9497L8.45961 18ZM8.5427 12.8672H15.4461V14.772H8.5427V12.8672Z' />
      <line x1='4' y1='22.75' x2='20' y2='22.75' stroke={stroke} strokeWidth='3.5' />
    </SvgIcon>
  ),
  { muiName: 'Import' }
);
