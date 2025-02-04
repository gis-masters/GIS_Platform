import React from 'react';
import { SvgIcon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';

export const TypeMidPoint: SvgIconComponent = Object.assign(
  (props: SvgIconProps) => (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M12 2C6.49 2 2 6.49 2 12c0 1.377.28 2.691.787 3.887.3.692.634 1.288 1.002 1.818.074.106.142.198.211.295v-.009c.159.212.325.416.498.612v-3.9a9.55 9.55 0 0 1-.226-.745A7.99 7.99 0 0 1 4 12.06C4 7.65 7.59 4 12 4s8 3.59 8 8c.009.45-.046.98-.145 1.5h2.03c.075-.506.115-1.02.115-1.5 0-5.51-4.49-10-10-10zm0 7c-1.66 0-3 1.34-3 3 .021.58.15 1.036.397 1.5h5.206c.256-.46.394-1.043.397-1.5 0-1.66-1.34-3-3-3z' />
      <g>
        <path
          d='M6 22.5V15h1.07l2.678 5.307L12.425 15h1.071v7.5h-1.285v-4.316L10.283 22.5h-1.07l-1.928-4.316V22.5ZM15 22.5V15h1.5v7.5z'
          transform='matrix(.99998 0 0 .99998 0 0)'
        />
        <path
          d='M18 15v7.493h2.5s2.002-.063 2.002-3.743c0-3.68-2.002-3.75-2.002-3.75Zm2.14 6h-.64v-4.5h.64s.86 0 .86 2.25-.86 2.25-.86 2.25Z'
          transform='matrix(.99998 0 0 .99998 0 0)'
        />
      </g>
    </SvgIcon>
  ),
  { muiName: 'TypeMidPoint' }
);
