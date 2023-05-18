import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const ContourDraw: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M7.113 17.632l-.469.883-.876 1.491 1.62.777 7.708 3.222 8.849-8.849L18.888 3.78H15.16v2.528h2.085l3.666 8.343-6.32 6.321-7.478-3.339M3.562 11.07c-1.423.25-2.366 1.581-2.111 2.98.2 1.104-.688 1.86-1.408 1.986.975.89 2.44 1.31 3.735 1.083 1.894-.333 3.154-2.11 2.815-3.973-.254-1.399-1.608-2.326-3.03-2.076zm10.315-9.96L12.523.181a.867.852 0 00-1.208.212l-6.307 8.9 2.779 1.903 6.306-8.9a.843.843 0 00-.216-1.188z' />
    </SvgIcon>
  ),
  { muiName: 'ContourDraw' }
);
