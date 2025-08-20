import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const ViewLocation: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M8.928 3.602C6.112 4.753 4 7.487 4 11.2c0 3.32 2.67 7.25 8 11.8 5.33-4.55 8-8.48 8-11.8V11h-2v.2c0 2.34-1.95 5.44-6 9.14-4.05-3.7-6-6.79-6-9.14 0-2.407 1.166-4.347 2.928-5.382V3.602z' />
      <circle cx='12' cy='11' r='2' />
      <path d='M17.01 2.282c2.142 0 4.051 1.117 5.052 2.91-1.001 1.792-2.91 2.91-5.052 2.91-2.142 0-4.051-1.118-5.052-2.91 1-1.793 2.91-2.91 5.052-2.91m0-1.747c-3.178 0-5.89 1.933-6.985 4.657 1.095 2.724 3.807 4.656 6.985 4.656 3.178 0 5.89-1.932 6.985-4.656C22.9 2.468 20.188.535 17.01.535Zm0 6.403c-.966 0-1.746-.78-1.746-1.746s.78-1.746 1.746-1.746 1.746.78 1.746 1.746-.78 1.746-1.746 1.746z' />
    </SvgIcon>
  ),
  { muiName: 'ViewLocation' }
);
