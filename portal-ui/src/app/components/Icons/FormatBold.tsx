import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const FormatBold: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M13.4941 4.45455V19H10.5112V4.45455H13.4941ZM1.72567 19L6.28533 11.3295L1.91744 4.45455H5.70295L8.96999 10.4418H15.1135L18.2953 4.45455H22.0666L17.8052 11.3082L22.2797 19H18.6078L15.5325 13.2827H8.52255L5.36914 19H1.72567Z' />
    </SvgIcon>
  ),
  { muiName: 'Import' }
);
