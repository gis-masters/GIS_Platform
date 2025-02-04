import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const TypeTabLine: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M9 13.5v-2.41L11.7 8H16V2h-6v4.9L7.3 10H3v6l3-2H5v-2h2v1.5zM12 4h2v2h-2z' />
      <path d='M7.5 22.5v-6H6V15h4.5v1.5H9v6zm3-.013v-5L12.465 15H16.5v7.487H15V20h-3v2.487m3-3.987v-2h-1.978L12 17.987v.513m6 3.988V15h3.494c.471 0 1 .643 1 1.114v.945c0 .5-.25.75-.5 1l-.25.25-.25.25.25.25.25.25c.25.25.5.5.5 1v1.428c0 .471-.529 1-1 1zm3.2-1.288v-1.898h-1.96V21.2zm-.206-3.398v-1.3H19.24v1.3z' />
    </SvgIcon>
  ),
  { muiName: 'TypeTabLine' }
);
