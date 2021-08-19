import React, { FC } from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

export const FilterOutlined: FC<SvgIconProps> = props => (
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
);
