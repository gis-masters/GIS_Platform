import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const FormatItalic: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M14.3651 19L10.6364 12.6435H9.34375L8.28551 19H5.65057L8.06534 4.45455H10.7003L9.70597 10.4347H10.3665L16.5312 4.45455H19.777L12.9446 11.0881L17.6108 19H14.3651Z' />
    </SvgIcon>
  ),
  { muiName: 'Import' }
);
