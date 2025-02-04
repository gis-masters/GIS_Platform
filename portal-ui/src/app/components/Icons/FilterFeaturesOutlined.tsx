import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const FilterFeaturesOutlined: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M14.226 13.06h6.532l-3.257 4.07zm-2.307-.282c1.457 1.868 4.147 5.33 4.147 5.33v4.326c0 .396.324.721.721.721h1.442a.723.723 0 0 0 .721-.721v-4.327s2.683-3.461 4.14-5.329a.72.72 0 0 0-.57-1.161H12.49a.72.72 0 0 0-.57 1.161z' />
      <path d='M9.901 11.789a1.875 1.875 0 0 1-1.869-1.87c0-1.027.841-1.869 1.87-1.869 1.027 0 1.868.842 1.868 1.87s-.84 1.869-1.869 1.869zm3.892 5.584c-1.062 1.2-2.359 2.453-3.892 3.761-4.98-4.252-7.476-7.925-7.476-11.028 0-4.654 3.551-7.663 7.476-7.663s7.477 3.01 7.477 7.663c-1.796.003-1.87 0-1.87 0 0-3.392-2.476-5.794-5.607-5.794-3.13 0-5.607 2.402-5.607 5.794 0 2.187 1.822 5.085 5.607 8.542a33.393 33.393 0 0 0 2.555-2.578' />
    </SvgIcon>
  ),
  { muiName: 'FilterFeaturesOutlined' }
);
